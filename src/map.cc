#include <cassert>
#include <stdexcept>

#include "map.hh"

namespace
{
constexpr uint32_t kNoPanda = 0xffffffff;
}

bool operator==(position a, position b)
{
    return std::pair(a.x, a.y) == std::pair(b.x, b.y);
}

bool operator!=(position a, position b)
{
    return std::pair(a.x, a.y) != std::pair(b.x, b.y);
}

bool operator<(position a, position b)
{
    return std::pair(a.x, a.y) < std::pair(b.x, b.y);
}

Cell::Cell()
    : kind_(CellKind::Invalid)
    , data_(0)
    , panda_data_(0)
{
}
Cell::Cell(CellKind kind, PontPolarity polarity, uint32_t data,
           uint32_t panda_data = kNoPanda)
    : kind_(kind)
    , polarity_(polarity)
    , data_(data)
    , panda_data_(panda_data)
{
}

// static
Cell Cell::invalid()
{
    return Cell(CellKind::Invalid, PontPolarity::Undefined, 0);
}

// static
Cell Cell::empty()
{
    return Cell(CellKind::Empty, PontPolarity::Undefined, 0);
}

Cell Cell::wall()
{
    return Cell(CellKind::Wall, PontPolarity::Undefined, 0);
}

// static
Cell Cell::pont(int valeur, direction direction, PontPolarity polarity)
{
    return Cell(CellKind::Pont, polarity,
                (int32_t)valeur << 16 | direction << 1);
}

// static
Cell Cell::bebe(int joueur, int num)
{
    return Cell(CellKind::Bebe, PontPolarity::Undefined,
                (int32_t)joueur << 16 | num);
}

CellKind Cell::kind() const
{
    return kind_;
}

bool Cell::is_invalid() const
{
    return kind_ == CellKind::Invalid;
}

bool Cell::is_empty() const
{
    return kind_ == CellKind::Empty;
}

bool Cell::is_wall() const
{
    return kind_ == CellKind::Wall;
}

PontPolarity Cell::get_polarity() const
{
    return polarity_;
}

bool Cell::is_pont(int* valeur, direction* direction) const
{
    if (kind_ != CellKind::Pont)
        return false;

    if (valeur)
        *valeur = data_ >> 16;
    if (direction)
        *direction = (enum direction)((data_ & 0xffff) >> 1);

    return true;
}

bool Cell::is_bebe(int* joueur, int* num) const
{
    if (kind_ != CellKind::Bebe)
        return false;

    if (joueur)
        *joueur = data_ >> 16;
    if (num)
        *num = data_ & 0xffff;

    return true;
}

bool Cell::has_panda(int* joueur, int* num) const
{
    if (panda_data_ == kNoPanda)
        return false;

    assert(kind_ == CellKind::Pont);

    if (joueur)
        *joueur = panda_data_ >> 16;
    if (num)
        *num = panda_data_ & 0xffff;

    return true;
}

Cell Cell::with_panda(int joueur, int num) const
{
    return Cell(kind_, polarity_, data_, joueur << 16 | num);
}

Cell Cell::without_panda() const
{
    return Cell(kind_, polarity_, data_, kNoPanda);
}

Cell Cell::set_polarity(PontPolarity polarity) const
{
    return Cell(kind_, polarity, data_, panda_data_);
}

bool Cell::operator==(Cell other) const
{
    return kind_ == other.kind_ && data_ == other.data_ &&
           panda_data_ == other.panda_data_;
}

Map::Map(int width, int height)
{
    assert(width > 0 && height > 0);

    std::vector<Cell> empty_line(width, Cell::empty());

    cells_.resize(height, empty_line);
}

Cell match_polarity(const Cell& cell_a, const Cell& cell_b)
{
    if (cell_a.get_polarity() == PontPolarity::Undefined &&
        cell_b.get_polarity() != PontPolarity::Undefined)
        return cell_a.set_polarity(cell_b.get_polarity() == PontPolarity::Start
                                       ? PontPolarity::End
                                       : PontPolarity::Start);
    return cell_a;
}

Map::Map(std::istream& input, int num_players)
{
    assert(num_players > 0);

    // Read dimensions.
    size_t width, height;

    input >> width;
    input >> height;

    if (input.peek() == '\r')
        input.get();

    assert(width > 0 && height > 0);
    assert(input.get() == '\n');

    cells_.reserve(height);

    // Read cells.
    char data[4] = {0};

    for (size_t y = 0; y < height; y++)
    {
        std::vector<Cell> line;
        line.reserve(width);

        for (size_t x = 0; x < width; x++)
        {
            // Every cell is represented by three characters followed by either
            // a line break or a single space character.
            int read = input.read(data, 4).gcount();

            if (x == width - 1)
            {
                if (read == 4 && data[3] == '\r')
                    data[3] = input.get();

                assert(read == 3 || (read == 4 && data[3] == '\n'));
            }
            else
            {
                assert(read == 4 && data[3] == ' ');
            }

            int panda = -1, player = -1;

            switch (data[0])
            {
            case 'A': // Panda 1 of player 1.
                player = 0;
                panda = 0;
                goto bridge;
            case 'B': // Panda 2 of player 1.
                player = 0;
                panda = 1;
                goto bridge;
            case 'X': // Panda 1 of player 2.
                player = 1;
                panda = 0;
                goto bridge;
            case 'Y': // Panda 2 of player 2.
                player = 1;
                panda = 1;
                goto bridge;

            case 'C': // Baby of player 1.
            case 'Z': // Baby of player 2.
            {
                assert(data[1] >= '0' && data[1] <= '9' && data[2] >= '0' &&
                       data[2] <= '9');

                const int player = data[0] == 'C' ? 0 : 1;
                const int n = (data[1] - '0') * 10 + data[2] - '0';

                assert(n > 0);

                line.push_back(Cell::bebe(player, n - 1));
            }
            break;

            case '#': // Wall
                assert(data[1] == '#' && data[2] == '#');

                line.push_back(Cell::wall());
                break;

            case '_': // Empty cell.
                assert(data[1] == '_' && data[2] == '_');

                line.push_back(Cell::empty());
                break;

            case '-':
            case '+':
            bridge:
            {
                // Bridge.
                assert(data[1] >= '1' && data[1] <= '6' && data[2] >= '1' &&
                       data[2] <= '6');

                const int n = data[1] - '0';
                const int direction = data[2] - '1';
                PontPolarity polarity = PontPolarity::Undefined;
                if (data[0] == '+')
                    polarity = PontPolarity::Start;
                if (data[0] == '-')
                    polarity = PontPolarity::End;

                Cell cell = Cell::pont(n, (enum direction)direction, polarity);

                if (panda != -1 && player != -1)
                {
                    cell = cell.with_panda(player, panda);
                }

                line.push_back(cell);
            }
            break;

            default:
                // Invalid.
                assert(!"Case invalide");
                break;
            }
        }
        assert(line.size() == width);

        cells_.push_back(std::move(line));
    }
    assert(cells_.size() == height);

    // For every cell, make sure that bridge directions make sense.
    for (size_t y = 0; y < height; y++)
        for (size_t x = 0; x < width; x++)
        {
            const position pos = {(int)x, (int)y};
            const Cell& cell = get(pos);

            int value;
            direction dir;

            if (cell.is_pont(&value, &dir))
            {
                const position other_pos = get_relative_position(pos, dir);
                assert(is_valid(other_pos));
                const Cell& other_cell = get(other_pos);

                direction other_dir;

                assert(other_cell.is_pont(nullptr, &other_dir));
                assert(get_relative_position(other_pos, other_dir) == pos);

                set(pos, match_polarity(cell, other_cell));
                set(other_pos, match_polarity(other_cell, cell));

                assert(get(pos).get_polarity() != PontPolarity::Undefined);
                assert(get(other_pos).get_polarity() !=
                       PontPolarity::Undefined);
                assert(get(pos).get_polarity() !=
                       get(other_pos).get_polarity());
            }
        }
}

int Map::width() const
{
    return cells_[0].size();
}

int Map::height() const
{
    return cells_.size();
}

bool Map::is_valid(position pos) const
{
    const auto [x, y] = pos;

    return x >= 0 && y >= 0 && x < width() && y < height();
}

bool Map::is_lower(position pos) const
{
    // Even columns are lower.
    return (pos.x & 1) == 0;
}

Cell Map::get(position pos) const
{
    if (!is_valid(pos))
        return Cell::invalid();
    return cells_[pos.y][pos.x];
}

bool Map::set(position pos, Cell cell)
{
    if (!is_valid(pos) || cell.is_invalid())
    {
        return false;
    }

    cells_[pos.y][pos.x] = cell;

    return true;
}

std::vector<position> Map::get_adjacent_positions(position pos) const
{
    if (!is_valid(pos))
    {
        return {};
    }

    std::vector<position> positions;
    positions.reserve(6);

    // Above?
    if (pos.y > 0)
    {
        positions.push_back({pos.x, pos.y - 1});
    }

    // Below?
    if (pos.y < height() - 1)
    {
        positions.push_back({pos.x, pos.y + 1});
    }

    // Compute y values for positions on left and right of the given position.
    int above_y = pos.y - 1;
    int below_y = pos.y;

    if (is_lower(pos))
    {
        above_y++;
        below_y++;
    }

    // Left? Right?
    for (auto x : {pos.x - 1, pos.x + 1})
    {
        if (x == -1 || x == width())
        {
            continue;
        }

        // Above?
        if (above_y >= 0)
        {
            positions.push_back({x, above_y});
        }

        // Below?
        if (below_y < height())
        {
            positions.push_back({x, below_y});
        }
    }

    return positions;
}

position Map::get_relative_position(position pos, direction direction) const
{
    const int y_diff = is_lower(pos) ? 0 : 1;

    switch (direction)
    {
    case NORD_EST:
        return {pos.x + 1, pos.y - y_diff};
    case SUD_EST:
        return {pos.x + 1, pos.y + 1 - y_diff};
    case SUD:
        return {pos.x, pos.y + 1};
    case SUD_OUEST:
        return {pos.x - 1, pos.y + 1 - y_diff};
    case NORD_OUEST:
        return {pos.x - 1, pos.y - y_diff};
    case NORD:
        return {pos.x, pos.y - 1};
    default:
        throw std::invalid_argument("The given direction is invalid");
    }
}

int Map::get_relative_direction(position origin, position towards) const
{
    if (origin.x == towards.x)
    {
        // Same column, so it's either South or North.
        if (origin.y + 1 == towards.y)
        {
            return SUD;
        }

        if (origin.y - 1 == towards.y)
        {
            return NORD;
        }

        return -1;
    }

    const int y_diff = is_lower(origin) ? 0 : 1;

    if (origin.x + 1 == towards.x)
    {
        // East.
        if (origin.y - y_diff == towards.y)
        {
            return NORD_EST;
        }

        if (origin.y + 1 - y_diff == towards.y)
        {
            return SUD_EST;
        }
    }
    else if (origin.x - 1 == towards.x)
    {
        // West.
        if (origin.y - y_diff == towards.y)
        {
            return NORD_OUEST;
        }

        if (origin.y + 1 - y_diff == towards.y)
        {
            return SUD_OUEST;
        }
    }

    return -1;
}

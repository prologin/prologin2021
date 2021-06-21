#include <cassert>
#include <stdexcept>

#include "map.hh"

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
{
}
Cell::Cell(CellKind kind, uint64_t data = 0)
    : kind_(kind)
    , data_(data)
{
}

// static
Cell Cell::invalid()
{
    return Cell(CellKind::Invalid);
}

// static
Cell Cell::empty()
{
    return Cell(CellKind::Empty);
}

// static
Cell Cell::panda(int joueur, int num)
{
    return Cell(CellKind::Panda, (int64_t)joueur << 32 | num);
}

// static
Cell Cell::pont(int valeur, direction direction)
{
    return Cell(CellKind::Pont, (int64_t)valeur << 32 | direction);
}

// static
Cell Cell::bebe(int joueur, int num)
{
    return Cell(CellKind::Bebe, (int64_t)joueur << 32 | num);
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

bool Cell::is_panda(int* joueur, int* num) const
{
    *joueur = data_ >> 32;
    *num = data_ & 0xffffffff;

    return kind_ == CellKind::Panda;
}

bool Cell::is_pont(int* valeur, direction* direction) const
{
    *valeur = data_ >> 32;
    *direction = (enum direction)(data_ & 0xffffffff);

    return kind_ == CellKind::Pont;
}

bool Cell::is_bebe(int* joueur, int* num) const
{
    *joueur = data_ >> 32;
    *num = data_ & 0xffffffff;

    return kind_ == CellKind::Bebe;
}

bool Cell::operator==(Cell other) const
{
    return kind_ == other.kind_ && data_ == other.data_;
}

Map::Map(int width, int height)
{
    assert(width > 0 && height > 0);

    std::vector<Cell> empty_line(width, Cell::empty());

    cells_.resize(height, empty_line);
}

Map::Map(std::istream& input, int num_players)
{
    assert(num_players > 0);

    // Read dimensions.
    int width, height;

    input >> width;
    input >> height;

    assert(width > 0 && height > 0);
    assert(input.get() == '\n');

    cells_.reserve(height);

    // Read cells.
    char data[4] = {0};

    for (int y = 0; y < height; y++)
    {
        std::vector<Cell> line;
        line.reserve(width);

        for (int x = 0; x < width; x++)
        {
            // Every cell is represented by two characters followed by either
            // a line break or a single space character.
            input.read(data, 3);

            if (x == width - 1)
            {
                assert(data[2] == '\n' || data[2] == 0);
            }
            else
            {
                assert(data[2] == ' ');
            }

            switch (data[0])
            {
            case '_':
            {
                // Empty cell.
                assert(data[1] == '_');

                line.push_back(Cell::empty());
            }
            break;

            case 'P':
            {
                // Panda.
                assert(data[1] >= '0' && data[1] <= '9');

                const int n = data[1] - '0';

                line.push_back(Cell::panda(n % num_players, n / num_players));
            }
            break;

            case 'B':
            {
                // Baby.
                assert(data[1] >= '0' && data[1] <= '9');

                const int n = data[1] - '0';

                line.push_back(Cell::bebe(n % num_players, n / num_players));
            }
            break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            {
                // Bridge.
                assert(data[1] >= '1' && data[1] <= '6');

                const int n = data[0] - '0';
                const int direction = data[1] - '1';

                line.push_back(Cell::pont(n, (enum direction)direction));
            }
            break;

            default:
                // Invalid.
                assert(!"Case invalide");
                break;
            }
        }

        cells_.push_back(std::move(line));
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

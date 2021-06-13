#include <cassert>

#include "map.hh"

Cell::Cell() : kind_(CellKind::Invalid), data_(0) {}
Cell::Cell(CellKind kind, uint64_t data = 0) : kind_(kind), data_(data) {}

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
Cell Cell::pont(int valeur, int direction)
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
    *num = data_ & 0xffff;

    return kind_ == CellKind::Panda;
}

bool Cell::is_pont(int* valeur, int* direction) const
{
    *valeur = data_ >> 32;
    *direction = data_ & 0xffff;

    return kind_ == CellKind::Pont;
}

bool Cell::is_bebe(int* joueur, int* num) const
{
    *joueur = data_ >> 32;
    *num = data_ & 0xffff;

    return kind_ == CellKind::Bebe;
}

Map::Map(int width, int height)
{
    assert(width > 0 && height > 0);

    std::vector<Cell> empty_line(width, Cell::empty());

    cells_.resize(height, empty_line);
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
    auto [x, y] = pos;

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

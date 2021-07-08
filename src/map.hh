// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2021 Association Prologin <association@prologin.org>

#pragma once

#include <istream>
#include <vector>

#include "constant.hh"

bool operator==(position a, position b);
bool operator!=(position a, position b);
bool operator<(position a, position b);

enum class CellKind
{
    Invalid,
    Empty,
    Bebe,
    Pont,
};

enum class PontPolarity
{
    Undefined,
    Start,
    End,
};

class Cell
{
public:
    // Default constructor; returns an invalid cell.
    Cell();

    CellKind kind() const;

    bool is_invalid() const;
    bool is_empty() const;
    bool is_bebe(int* joueur, int* num) const;
    bool is_pont(int* valeur, direction* direction) const;
    bool has_panda(int* joueur, int* num) const;
    PontPolarity get_polarity() const;

    static Cell invalid();
    static Cell empty();
    static Cell bebe(int joueur, int num);
    static Cell pont(int valeur, direction direction, PontPolarity polarity);

    Cell with_panda(int joueur, int num) const;
    Cell without_panda() const;
    Cell set_polarity(PontPolarity polarity) const;

    bool operator==(Cell other) const;

private:
    Cell(CellKind kind, PontPolarity polarity, uint32_t data,
         uint32_t panda_data);

    CellKind kind_;
    PontPolarity polarity_;
    uint32_t data_;
    uint32_t panda_data_;
};

// The map is an hexagonal grid, and uses the "even-q" coordinate system.
//
// See https://www.redblobgames.com/grids/hexagons#coordinates-offset
// for more information.
class Map
{
public:
    Map(int width, int height);
    Map(std::istream& input, int num_players);

    int width() const;
    int height() const;

    // Returns whether the given position is valid.
    bool is_valid(position pos) const;
    // Returns whether the given position is in a "lower" column of the grid.
    bool is_lower(position pos) const;

    // Returns the cell at the given position.
    Cell get(position pos) const;
    // Sets the cell at the given position. Returns `false` if the given
    // position or cell is invalid.
    bool set(position pos, Cell cell);

    // Returns valid positions around the given position.
    std::vector<position> get_adjacent_positions(position pos) const;

    // Returns the position relative to the given position, and in the given
    // direction. The returned position may go out of the bounds of the map;
    // is_valid should be called to ensure it is indeed a valid position.
    position get_relative_position(position pos, direction direction) const;

    // Returns the direction such that get_relative_position(origin, direction)
    // == towards. Returns -1 if no such direction exists.
    int get_relative_direction(position origin, position towards) const;

private:
    std::vector<std::vector<Cell>> cells_;
};

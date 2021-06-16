// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2021 Association Prologin <association@prologin.org>

#include "player.hh"

#include <cassert>
#include <stdexcept>

Bebe::Bebe(Map& map, int joueur, int num, position pos)
    : map_(map)
    , joueur_(joueur)
    , num_(num)
    , pos_(pos)
{
    if (!map_.is_valid(pos))
        throw std::invalid_argument("Invalid position coordinates");

    map.set(pos, Cell::bebe(joueur, num));
}

bool Bebe::is_saved()
{
    return saved_;
}

position Bebe::get_pos()
{
    return pos_;
}

bool Bebe::set_pos(position pos)
{
    if (!map_.is_valid(pos))
        return false;

    pos_ = pos;
    map_.set(pos, Cell::bebe(joueur_, num_));

    return true;
}

void Bebe::save()
{
    // Maybe remove him from the map too since he'll be with his parent
    saved_ = true;
}

Panda::Panda(Map& map, int joueur, int num, position pos)
    : map_(map)
    , joueur_(joueur)
    , num_(num)
    , pos_(pos)
{
    if (!map_.is_valid(pos))
        throw std::invalid_argument("Invalid position coordinates");

    map.set(pos, Cell::panda(joueur, num));
}

position Panda::get_pos() const
{
    return pos_;
}

bool Panda::set_pos(position pos)
{
    if (!map_.is_valid(pos))
        return false;

    pos_ = pos;
    map_.set(pos, Cell::panda(joueur_, num_));

    return true;
}

Player::Player(Panda& panda_one, Panda& panda_two, std::vector<Bebe>& bebes)
    : panda_one_(panda_one)
    , panda_two_(panda_two)
    , bebes_(bebes)
{
}

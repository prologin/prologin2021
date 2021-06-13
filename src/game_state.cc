// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2015 Association Prologin <association@prologin.org>

#include "game_state.hh"

GameState::GameState(const rules::Players& players, Map map)
    : rules::GameState(players), map_(std::move(map))
{
}

GameState::GameState(const GameState& st)
    : rules::GameState(st), map_(st.map_)
{
    // FIXME
}

GameState::~GameState()
{
    // FIXME
}

GameState* GameState::copy() const
{
    return new GameState(*this);
}

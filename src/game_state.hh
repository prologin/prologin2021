// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2015 Association Prologin <association@prologin.org>

#pragma once

#include <rules/game-state.hh>
#include <rules/player.hh>

#include "map.hh"

class GameState final : public rules::GameState
{
public:
    // FIXME
    // additional parameters? for instance map
    GameState(const rules::Players& players, Map map);
    GameState(const GameState& st);
    ~GameState();

    const Map& map() const { return map_; }
    Map& map() { return map_; }

    GameState* copy() const override;

private:
    Map map_;
};

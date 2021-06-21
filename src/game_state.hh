// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2015 Association Prologin <association@prologin.org>

#pragma once

#include <rules/game-state.hh>
#include <rules/player.hh>

#include "map.hh"
#include "player.hh"

class GameState final : public rules::GameState
{
public:
    // FIXME
    // additional parameters? for instance map
    GameState(const rules::Players& players, Map map);
    GameState(const GameState& st);
    ~GameState();

    const Map& map() const { return map_; }
    const std::vector<Player>& players() const { return own_players_; }

    // Returns a pointer to the player with the given identifier. If no such
    // player exists, nullptr is returned.
    const Player* player_at(int id) const;

    GameState* copy() const override;

private:
    Map map_;
    // Note: `players_` already exists in rules::GameState, so for clarity's
    // sake we use a slightly different name here.
    std::vector<Player> own_players_;
};

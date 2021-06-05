// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#pragma once

#include <rules/action.hh>

#include "actions.hh"
#include "constant.hh"
#include "game_state.hh"

class ActionPoser : public rules::Action<GameState>
{
public:
    ActionPoser(int id_panda, direction dir, int pont_debut, int pont_fin, int player_id)
        : id_panda_(id_panda)
        , dir_(dir)
        , pont_debut_(pont_debut)
        , pont_fin_(pont_fin)
        , player_id_(player_id)
    {
    }
    ActionPoser() {} // for register_action()

    int check(const GameState& st) const override;
    void apply_on(GameState* st) const override;

    void handle_buffer(utils::Buffer& buf) override
    {
        buf.handle(id_panda_);
        buf.handle(dir_);
        buf.handle(pont_debut_);
        buf.handle(pont_fin_);
        buf.handle(player_id_);
    }

    uint32_t player_id() const override { return player_id_; };
    uint32_t id() const override { return ID_ACTION_POSER; }

private:
    int id_panda_;
    direction dir_;
    int pont_debut_;
    int pont_fin_;
    int player_id_;
};


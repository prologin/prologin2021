// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include "actions.hh"
#include "history.hh"

int ActionDebugAfficherDrapeau::check(const GameState& st) const
{
    if (!st.map().is_valid(pos_))
        return POSITION_INVALIDE;
    if (drapeau_ < 0 || (int)drapeau_ >= 4)
        return DRAPEAU_INVALIDE;
    return OK;
}

void ActionDebugAfficherDrapeau::apply_on(GameState* st) const
{
    Player& player = *st->player_at(player_id_);

    internal_action action;
    action.type = flag;
    action.flag.pos = pos_;
    action.flag.ctype = drapeau_;
    player.add_internal_action(action);
}

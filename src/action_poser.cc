// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include "actions.hh"

int ActionPoser::check(const GameState& st) const
{
    // Ensure the given values are valid.
    if (pont_debut_ < 1 || pont_debut_ > 6)
        return POSE_INVALIDE;
    if (pont_fin_ < 1 || pont_fin_ > 6)
        return POSE_INVALIDE;

    // Ensure the player hasn't done anything else this round.
    const Player& player = *st.player_at(player_id_);

    if (!player.last_actions().empty())
        return ACTION_DEJA_EFFECTUEE;

    // Ensure start position is around the panda.
    const Panda& panda = *player.panda_at(st.round_panda_id());
    const position start_pos = position_debut_;

    if (st.map().get_relative_direction(panda.pos(), start_pos) == -1)
        return POSE_INVALIDE;

    // Ensure start position is empty.
    if (!st.map().get(start_pos).is_empty())
        return POSE_INVALIDE;

    // Ensure end position is empty.
    const position end_pos = st.map().get_relative_position(start_pos, dir_);

    if (!st.map().get(end_pos).is_empty())
        return POSE_INVALIDE;

    // Ensure the given value is the same as the one where the panda is
    // currently standing.
    int current_value;

    assert(st.map().get(panda.pos()).is_pont(&current_value, nullptr, nullptr));

    if (current_value != pont_debut_)
        return POSE_INVALIDE;

    return 0;
}

void ActionPoser::apply_on(GameState* st) const
{
    Map& map = st->map();

    // Update map.
    const position start_pos = position_debut_;
    const position end_pos = map.get_relative_position(start_pos, dir_);
    const direction start_dir = dir_;
    const direction end_dir =
        (direction)map.get_relative_direction(end_pos, start_pos);

    map.set(start_pos,
            Cell::pont(pont_debut_, start_dir, /* is_start= */ true));
    map.set(end_pos, Cell::pont(pont_fin_, end_dir, /* is_start= */ false));

    // Log action.
    action_hist action;
    action.type_action = ACTION_POSER;
    action.id_panda = st->round_panda_id();
    action.dir = dir_;
    action.type_pont = pont_debut_;

    st->player_at(player_id_)->log_action(action);
}

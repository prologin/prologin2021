// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include "actions.hh"

int ActionDeplacer::check(const GameState& st) const
{
    // Ensure the specified panda exists.
    const Panda* panda = st.player_at(player_id_)->panda_at(id_panda_);

    if (panda == nullptr)
        return ID_PANDA_INVALIDE;

    // Ensure moving in the given direction won't bring us out of bounds.
    const position target_position =
        st.map().get_relative_position(panda->pos(), dir_);
    const Cell target_cell = st.map().get(target_position);

    if (target_cell.is_invalid())
        return DEPLACEMENT_HORS_LIMITES;

    // Ensure the target cell is an empty bridge.
    int target_value, target_player, target_panda;
    direction target_dir;

    if (!target_cell.is_pont(&target_value, &target_dir) || target_cell.has_panda(&target_player, &target_panda))
        return MOUVEMENT_INVALIDE;

    // Ensure the value of both bridges is the same.
    const Cell source_cell = st.map().get(panda->pos());
    int source_value;
    direction source_dir;

    assert(source_cell.is_pont(&source_value, &source_dir));

    if (target_value != source_value)
        return MOUVEMENT_INVALIDE;

    return OK;
}

void ActionDeplacer::apply_on(GameState* st) const
{
    Map& map = st->map();
    Panda& panda = *st->player_at(player_id_)->panda_at(id_panda_);
    const position desired_position = map.get_relative_position(panda.pos(), dir_);

    // Update map and positions.
    map.set(desired_position,
            map.get(desired_position).with_panda(player_id_, id_panda_));
    map.set(panda.pos(), map.get(panda.pos()).without_panda());

    panda.update_pos(desired_position);

    // TODO: update value of both ends of the bridge.

    // Pick up adjacent baby pandas, if any.
    for (const position adjacent_pos : map.get_adjacent_positions(desired_position))
    {
        int player, num;

        if (map.get(adjacent_pos).is_bebe(&player, &num) && player == player_id_)
        {
            Bebe& bebe = *st->player_at(player_id_)->bebe_at(num);

            map.set(adjacent_pos, Cell::empty());
            panda.save_bebe(bebe);
        }
    }
}

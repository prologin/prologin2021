// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include "actions.hh"

int ActionDeplacer::check(const GameState& st) const
{
    const Panda& panda =
        *st.player_at(player_id_)->panda_at(st.round_panda_id());

    // Ensure moving in the given direction won't bring us out of bounds.
    const position target_position =
        st.map().get_relative_position(panda.pos(), dir_);
    if (!st.map().is_valid(target_position))
        return DEPLACEMENT_HORS_LIMITES;
    const Cell target_cell = st.map().get(target_position);

    if (target_cell.is_invalid())
        return DEPLACEMENT_HORS_LIMITES;

    // Ensure the target cell is an empty bridge.
    int target_value;

    if (!target_cell.is_pont(&target_value, nullptr) ||
        target_cell.has_panda(nullptr, nullptr))
        return MOUVEMENT_INVALIDE;

    // If the cells belong to different bridges, ensure their values are equal.
    const Cell source_cell = st.map().get(panda.pos());

    int source_value;
    direction source_dir;

    assert(source_cell.is_pont(&source_value, &source_dir));

    const bool is_same_brige = source_dir == dir_;

    if (!is_same_brige && target_value != source_value)
        return MOUVEMENT_INVALIDE;

    auto visited = st.player_at(player_id_)->get_visited_position();
    if (visited.find(std::make_pair(panda.id(), target_position)) !=
        visited.end())
        return DEPLACEMENT_EN_ARRIERE;

    return OK;
}

void ActionDeplacer::apply_on(GameState* st) const
{
    Map& map = st->map();
    Player& player = *st->player_at(player_id_);
    Panda& panda = *player.panda_at(st->round_panda_id());
    const position previous_position = panda.pos();
    const position desired_position =
        map.get_relative_position(panda.pos(), dir_);

    // Compute new value of the cell that was left.
    const Cell previous_cell = map.get(previous_position);
    int previous_cell_value;
    PontPolarity previous_cell_polarity = previous_cell.get_polarity();
    direction previous_cell_direction;

    assert(
        previous_cell.is_pont(&previous_cell_value, &previous_cell_direction));
    assert(previous_cell_polarity != PontPolarity::Undefined);

    if (previous_cell_polarity == PontPolarity::Start)
    {
        // Increase cell value.
        previous_cell_value =
            previous_cell_value == 6 ? 1 : previous_cell_value + 1;
    }
    else
    {
        // Decrease cell value.
        previous_cell_value =
            previous_cell_value == 1 ? 6 : previous_cell_value - 1;
    }

    Cell updated_previous_cell = Cell::pont(
        previous_cell_value, previous_cell_direction, previous_cell_polarity);

    // Update map and positions.
    map.set(desired_position,
            map.get(desired_position).with_panda(player.id(), panda.id()));
    map.set(previous_position, updated_previous_cell);

    panda.update_pos(desired_position);

    // Pick up adjacent baby pandas, if any.
    for (const position adjacent_pos :
         map.get_adjacent_positions(desired_position))
    {
        int player_id, num;

        if (map.get(adjacent_pos).is_bebe(&player_id, &num) &&
            player_id == player.id())
        {
            Bebe& bebe = *player.bebe_at(num);

            map.set(adjacent_pos, Cell::empty());
            panda.save_bebe(bebe);

            // Also update player score.
            player.rules_player().score += NB_POINTS_CAPTURE_BEBE;

            if (std::find_if(player.bebes().begin(), player.bebes().end(),
                             [&](const Bebe& bebe) {
                                return !bebe.is_saved();
                             }) == player.bebes().end())
                player.rules_player().score += 10000;
        }
    }

    // Log action.
    internal_action action;
    action.type = standard_action;
    action.action.type_action = ACTION_DEPLACER;
    action.action.action_id_panda = st->round_panda_id();
    action.action.dir = dir_;

    player.add_internal_action(action);
    player.add_visited_position(panda.id(), previous_position);
}

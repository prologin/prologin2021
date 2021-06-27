// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include "actions.hh"

int ActionDeplacer::check(const GameState& st) const
{
    const Panda* panda = st.player_at(player_id_)->panda_at(id_panda_);

    // Maybe add some more conditions

    if (panda == nullptr)
        return ID_PANDA_INVALIDE;

    position desired_position =
        st.map().get_relative_position(panda->pos(), dir_);

    if (st.map().is_valid(desired_position))
        return DEPLACEMENT_HORS_LIMITES;

    int valeur;
    direction dir;
    if (!st.map().get(desired_position).is_pont(&valeur, &dir) || dir != dir_)
        return MOUVEMENT_INVALIDE;

    return OK;
}

void ActionDeplacer::apply_on(GameState* st) const
{
    Map& map = st->map();
    Panda* panda = st->player_at(player_id_)->panda_at(id_panda_);
    position desired_position = map.get_relative_position(panda->pos(), dir_);

    // How do we want to manage errors???
    map.set(desired_position,
            map.get(desired_position).with_panda(player_id_, id_panda_));
    map.set(panda->pos(), map.get(panda->pos()).without_panda());

    // TODO: capture bebe when next to it.

    panda->update_pos(desired_position);
}

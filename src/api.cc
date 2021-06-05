// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include "api.hh"

#include <memory>
#include <utility>

// global used in interface.cc
Api* api;

Api::Api(std::unique_ptr<GameState> game_state,
         std::shared_ptr<rules::Player> player)
    : rules::Api<GameState, error>(std::move(game_state), player)
{
    api = this;
}

std::vector<direction> Api::chemin(position pos1, position pos2)
{
    // TODO
    abort();
}
case_type Api::type_case(position pos)
{
    // TODO
    abort();
}
int Api::panda_sur_case(position pos)
{
    // TODO
    abort();
}
bool Api::bebe_panda_sur_case(position pos)
{
    // TODO
    abort();
}
position Api::position_panda(int id_joueur, int id_panda)
{
    // TODO
    abort();
}
pont_type Api::info_pont(position pos)
{
    // TODO
    abort();
}
panda_info Api::info_panda(position pos)
{
    // TODO
    abort();
}
std::vector<panda_info> Api::liste_pandas()
{
    // TODO
    abort();
}
std::vector<action_hist> Api::historique()
{
    // TODO
    abort();
}
int Api::score(int id_joueur)
{
    // TODO
    abort();
}
int Api::moi()
{
    // TODO
    abort();
}
int Api::adversaire()
{
    // TODO
    abort();
}
tour_info Api::info_tour()
{
    // TODO
    abort();
}
void Api::afficher_case_type(case_type v)
{
    // TODO
    abort();
}
void Api::afficher_direction(direction v)
{
    // TODO
    abort();
}
void Api::afficher_erreur(erreur v)
{
    // TODO
    abort();
}
void Api::afficher_action_type(action_type v)
{
    // TODO
    abort();
}
void Api::afficher_position(position v)
{
    // TODO
    abort();
}
void Api::afficher_pont_type(pont_type v)
{
    // TODO
    abort();
}
void Api::afficher_panda_info(panda_info v)
{
    // TODO
    abort();
}
void Api::afficher_bebe_info(bebe_info v)
{
    // TODO
    abort();
}
void Api::afficher_tour_info(tour_info v)
{
    // TODO
    abort();
}
void Api::afficher_action_hist(action_hist v)
{
    // TODO
    abort();
}

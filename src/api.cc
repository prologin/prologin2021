// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include "api.hh"

#include <memory>
#include <utility>

// global used in interface.cc
Api* api;

Api::Api(std::unique_ptr<GameState> game_state,
         std::shared_ptr<rules::Player> player)
    : rules::Api<GameState, erreur>(std::move(game_state), player)
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

std::vector<position> Api::positions_adjacentes(position pos)
{
    return game_state_->map().get_adjacent_positions(pos);
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

std::ostream& operator<<(std::ostream& os, case_type v);
void Api::afficher_case_type(case_type v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, direction v);
void Api::afficher_direction(direction v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, erreur v);
void Api::afficher_erreur(erreur v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, action_type v);
void Api::afficher_action_type(action_type v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, position v);
void Api::afficher_position(position v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, pont_type v);
void Api::afficher_pont_type(pont_type v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, panda_info v);
void Api::afficher_panda_info(panda_info v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, bebe_info v);
void Api::afficher_bebe_info(bebe_info v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, tour_info v);
void Api::afficher_tour_info(tour_info v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, action_hist v);
void Api::afficher_action_hist(action_hist v)
{
    std::cerr << v << std::endl;
}

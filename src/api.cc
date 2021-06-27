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
    int player, id;

    if (game_state_->map().get(pos).has_panda(&player, &id))
    {
        return player;
    }

    return -1;
}

int Api::bebe_panda_sur_case(position pos)
{
    int player, id;

    if (game_state_->map().get(pos).is_bebe(&player, &id))
    {
        return player;
    }

    return -1;
}

position Api::position_panda(int id_joueur, int id_panda)
{
    const Player* player = game_state_->player_at(id_joueur);

    if (player == nullptr)
    {
        return {-1, -1};
    }

    const Panda* panda = player->panda_at(id_panda);

    if (panda == nullptr)
    {
        return {-1, -1};
    }

    return panda->pos();
}

pont_type Api::info_pont(position pos)
{
    const Map& map = game_state_->map();

    int value;
    direction dir;

    if (!map.get(pos).is_pont(&value, &dir))
    {
        return {{-1, -1}, {-1, -1}, -1, -1};
    }

    position other_pos = map.get_relative_position(pos, dir);
    int other_value;
    direction other_dir;

    assert(map.get(other_pos).is_pont(&other_value, &other_dir));

    pont_type info;
    info.debut_pos = pos;
    info.debut_val = value;
    info.fin_pos = other_pos;
    info.fin_val = other_value;
    return info;
}

panda_info Api::info_panda(position pos)
{
    int player_id, id;

    if (game_state_->map().get(pos).has_panda(&player_id, &id))
    {
        const Player& player = game_state_->players().at(player_id);

        return {pos, player_id,
                (int)player.pandas().at(id).saved_bebes().size()};
    }

    return {{-1, -1}, -1, -1};
}

std::vector<panda_info> Api::liste_pandas()
{
    const std::vector<Player>& players = game_state_->players();
    std::vector<panda_info> result;
    result.reserve(players.size() * players[0].pandas().size());

    for (const Player& player : players)
        for (const Panda& panda : player.pandas())
        {
            result.push_back(
                {panda.pos(), player.id(), (int)panda.saved_bebes().size()});
        }

    return result;
}

std::vector<position> Api::positions_adjacentes(position pos)
{
    return game_state_->map().get_adjacent_positions(pos);
}

position Api::position_dans_direction(position pos, direction dir)
{
    const position result = game_state_->map().get_relative_position(pos, dir);

    if (!game_state_->map().is_valid(result))
    {
        return {-1, -1};
    }

    return result;
}

int Api::direction_entre_positions(position origine, position cible)
{
    return game_state_->map().get_relative_direction(origine, cible);
}

std::vector<action_hist> Api::historique()
{
    return game_state_->player_at(adversaire())->last_actions();
}

int Api::score(int id_joueur)
{
    return game_state_->player_at(id_joueur)->rules_player().score;
}

int Api::moi()
{
    return player_->id;
}

int Api::adversaire()
{
    assert(game_state_->player_count() == 2);

    if (player_->id == 0)
    {
        return 1;
    }

    return 0;
}

tour_info Api::info_tour()
{
    tour_info info;
    info.id_tour = game_state_->round_id();
    info.id_joueur_joue = game_state_->round_player_id();
    info.id_panda_joue = game_state_->round_panda_id();
    return info;
}

carte_info Api::info_carte()
{
    const Map& map = game_state_->map();

    return {map.width(), map.height()};
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

std::ostream& operator<<(std::ostream& os, carte_info v);
void Api::afficher_carte_info(carte_info v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, action_hist v);
void Api::afficher_action_hist(action_hist v)
{
    std::cerr << v << std::endl;
}

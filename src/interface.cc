// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#include <iostream>
#include <sstream>
#include <vector>

#include "api.hh"

// from api.cc
extern Api* api;

template <typename T>
std::ostream& operator<<(std::ostream& os, const std::vector<T>& arr)
{
    os << "[";
    typename std::vector<T>::const_iterator it;
    for (it = arr.begin(); it != arr.end(); ++it)
    {
        if (it != arr.begin())
            os << ", ";
        os << *it;
    }
    os << "]";
    return os;
}

extern "C" erreur api_deplacer(direction dir)
{
    return api->deplacer(dir);
}

extern "C" erreur api_poser(position position_debut, direction dir,
                            int pont_debut, int pont_fin)
{
    return api->poser(position_debut, dir, pont_debut, pont_fin);
}

extern "C" case_type api_type_case(position pos)
{
    return api->type_case(pos);
}

extern "C" int api_panda_sur_case(position pos)
{
    return api->panda_sur_case(pos);
}

extern "C" bool api_bebe_panda_sur_case(position pos)
{
    return api->bebe_panda_sur_case(pos);
}

extern "C" position api_position_panda(int id_joueur, int id_panda)
{
    return api->position_panda(id_joueur, id_panda);
}

extern "C" pont_type api_info_pont(position pos)
{
    return api->info_pont(pos);
}

extern "C" panda_info api_info_panda(position pos)
{
    return api->info_panda(pos);
}

extern "C" std::vector<panda_info> api_liste_pandas()
{
    return api->liste_pandas();
}

extern "C" std::vector<position> api_positions_adjacentes(position pos)
{
    return api->positions_adjacentes(pos);
}

extern "C" std::vector<action_hist> api_historique()
{
    return api->historique();
}

extern "C" int api_score(int id_joueur)
{
    return api->score(id_joueur);
}

extern "C" int api_moi()
{
    return api->moi();
}

extern "C" int api_adversaire()
{
    return api->adversaire();
}

extern "C" tour_info api_info_tour()
{
    return api->info_tour();
}

std::ostream& operator<<(std::ostream& os, case_type v)
{
    switch (v)
    {
    case LIBRE:
        os << "LIBRE";
        break;
    case OBSTACLE:
        os << "OBSTACLE";
        break;
    case PONT:
        os << "PONT";
        break;
    case BEBE:
        os << "BEBE";
        break;
    }
    return os;
}

extern "C" void api_afficher_case_type(case_type v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, direction v)
{
    switch (v)
    {
    case NORD_EST:
        os << "NORD_EST";
        break;
    case SUD_EST:
        os << "SUD_EST";
        break;
    case SUD:
        os << "SUD";
        break;
    case SUD_OUEST:
        os << "SUD_OUEST";
        break;
    case NORD_OUEST:
        os << "NORD_OUEST";
        break;
    case NORD:
        os << "NORD";
        break;
    }
    return os;
}

extern "C" void api_afficher_direction(direction v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, erreur v)
{
    switch (v)
    {
    case OK:
        os << "OK";
        break;
    case POSITION_INVALIDE:
        os << "POSITION_INVALIDE";
        break;
    case POSITION_OBSTACLE:
        os << "POSITION_OBSTACLE";
        break;
    case MAUVAIS_NOMBRE:
        os << "MAUVAIS_NOMBRE";
        break;
    case DEPLACEMENT_HORS_LIMITES:
        os << "DEPLACEMENT_HORS_LIMITES";
        break;
    case DIRECTION_INVALIDE:
        os << "DIRECTION_INVALIDE";
        break;
    case MOUVEMENT_INVALIDE:
        os << "MOUVEMENT_INVALIDE";
        break;
    case POSE_INVALIDE:
        os << "POSE_INVALIDE";
        break;
    case ID_PANDA_INVALIDE:
        os << "ID_PANDA_INVALIDE";
        break;
    case ACTION_DEJA_EFFECTUEE:
        os << "ACTION_DEJA_EFFECTUEE";
        break;
    case RIEN_A_POUSSER:
        os << "RIEN_A_POUSSER";
        break;
    case DRAPEAU_INVALIDE:
        os << "DRAPEAU_INVALIDE";
        break;
    }
    return os;
}

extern "C" void api_afficher_erreur(erreur v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, action_type v)
{
    switch (v)
    {
    case ACTION_DEPLACER:
        os << "ACTION_DEPLACER";
        break;
    case ACTION_POSER:
        os << "ACTION_POSER";
        break;
    }
    return os;
}

extern "C" void api_afficher_action_type(action_type v)
{
    std::cerr << v << std::endl;
}

std::ostream& operator<<(std::ostream& os, position v)
{
    os << "{ ";
    os << "x"
       << "=" << v.x;
    os << ", ";
    os << "y"
       << "=" << v.y;
    os << " }";
    return os;
}

extern "C" void api_afficher_position(position v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, pont_type v)
{
    os << "{ ";
    os << "debut_pos"
       << "=" << v.debut_pos;
    os << ", ";
    os << "fin_pos"
       << "=" << v.fin_pos;
    os << ", ";
    os << "debut_val"
       << "=" << v.debut_val;
    os << ", ";
    os << "fin_val"
       << "=" << v.fin_val;
    os << " }";
    return os;
}

extern "C" void api_afficher_pont_type(pont_type v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, panda_info v)
{
    os << "{ ";
    os << "panda_pos"
       << "=" << v.panda_pos;
    os << ", ";
    os << "id_joueur"
       << "=" << v.id_joueur;
    os << ", ";
    os << "num_bebes"
       << "=" << v.num_bebes;
    os << " }";
    return os;
}

extern "C" void api_afficher_panda_info(panda_info v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, bebe_info v)
{
    os << "{ ";
    os << "bebe_pos"
       << "=" << v.bebe_pos;
    os << ", ";
    os << "points_capture"
       << "=" << v.points_capture;
    os << " }";
    return os;
}

extern "C" void api_afficher_bebe_info(bebe_info v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, tour_info v)
{
    os << "{ ";
    os << "id_joueur_joue"
       << "=" << v.id_joueur_joue;
    os << ", ";
    os << "id_panda_joue"
       << "=" << v.id_panda_joue;
    os << ", ";
    os << "id_tour"
       << "=" << v.id_tour;
    os << " }";
    return os;
}

extern "C" void api_afficher_tour_info(tour_info v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, carte_info v)
{
    os << "{ ";
    os << "taille_x"
       << "=" << v.taille_x;
    os << ", ";
    os << "taille_y"
       << "=" << v.taille_y;
    os << " }";
    return os;
}

extern "C" void api_afficher_carte_info(carte_info v)
{
    std::cerr << v << std::endl;
}
std::ostream& operator<<(std::ostream& os, action_hist v)
{
    os << "{ ";
    os << "type_action"
       << "=" << v.type_action;
    os << ", ";
    os << "id_panda"
       << "=" << v.id_panda;
    os << ", ";
    os << "dir"
       << "=" << v.dir;
    os << ", ";
    os << "valeur_debut"
       << "=" << v.valeur_debut;
    os << ", ";
    os << "valeur_fin"
       << "=" << v.valeur_fin;
    os << ", ";
    os << "pos_debut"
       << "=" << v.pos_debut;
    os << ", ";
    os << "pos_fin"
       << "=" << v.pos_fin;
    os << " }";
    return os;
}

extern "C" void api_afficher_action_hist(action_hist v)
{
    std::cerr << v << std::endl;
}

extern "C" carte_info api_info_carte()
{
    return api->info_carte();
}

extern "C" position api_position_dans_direction(position pos, direction dir)
{
    return api->position_dans_direction(pos, dir);
}

extern "C" int api_direction_entre_positions(position origine, position cible)
{
    return api->direction_entre_positions(origine, cible);
}

// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#pragma once

#include <memory>
#include <string>
#include <vector>

#include <rules/api.hh>
#include <rules/player.hh>

#include "actions.hh"
#include "constant.hh"
#include "game_state.hh"

/**
 * The methods of this class are exported through 'interface.cc'
 * to be called by the clients
 */
class Api final : public rules::Api<GameState, error>
{
public:
    Api(std::unique_ptr<GameState> game_state,
        std::shared_ptr<rules::Player> player);
    ~Api() {}

    /// Déplace le panda ``id_panda`` sur le pont choisi.
    ApiActionFunc<ActionDeplacer> deplacer{this};

    /// Pose un pont dans la direction choisie à partir du panda ``id_panda``.
    ApiActionFunc<ActionPoser> poser{this};

    /// Renvoie le plus court chemin entre deux positions de la rivière sous la
    /// forme d'une suite de direction à emprunter. Ce chemin ne prend pas en
    /// compte les ponts et leurs valeurs, uniquement des déplacements. Si la
    /// position est invalide ou que le chemin n'existe pas, le chemin renvoyé
    /// est vide.
    std::vector<direction> chemin(position pos1, position pos2);

    /// Renvoie le type d'une case donnée.
    case_type type_case(position pos);

    /// Renvoie le numéro du joueur à qui appartient panda sur la case
    /// indiquée. Renvoie -1 s'il n'y a pas de panda ou si la position est
    /// invalide.
    int panda_sur_case(position pos);

    /// Indique si un bébé panda se trouve sur une case donnée. Renvoie vrai
    /// s'il y a un bébé panda sur la case. Renvoie faux autrement, ou si la
    /// position est invalide.
    bool bebe_panda_sur_case(position pos);

    /// Indique la position du panda sur la rivière désigné par le numéro
    /// ``id_panda`` appartenant au joueur ``id_joueur``. Si la description du
    /// panda est incorrecte, la position (-1, -1) est renvoyée.
    position position_panda(int id_joueur, int id_panda);

    /// Renvoie les informations relatives au pont situé à cette position. Le
    /// pont est constitué de deux cases. Si aucun pont n'est placé à cette
    /// position ou si la position est invalide, les membres debut_val et
    /// fin_val de la structure ``pont_type`` renvoyée sont initialisés à -1.
    pont_type info_pont(position pos);

    /// Renvoie la description d'un panda en fonction d'une position donnée. Si
    /// le panda n'est pas présent sur la carte, ou si la position est
    /// invalide, tous les membres de la structure ``panda_info`` renvoyée sont
    /// initialisés à -1.
    panda_info info_panda(position pos);

    /// Renvoie la liste de tous les pandas présents durant la partie.
    std::vector<panda_info> liste_pandas();

    /// Renvoie la liste des actions effectuées par l’adversaire durant son
    /// tour, dans l'ordre chronologique. Les actions de débug n'apparaissent
    /// pas dans cette liste.
    std::vector<action_hist> historique();

    /// Renvoie le score du joueur ``id_joueur``. Renvoie -1 si le joueur est
    /// invalide.
    int score(int id_joueur);

    /// Renvoie votre numéro de joueur.
    int moi();

    /// Renvoie le numéro de joueur de votre adversaire.
    int adversaire();

    /// Retourne le tour actuel.
    tour_info info_tour();

    /// Affiche le contenu d'une valeur de type case_type
    void afficher_case_type(case_type v);

    /// Affiche le contenu d'une valeur de type direction
    void afficher_direction(direction v);

    /// Affiche le contenu d'une valeur de type erreur
    void afficher_erreur(erreur v);

    /// Affiche le contenu d'une valeur de type action_type
    void afficher_action_type(action_type v);

    /// Affiche le contenu d'une valeur de type position
    void afficher_position(position v);

    /// Affiche le contenu d'une valeur de type pont_type
    void afficher_pont_type(pont_type v);

    /// Affiche le contenu d'une valeur de type panda_info
    void afficher_panda_info(panda_info v);

    /// Affiche le contenu d'une valeur de type bebe_info
    void afficher_bebe_info(bebe_info v);

    /// Affiche le contenu d'une valeur de type tour_info
    void afficher_tour_info(tour_info v);

    /// Affiche le contenu d'une valeur de type action_hist
    void afficher_action_hist(action_hist v);

};

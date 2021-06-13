// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

#pragma once


/// Taille de la rivière (largeur, exclusif).
#define RIVIERE_MAX_X 25

/// Taille de la rivière (longueur, exclusif).
#define RIVIERE_MAX_Y 25

/// Nombre de tours à jouer avant la fin de la partie.
#define NB_TOURS 100

/// Nombre de pandas par joueur.
#define NB_PANDAS 2

/// Nombre de tours nécessaires pour faire tomber un bébé panda.
#define NB_TOURS_PERTE_BEBE 3

/// Valeur max d'un pont (les valeurs sont comprises entre 1 et cette constante
/// inclus).
#define VALEUR_MAX_PONT 6

/// Nombre de points obtenus à la capture d'un bébé pandas.
#define NB_POINTS_CAPTURE_BEBE 10


/// Types de cases
typedef enum case_type
{
    LIBRE, ///< Case libre
    OBSTACLE, ///< Obstacle
    PONT, ///< Pont
    BEBE, ///< Bébé panda
} case_type;

/// Directions cardinales
typedef enum direction
{
    NORD, ///< Direction : nord
    NORD_EST, ///< Direction : nord-est
    NORD_OUEST, ///< Direction : nord-ouest
    SUD, ///< Direction : sud
    SUD_EST, ///< Direction : sud-est
    SUD_OUEST, ///< Direction : sud-ouest
} direction;

/// Erreurs possibles
typedef enum erreur
{
    OK, ///< L'action s'est effectuée avec succès.
    POSITION_INVALIDE, ///< La position spécifiée n'est pas sur la rivière.
    POSITION_OBSTACLE, ///< La position spécifiée est un obstacle.
    MAUVAIS_NOMBRE, ///< La hauteur de la position spécifiée ne correspond pas.
    DEPLACEMENT_HORS_LIMITES, ///< Ce déplacement fait sortir un panda des limites de la rivière.
    DIRECTION_INVALIDE, ///< La direction spécifiée n'existe pas.
    MOUVEMENT_INVALIDE, ///< Le panda ne peut pas se déplacer dans cette direction.
    POSE_INVALIDE, ///< Le pont ne peut pas être placé a cette position et dans cette direction.
    ID_PANDA_INVALIDE, ///< Le panda spécifié n'existe pas.
    RIEN_A_POUSSER, ///< Aucun panda à pousser dans la direction indiquée.
    DRAPEAU_INVALIDE, ///< Le drapeau spécifié n'existe pas.
} erreur;

/// Types d'actions
typedef enum action_type
{
    ACTION_DEPLACER, ///< Action ``deplacer``.
    ACTION_POSER, ///< Action ``poser``.
} action_type;


/// Position du panda.
typedef struct position
{
    int x; ///< Coordonnée : x
    int y; ///< Coordonnée : y
} position;

/// Case type pont, contient la case de début et de fin. La case de début a une
/// valeur se décrémentant, celle de fin s'incrémente.
typedef struct pont_type
{
    position debut_pos; ///< Position de la case de début
    position fin_pos; ///< Position de la case de fin
    int debut_val; ///< Valeur de la case de début
    int fin_val; ///< Valeur de la case de début
} pont_type;

/// Panda et son joueur
typedef struct panda_info
{
    position panda_pos; ///< Position du panda
    int id_joueur; ///< Identifiant du joueur qui contrôle le panda
    int num_bebes; ///< Nombre de bébés qui sont portés par le panda parent
} panda_info;

/// Bébé panda à ramener.
typedef struct bebe_info
{
    position bebe_pos; ///< Position du bébé panda
    int points_capture; ///< Nombre de points obtenus pour la capture de ce panda
} bebe_info;

/// Information sur un tour particulier.
typedef struct tour_info
{
    int id_joueur_joue; ///< Identifiant du joueur qui joue
    int id_panda_joue; ///< Identifiant du panda qui joue
    int id_tour; ///< Identifiant unique du tour (compteur)
} tour_info;

/// Action représentée dans l'historique.
typedef struct action_hist
{
    action_type type_action; ///< Type de l'action
    int id_panda; ///< Identifiant du panda concerné par l'action
    direction dir; ///< Direction visée par le panda durant le déplacement
    int type_pont; ///< Type du pont posé (typiquement de 1 à 6 inclus)
} action_hist;
// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>
//
// This file contains all the API functions for the Rust language, and all the
// constants, enumerations and structures.
//
// It has been generated. You can modify the end of the file if you want, but
// do not touch the part where constants, enums, structs, and api functions are
// defined.

//! Rust API for prologin2021

use crate::ffi;
use crate::ffi::{array_of_borrow_to_c, CToRust, RustToC};

#[allow(unused_imports)]
use std::{cell::UnsafeCell, borrow::Borrow};

/// Nombre de tours à jouer avant la fin de la partie.
pub const NB_TOURS: i32 = 200;

/// Nombre de pandas par joueur.
pub const NB_PANDAS: i32 = 2;

/// Nombre de tours nécessaires pour faire tomber un bébé panda.
pub const NB_TOURS_PERTE_BEBE: i32 = 3;

/// Valeur max d'un pont (les valeurs sont comprises entre 1 et cette constante
/// inclus).
pub const VALEUR_MAX_PONT: i32 = 6;

/// Nombre de points obtenus à la capture d'un bébé pandas.
pub const NB_POINTS_CAPTURE_BEBE: i32 = 10;

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq, PartialOrd, Ord)]
pub enum CaseType {
    /// Case libre
    Libre,
    /// Obstacle
    Obstacle,
    /// Pont
    Pont,
    /// Bébé panda
    Bebe,
}

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq, PartialOrd, Ord)]
pub enum Direction {
    /// Direction : nord-est
    NordEst,
    /// Direction : sud-est
    SudEst,
    /// Direction : sud
    Sud,
    /// Direction : sud-ouest
    SudOuest,
    /// Direction : nord-ouest
    NordOuest,
    /// Direction : nord
    Nord,
}

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq, PartialOrd, Ord)]
pub enum Erreur {
    /// L'action s'est effectuée avec succès.
    Ok,
    /// La position spécifiée n'est pas sur la rivière.
    PositionInvalide,
    /// La position spécifiée est un obstacle.
    PositionObstacle,
    /// La hauteur de la position spécifiée ne correspond pas.
    MauvaisNombre,
    /// Ce déplacement fait sortir un panda des limites de la rivière.
    DeplacementHorsLimites,
    /// La direction spécifiée n'existe pas.
    DirectionInvalide,
    /// Le panda ne peut pas se déplacer dans cette direction.
    MouvementInvalide,
    /// Le pont ne peut pas être placé a cette position et dans cette direction.
    PoseInvalide,
    /// Le panda spécifié n'existe pas.
    IdPandaInvalide,
    /// Une action a déjà été effectuée ce tour.
    ActionDejaEffectuee,
    /// Le drapeau spécifié n'existe pas.
    DrapeauInvalide,
    /// La panda c'est déjà déplacé sur cette case.
    DeplacementEnArriere,
}

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq, PartialOrd, Ord)]
pub enum ActionType {
    /// Action ``deplacer``.
    ActionDeplacer,
    /// Action ``poser``.
    ActionPoser,
}

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq, PartialOrd, Ord)]
pub enum DebugDrapeau {
    /// Aucun drapeau, enlève le drapeau présent
    AucunDrapeau,
    /// Drapeau bleu
    DrapeauBleu,
    /// Drapeau vert
    DrapeauVert,
    /// Drapeau rouge
    DrapeauRouge,
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct PontType {
    /// Position de la case de début
    pub debut_pos: (i32, i32),
    /// Position de la case de fin
    pub fin_pos: (i32, i32),
    /// Valeur de la case de début
    pub debut_val: i32,
    /// Valeur de la case de début
    pub fin_val: i32,
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct PandaInfo {
    /// Position du panda
    pub panda_pos: (i32, i32),
    /// Identifiant du joueur qui contrôle le panda
    pub id_joueur: i32,
    /// Identifiant du panda relatif au joueur
    pub id_panda: i32,
    /// Nombre de bébés qui sont portés par le panda parent
    pub num_bebes: i32,
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct BebeInfo {
    /// Position du bébé panda
    pub bebe_pos: (i32, i32),
    /// Identifiant du joueur qui peut saver le bébé
    pub id_bebe_joueur: i32,
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct TourInfo {
    /// Identifiant du panda qui joue
    pub id_panda_joue: i32,
    /// Identifiant unique du tour (compteur)
    pub id_tour: i32,
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct CarteInfo {
    /// La taille de la carte pour les coordonnées x [0; taille_x[
    pub taille_x: i32,
    /// La taille de la carte pour les coordonnées y [0; taille_y[
    pub taille_y: i32,
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct ActionHist {
    /// Type de l'action
    pub type_action: ActionType,
    /// Identifiant du panda concerné par l'action
    pub action_id_panda: i32,
    /// Direction visée par le panda durant le déplacement
    pub dir: Direction,
    /// Valeur au début du pont posé (de 1 à 6 inclus)
    pub valeur_debut: i32,
    /// Valeur à la fin du pont posé (de 1 à 6 inclus)
    pub valeur_fin: i32,
    /// Position du début du pont posé
    pub pos_debut: (i32, i32),
    /// Position de la fin du pont posé
    pub pos_fin: (i32, i32),
}


/// Déplace le panda ``id_panda`` sur le pont choisi.
///
/// ### Parameters
///  - `dir`: Direction visée
pub fn deplacer(dir: Direction) -> Erreur {
    unsafe {
        let dir = dir.to_c();
        ffi::deplacer(dir).to_rust()
    }
}

/// Pose un pont dans la direction choisie à partir du panda ``id_panda``.
///
/// ### Parameters
///  - `position_debut`: Position de début du pont
///  - `dir`: Direction visée
///  - `pont_debut`: Début du pont placé
///  - `pont_fin`: Fin du pont
pub fn poser(position_debut: (i32, i32), dir: Direction, pont_debut: i32, pont_fin: i32) -> Erreur {
    unsafe {
        let position_debut = position_debut.to_c();
        let dir = dir.to_c();
        let pont_debut = pont_debut.to_c();
        let pont_fin = pont_fin.to_c();
        ffi::poser(position_debut, dir, pont_debut, pont_fin).to_rust()
    }
}

/// Affiche le drapeau spécifié sur la case indiquée
///
/// ### Parameters
///  - `pos`: Case ciblée
///  - `drapeau`: Drapeau à afficher sur la case
pub fn debug_afficher_drapeau(pos: (i32, i32), drapeau: DebugDrapeau) -> Erreur {
    unsafe {
        let pos = pos.to_c();
        let drapeau = drapeau.to_c();
        ffi::debug_afficher_drapeau(pos, drapeau).to_rust()
    }
}

/// Renvoie le type d'une case donnée.
///
/// ### Parameters
///  - `pos`: Case choisie
pub fn type_case(pos: (i32, i32)) -> CaseType {
    unsafe {
        let pos = pos.to_c();
        ffi::type_case(pos).to_rust()
    }
}

/// Renvoie le numéro du joueur à qui appartient panda sur la case indiquée.
/// Renvoie -1 s'il n'y a pas de panda ou si la position est invalide.
///
/// ### Parameters
///  - `pos`: Case choisie
pub fn panda_sur_case(pos: (i32, i32)) -> i32 {
    unsafe {
        let pos = pos.to_c();
        ffi::panda_sur_case(pos).to_rust()
    }
}

/// Renvoie le numéro du joueur à qui appartient le bébé panda sur la case
/// indiquée. Renvoie -1 s'il n'y a pas de bébé panda ou si la position est
/// invalide.
///
/// ### Parameters
///  - `pos`: Case choisie
pub fn bebe_panda_sur_case(pos: (i32, i32)) -> i32 {
    unsafe {
        let pos = pos.to_c();
        ffi::bebe_panda_sur_case(pos).to_rust()
    }
}

/// Indique la position du panda sur la rivière désigné par le numéro
/// ``id_panda`` appartenant au joueur ``id_joueur``. Si la description du
/// panda est incorrecte, la position (-1, -1) est renvoyée.
///
/// ### Parameters
///  - `id_joueur`: Numéro du joueur
///  - `id_panda`: Numéro du panda
pub fn position_panda(id_joueur: i32, id_panda: i32) -> (i32, i32) {
    unsafe {
        let id_joueur = id_joueur.to_c();
        let id_panda = id_panda.to_c();
        ffi::position_panda(id_joueur, id_panda).to_rust()
    }
}

/// Renvoie les informations relatives au pont situé à cette position. Le pont
/// est constitué de deux cases. Si aucun pont n'est placé à cette position ou
/// si la position est invalide, les membres debut_val et fin_val de la
/// structure ``pont_type`` renvoyée sont initialisés à -1.
///
/// ### Parameters
///  - `pos`: Case choisie
pub fn info_pont(pos: (i32, i32)) -> PontType {
    unsafe {
        let pos = pos.to_c();
        ffi::info_pont(pos).to_rust()
    }
}

/// Renvoie la description d'un panda en fonction d'une position donnée. Si le
/// panda n'est pas présent sur la carte, ou si la position est invalide, tous
/// les membres de la structure ``panda_info`` renvoyée sont initialisés à -1.
///
/// ### Parameters
///  - `pos`: Case choisie
pub fn info_panda(pos: (i32, i32)) -> PandaInfo {
    unsafe {
        let pos = pos.to_c();
        ffi::info_panda(pos).to_rust()
    }
}

/// Renvoie la liste de tous les pandas présents durant la partie.
pub fn liste_pandas() -> Vec<PandaInfo> {
    unsafe {
        ffi::liste_pandas().to_rust()
    }
}

/// Renvoie la liste de tous les bébés présents sur la carte, et et pas encore
/// sauvés.
pub fn liste_bebes() -> Vec<BebeInfo> {
    unsafe {
        ffi::liste_bebes().to_rust()
    }
}

/// Renvoie la liste de toutes les positions adjacentes à la position donnée.
///
/// ### Parameters
///  - `pos`: Case choisie
pub fn positions_adjacentes(pos: (i32, i32)) -> Vec<(i32, i32)> {
    unsafe {
        let pos = pos.to_c();
        ffi::positions_adjacentes(pos).to_rust()
    }
}

/// Renvoie la position relative à la direction donnée par rapport à une
/// position d'origine. Si une telle position serait invalide, la position {-1,
/// -1} est renvoyée.
///
/// ### Parameters
///  - `pos`: Position d'origine
///  - `dir`: Direction
pub fn position_dans_direction(pos: (i32, i32), dir: Direction) -> (i32, i32) {
    unsafe {
        let pos = pos.to_c();
        let dir = dir.to_c();
        ffi::position_dans_direction(pos, dir).to_rust()
    }
}

/// Renvoie la direction telle que position_dans_direction(origine, cible) ==
/// direction. Si aucune telle direction n'existe, -1 est renvoyée.
///
/// ### Parameters
///  - `origine`: Position d'origine
///  - `cible`: Position relative à l'origine
pub fn direction_entre_positions(origine: (i32, i32), cible: (i32, i32)) -> i32 {
    unsafe {
        let origine = origine.to_c();
        let cible = cible.to_c();
        ffi::direction_entre_positions(origine, cible).to_rust()
    }
}

/// Renvoie la liste des actions effectuées par l’adversaire durant son tour,
/// dans l'ordre chronologique. Les actions de débug n'apparaissent pas dans
/// cette liste.
pub fn historique() -> Vec<ActionHist> {
    unsafe {
        ffi::historique().to_rust()
    }
}

/// Renvoie le score du joueur ``id_joueur``. Renvoie -1 si le joueur est
/// invalide.
///
/// ### Parameters
///  - `id_joueur`: Numéro du joueur
pub fn score(id_joueur: i32) -> i32 {
    unsafe {
        let id_joueur = id_joueur.to_c();
        ffi::score(id_joueur).to_rust()
    }
}

/// Renvoie votre numéro de joueur.
pub fn moi() -> i32 {
    unsafe {
        ffi::moi().to_rust()
    }
}

/// Renvoie le numéro de joueur de votre adversaire.
pub fn adversaire() -> i32 {
    unsafe {
        ffi::adversaire().to_rust()
    }
}

/// Renvoie le tour actuel.
pub fn info_tour() -> TourInfo {
    unsafe {
        ffi::info_tour().to_rust()
    }
}

/// Renvoie la carte pour la partie en cours.
pub fn info_carte() -> CarteInfo {
    unsafe {
        ffi::info_carte().to_rust()
    }
}

/// Affiche le contenu d'une valeur de type case_type
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_case_type(v: CaseType) {
    unsafe {
        let v = v.to_c();
        ffi::afficher_case_type(v).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type direction
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_direction(v: Direction) {
    unsafe {
        let v = v.to_c();
        ffi::afficher_direction(v).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type erreur
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_erreur(v: Erreur) {
    unsafe {
        let v = v.to_c();
        ffi::afficher_erreur(v).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type action_type
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_action_type(v: ActionType) {
    unsafe {
        let v = v.to_c();
        ffi::afficher_action_type(v).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type debug_drapeau
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_debug_drapeau(v: DebugDrapeau) {
    unsafe {
        let v = v.to_c();
        ffi::afficher_debug_drapeau(v).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type position
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_position(v: (i32, i32)) {
    unsafe {
        let v = v.to_c();
        ffi::afficher_position(v).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type pont_type
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_pont_type(v: &PontType) {
    unsafe {
        let v = UnsafeCell::new(v.to_c());
        ffi::afficher_pont_type(v.get().read()).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type panda_info
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_panda_info(v: &PandaInfo) {
    unsafe {
        let v = UnsafeCell::new(v.to_c());
        ffi::afficher_panda_info(v.get().read()).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type bebe_info
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_bebe_info(v: &BebeInfo) {
    unsafe {
        let v = UnsafeCell::new(v.to_c());
        ffi::afficher_bebe_info(v.get().read()).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type tour_info
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_tour_info(v: &TourInfo) {
    unsafe {
        let v = UnsafeCell::new(v.to_c());
        ffi::afficher_tour_info(v.get().read()).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type carte_info
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_carte_info(v: &CarteInfo) {
    unsafe {
        let v = UnsafeCell::new(v.to_c());
        ffi::afficher_carte_info(v.get().read()).to_rust()
    }
}

/// Affiche le contenu d'une valeur de type action_hist
///
/// ### Parameters
///  - `v`: The value to display
pub fn afficher_action_hist(v: &ActionHist) {
    unsafe {
        let v = UnsafeCell::new(v.to_c());
        ffi::afficher_action_hist(v.get().read()).to_rust()
    }
}

// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2012-2021 Association Prologin <association@prologin.org>

//! Types and conversions for the C interface
//!
//! Please use the tools defined in `api.rs` to interact with the API for
//! prologin2021.

#![allow(clippy::unit_arg)]
#![allow(clippy::unused_unit)]

use crate::api;

use std::borrow::Borrow;
use std::ffi::{CStr, CString};
use std::{mem::{drop, size_of}, ptr, slice};
use std::os::raw::{c_char, c_double, c_int, c_void};

#[allow(non_camel_case_types)]
pub type c_bool = bool;

/// Stechec2-specific array type.
#[repr(C)]
pub struct Array<T> {
    ptr: *mut T,
    len: usize,
}

impl<T> Drop for Array<T> {
    fn drop(&mut self) {
        unsafe {
            slice::from_raw_parts_mut(self.ptr, self.len)
                .iter_mut()
                .for_each(drop);
            free(self.ptr as _);
        }
    }
}

/// Represents an owned C string that was created by a foreign function using
/// malloc. This means that this string must be deallocated using free.
#[repr(C)]
pub struct RawString {
    ptr: *mut c_char
}

impl Drop for RawString {
    fn drop(&mut self) {
        unsafe {
            free(self.ptr as _);
        }
    }
}

// Enums

#[repr(C)]
#[derive(Clone, Copy)]
pub enum CaseType {
    Libre,
    Obstacle,
    Pont,
    Bebe,
}

#[repr(C)]
#[derive(Clone, Copy)]
pub enum Direction {
    NordEst,
    SudEst,
    Sud,
    SudOuest,
    NordOuest,
    Nord,
}

#[repr(C)]
#[derive(Clone, Copy)]
pub enum Erreur {
    Ok,
    PositionInvalide,
    PositionObstacle,
    MauvaisNombre,
    DeplacementHorsLimites,
    DirectionInvalide,
    MouvementInvalide,
    PoseInvalide,
    IdPandaInvalide,
    ActionDejaEffectuee,
    DrapeauInvalide,
    DeplacementEnArriere,
}

#[repr(C)]
#[derive(Clone, Copy)]
pub enum ActionType {
    ActionDeplacer,
    ActionPoser,
}

#[repr(C)]
#[derive(Clone, Copy)]
pub enum DebugDrapeau {
    AucunDrapeau,
    DrapeauBleu,
    DrapeauVert,
    DrapeauRouge,
}

// Structures

#[repr(C)]
pub struct Position {
    x: c_int,
    y: c_int,
}

#[repr(C)]
pub struct PontType {
    debut_pos: Position,
    fin_pos: Position,
    debut_val: c_int,
    fin_val: c_int,
}

#[repr(C)]
pub struct PandaInfo {
    panda_pos: Position,
    id_joueur: c_int,
    id_panda: c_int,
    num_bebes: c_int,
}

#[repr(C)]
pub struct BebeInfo {
    bebe_pos: Position,
    id_bebe_joueur: c_int,
}

#[repr(C)]
pub struct TourInfo {
    id_panda_joue: c_int,
    id_tour: c_int,
}

#[repr(C)]
pub struct CarteInfo {
    taille_x: c_int,
    taille_y: c_int,
}

#[repr(C)]
pub struct ActionHist {
    type_action: ActionType,
    action_id_panda: c_int,
    dir: Direction,
    valeur_debut: c_int,
    valeur_fin: c_int,
    pos_debut: Position,
    pos_fin: Position,
}

// Conversion traits

pub trait CToRust<T> {
    /// Convert from a C-compatible type.
    ///
    /// As there can't be a clear ownership through the ffi, you need to make
    /// sure that foreign code assumes that you will drop provided values.
    unsafe fn to_rust(self) -> T;
}

pub trait RustToC<T> {
    /// Convert to a C-compatible type.
    ///
    /// As there can't be a clear ownership through the ffi, you need to make
    /// sure that foreign code assumes that you will drop provided values.
    unsafe fn to_c(&self) -> T;
}

// Conversions for bool

impl CToRust<bool> for c_bool {
    unsafe fn to_rust(self) -> bool {
        self
    }
}

impl RustToC<c_bool> for bool {
    unsafe fn to_c(&self) -> c_bool {
        *self
    }
}

// Conversions for double

impl CToRust<f64> for c_double {
    unsafe fn to_rust(self) -> f64 {
        self
    }
}

impl RustToC<c_double> for f64 {
    unsafe fn to_c(&self) -> c_double {
        *self
    }
}

// Conversions for int

impl CToRust<i32> for c_int {
    unsafe fn to_rust(self) -> i32 {
        self
    }
}

impl RustToC<c_int> for i32 {
    unsafe fn to_c(&self) -> c_int {
        *self
    }
}

// Conversions for void

impl CToRust<()> for () {
    unsafe fn to_rust(self) -> () {
        self
    }
}

impl RustToC<()> for () {
    unsafe fn to_c(&self) -> () {
        *self
    }
}

// Conversions for string

impl CToRust<String> for RawString {
    unsafe fn to_rust(self) -> String {
        CStr::from_ptr(self.ptr)
            .to_owned()
            .into_string()
            .expect("API provided invalid UTF-8")
    }
}

impl<S> RustToC<RawString> for S
where
    S: AsRef<str>,
{
    unsafe fn to_c(&self) -> RawString {
        let c_string = CString::new(self.as_ref().to_string())
            .expect("string provided to the API contains a null character");
        let len = c_string.as_bytes_with_nul().len();

        let ptr = malloc(len * size_of::<c_char>()) as *mut c_char;
        c_string.as_c_str().as_ptr().copy_to(ptr, len);
        RawString { ptr }
    }
}

// Conversions for array

pub unsafe fn array_of_borrow_to_c<T, U, V>(data: &[T]) -> Array<V>
where
    T: Borrow<U>,
    U: RustToC<V>,
{
    let ptr = malloc(data.len() * size_of::<V>()) as *mut V;

    for (i, item) in data.iter().enumerate() {
        ptr::write(ptr.add(i), item.borrow().to_c());
    }

    Array { ptr, len: data.len() }
}

impl<T, U> CToRust<Vec<U>> for Array<T>
where
    T: CToRust<U>,
{
    unsafe fn to_rust(self) -> Vec<U> {
        (0..self.len)
            .map(|i| self.ptr.add(i).read())
            .map(|item| item.to_rust())
            .collect()
    }
}

impl<T, U> RustToC<Array<U>> for [T]
where
    T: RustToC<U>,
{
    unsafe fn to_c(&self) -> Array<U> {
        array_of_borrow_to_c(self)
    }
}

impl<T, U> RustToC<Array<U>> for Vec<T>
where
    T: RustToC<U>,
{
    unsafe fn to_c(&self) -> Array<U> {
        self[..].to_c()
    }
}

// Conversions for case_type

impl CToRust<api::CaseType> for CaseType {
    unsafe fn to_rust(self) -> api::CaseType {
        match self {
            CaseType::Libre => api::CaseType::Libre,
            CaseType::Obstacle => api::CaseType::Obstacle,
            CaseType::Pont => api::CaseType::Pont,
            CaseType::Bebe => api::CaseType::Bebe,
        }
    }
}

impl RustToC<CaseType> for api::CaseType {
    unsafe fn to_c(&self) -> CaseType {
        match self {
            api::CaseType::Libre => CaseType::Libre,
            api::CaseType::Obstacle => CaseType::Obstacle,
            api::CaseType::Pont => CaseType::Pont,
            api::CaseType::Bebe => CaseType::Bebe,
        }
    }
}

// Conversions for direction

impl CToRust<api::Direction> for Direction {
    unsafe fn to_rust(self) -> api::Direction {
        match self {
            Direction::NordEst => api::Direction::NordEst,
            Direction::SudEst => api::Direction::SudEst,
            Direction::Sud => api::Direction::Sud,
            Direction::SudOuest => api::Direction::SudOuest,
            Direction::NordOuest => api::Direction::NordOuest,
            Direction::Nord => api::Direction::Nord,
        }
    }
}

impl RustToC<Direction> for api::Direction {
    unsafe fn to_c(&self) -> Direction {
        match self {
            api::Direction::NordEst => Direction::NordEst,
            api::Direction::SudEst => Direction::SudEst,
            api::Direction::Sud => Direction::Sud,
            api::Direction::SudOuest => Direction::SudOuest,
            api::Direction::NordOuest => Direction::NordOuest,
            api::Direction::Nord => Direction::Nord,
        }
    }
}

// Conversions for erreur

impl CToRust<api::Erreur> for Erreur {
    unsafe fn to_rust(self) -> api::Erreur {
        match self {
            Erreur::Ok => api::Erreur::Ok,
            Erreur::PositionInvalide => api::Erreur::PositionInvalide,
            Erreur::PositionObstacle => api::Erreur::PositionObstacle,
            Erreur::MauvaisNombre => api::Erreur::MauvaisNombre,
            Erreur::DeplacementHorsLimites => api::Erreur::DeplacementHorsLimites,
            Erreur::DirectionInvalide => api::Erreur::DirectionInvalide,
            Erreur::MouvementInvalide => api::Erreur::MouvementInvalide,
            Erreur::PoseInvalide => api::Erreur::PoseInvalide,
            Erreur::IdPandaInvalide => api::Erreur::IdPandaInvalide,
            Erreur::ActionDejaEffectuee => api::Erreur::ActionDejaEffectuee,
            Erreur::DrapeauInvalide => api::Erreur::DrapeauInvalide,
            Erreur::DeplacementEnArriere => api::Erreur::DeplacementEnArriere,
        }
    }
}

impl RustToC<Erreur> for api::Erreur {
    unsafe fn to_c(&self) -> Erreur {
        match self {
            api::Erreur::Ok => Erreur::Ok,
            api::Erreur::PositionInvalide => Erreur::PositionInvalide,
            api::Erreur::PositionObstacle => Erreur::PositionObstacle,
            api::Erreur::MauvaisNombre => Erreur::MauvaisNombre,
            api::Erreur::DeplacementHorsLimites => Erreur::DeplacementHorsLimites,
            api::Erreur::DirectionInvalide => Erreur::DirectionInvalide,
            api::Erreur::MouvementInvalide => Erreur::MouvementInvalide,
            api::Erreur::PoseInvalide => Erreur::PoseInvalide,
            api::Erreur::IdPandaInvalide => Erreur::IdPandaInvalide,
            api::Erreur::ActionDejaEffectuee => Erreur::ActionDejaEffectuee,
            api::Erreur::DrapeauInvalide => Erreur::DrapeauInvalide,
            api::Erreur::DeplacementEnArriere => Erreur::DeplacementEnArriere,
        }
    }
}

// Conversions for action_type

impl CToRust<api::ActionType> for ActionType {
    unsafe fn to_rust(self) -> api::ActionType {
        match self {
            ActionType::ActionDeplacer => api::ActionType::ActionDeplacer,
            ActionType::ActionPoser => api::ActionType::ActionPoser,
        }
    }
}

impl RustToC<ActionType> for api::ActionType {
    unsafe fn to_c(&self) -> ActionType {
        match self {
            api::ActionType::ActionDeplacer => ActionType::ActionDeplacer,
            api::ActionType::ActionPoser => ActionType::ActionPoser,
        }
    }
}

// Conversions for debug_drapeau

impl CToRust<api::DebugDrapeau> for DebugDrapeau {
    unsafe fn to_rust(self) -> api::DebugDrapeau {
        match self {
            DebugDrapeau::AucunDrapeau => api::DebugDrapeau::AucunDrapeau,
            DebugDrapeau::DrapeauBleu => api::DebugDrapeau::DrapeauBleu,
            DebugDrapeau::DrapeauVert => api::DebugDrapeau::DrapeauVert,
            DebugDrapeau::DrapeauRouge => api::DebugDrapeau::DrapeauRouge,
        }
    }
}

impl RustToC<DebugDrapeau> for api::DebugDrapeau {
    unsafe fn to_c(&self) -> DebugDrapeau {
        match self {
            api::DebugDrapeau::AucunDrapeau => DebugDrapeau::AucunDrapeau,
            api::DebugDrapeau::DrapeauBleu => DebugDrapeau::DrapeauBleu,
            api::DebugDrapeau::DrapeauVert => DebugDrapeau::DrapeauVert,
            api::DebugDrapeau::DrapeauRouge => DebugDrapeau::DrapeauRouge,
        }
    }
}

// Conversions for position

impl CToRust<(i32, i32)> for Position {
    unsafe fn to_rust(self) -> (i32, i32) {
        (self.x.to_rust(), self.y.to_rust())
    }
}

impl RustToC<Position> for (i32, i32) {
    unsafe fn to_c(&self) -> Position {
        let (x, y) = self;

        Position {
            x: x.to_c(),
            y: y.to_c(),
        }
    }
}

// Conversions for pont_type

impl CToRust<api::PontType> for PontType {
    unsafe fn to_rust(self) -> api::PontType {
        api::PontType {
            debut_pos: self.debut_pos.to_rust(),
            fin_pos: self.fin_pos.to_rust(),
            debut_val: self.debut_val.to_rust(),
            fin_val: self.fin_val.to_rust(),
        }
    }
}

impl RustToC<PontType> for api::PontType {
    unsafe fn to_c(&self) -> PontType {
        PontType {
            debut_pos: self.debut_pos.to_c(),
            fin_pos: self.fin_pos.to_c(),
            debut_val: self.debut_val.to_c(),
            fin_val: self.fin_val.to_c(),
        }
    }
}

// Conversions for panda_info

impl CToRust<api::PandaInfo> for PandaInfo {
    unsafe fn to_rust(self) -> api::PandaInfo {
        api::PandaInfo {
            panda_pos: self.panda_pos.to_rust(),
            id_joueur: self.id_joueur.to_rust(),
            id_panda: self.id_panda.to_rust(),
            num_bebes: self.num_bebes.to_rust(),
        }
    }
}

impl RustToC<PandaInfo> for api::PandaInfo {
    unsafe fn to_c(&self) -> PandaInfo {
        PandaInfo {
            panda_pos: self.panda_pos.to_c(),
            id_joueur: self.id_joueur.to_c(),
            id_panda: self.id_panda.to_c(),
            num_bebes: self.num_bebes.to_c(),
        }
    }
}

// Conversions for bebe_info

impl CToRust<api::BebeInfo> for BebeInfo {
    unsafe fn to_rust(self) -> api::BebeInfo {
        api::BebeInfo {
            bebe_pos: self.bebe_pos.to_rust(),
            id_bebe_joueur: self.id_bebe_joueur.to_rust(),
        }
    }
}

impl RustToC<BebeInfo> for api::BebeInfo {
    unsafe fn to_c(&self) -> BebeInfo {
        BebeInfo {
            bebe_pos: self.bebe_pos.to_c(),
            id_bebe_joueur: self.id_bebe_joueur.to_c(),
        }
    }
}

// Conversions for tour_info

impl CToRust<api::TourInfo> for TourInfo {
    unsafe fn to_rust(self) -> api::TourInfo {
        api::TourInfo {
            id_panda_joue: self.id_panda_joue.to_rust(),
            id_tour: self.id_tour.to_rust(),
        }
    }
}

impl RustToC<TourInfo> for api::TourInfo {
    unsafe fn to_c(&self) -> TourInfo {
        TourInfo {
            id_panda_joue: self.id_panda_joue.to_c(),
            id_tour: self.id_tour.to_c(),
        }
    }
}

// Conversions for carte_info

impl CToRust<api::CarteInfo> for CarteInfo {
    unsafe fn to_rust(self) -> api::CarteInfo {
        api::CarteInfo {
            taille_x: self.taille_x.to_rust(),
            taille_y: self.taille_y.to_rust(),
        }
    }
}

impl RustToC<CarteInfo> for api::CarteInfo {
    unsafe fn to_c(&self) -> CarteInfo {
        CarteInfo {
            taille_x: self.taille_x.to_c(),
            taille_y: self.taille_y.to_c(),
        }
    }
}

// Conversions for action_hist

impl CToRust<api::ActionHist> for ActionHist {
    unsafe fn to_rust(self) -> api::ActionHist {
        api::ActionHist {
            type_action: self.type_action.to_rust(),
            action_id_panda: self.action_id_panda.to_rust(),
            dir: self.dir.to_rust(),
            valeur_debut: self.valeur_debut.to_rust(),
            valeur_fin: self.valeur_fin.to_rust(),
            pos_debut: self.pos_debut.to_rust(),
            pos_fin: self.pos_fin.to_rust(),
        }
    }
}

impl RustToC<ActionHist> for api::ActionHist {
    unsafe fn to_c(&self) -> ActionHist {
        ActionHist {
            type_action: self.type_action.to_c(),
            action_id_panda: self.action_id_panda.to_c(),
            dir: self.dir.to_c(),
            valeur_debut: self.valeur_debut.to_c(),
            valeur_fin: self.valeur_fin.to_c(),
            pos_debut: self.pos_debut.to_c(),
            pos_fin: self.pos_fin.to_c(),
        }
    }
}


// Import API functions

extern {
    fn free(ptr: *mut c_void);
    fn malloc(size: usize) -> *mut c_void;

    pub fn deplacer(dir: Direction) -> Erreur;
    pub fn poser(position_debut: Position, dir: Direction, pont_debut: c_int, pont_fin: c_int) -> Erreur;
    pub fn debug_afficher_drapeau(pos: Position, drapeau: DebugDrapeau) -> Erreur;
    pub fn type_case(pos: Position) -> CaseType;
    pub fn panda_sur_case(pos: Position) -> c_int;
    pub fn bebe_panda_sur_case(pos: Position) -> c_int;
    pub fn position_panda(id_joueur: c_int, id_panda: c_int) -> Position;
    pub fn info_pont(pos: Position) -> PontType;
    pub fn info_panda(pos: Position) -> PandaInfo;
    pub fn liste_pandas() -> Array<PandaInfo>;
    pub fn liste_bebes() -> Array<BebeInfo>;
    pub fn positions_adjacentes(pos: Position) -> Array<Position>;
    pub fn position_dans_direction(pos: Position, dir: Direction) -> Position;
    pub fn direction_entre_positions(origine: Position, cible: Position) -> c_int;
    pub fn historique() -> Array<ActionHist>;
    pub fn score(id_joueur: c_int) -> c_int;
    pub fn moi() -> c_int;
    pub fn adversaire() -> c_int;
    pub fn info_tour() -> TourInfo;
    pub fn info_carte() -> CarteInfo;
    pub fn afficher_case_type(v: CaseType);
    pub fn afficher_direction(v: Direction);
    pub fn afficher_erreur(v: Erreur);
    pub fn afficher_action_type(v: ActionType);
    pub fn afficher_debug_drapeau(v: DebugDrapeau);
    pub fn afficher_position(v: Position);
    pub fn afficher_pont_type(v: PontType);
    pub fn afficher_panda_info(v: PandaInfo);
    pub fn afficher_bebe_info(v: BebeInfo);
    pub fn afficher_tour_info(v: TourInfo);
    pub fn afficher_carte_info(v: CarteInfo);
    pub fn afficher_action_hist(v: ActionHist);
}

// Export user functions

#[no_mangle]
unsafe extern "C" fn partie_init() {
    crate::partie_init().to_c()
}

#[no_mangle]
unsafe extern "C" fn jouer_tour() {
    crate::jouer_tour().to_c()
}

#[no_mangle]
unsafe extern "C" fn partie_fin() {
    crate::partie_fin().to_c()
}

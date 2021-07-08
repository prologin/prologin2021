// Include standard library in documentation: `cargo doc --open`
#[doc(inline)]
pub use std;

mod ffi;
pub mod api;

use api::*;


/// Fonction appelée au début de la partie.
pub fn partie_init()
{
}

/// Fonction appelée à la fin de la partie.
pub fn partie_fin()
{
}

/// Fonction appelée à chaque tour.
pub fn jouer_tour()
{
    let player_id = moi();
    let TourInfo { id_panda_joue: panda_id, .. } = info_tour();
    let panda_pos = position_panda(player_id, panda_id);

    assert_ne!(panda_pos, (-1, -1));

    let babies = liste_bebes().into_iter()
        .filter(move |x| x.id_bebe_joueur == player_id)
        .collect::<Vec<_>>();

    let closest_baby = babies.into_iter()
        .min_by_key(move |x| distance(x.bebe_pos, panda_pos));

    let BebeInfo { bebe_pos: baby_pos, ..} = match closest_baby {
        Some(baby) => baby,
        None => {
            println!("I already have all babies, I give up");

            return;
        },
    };

    let direction = direction(panda_pos, baby_pos);

    println!(
        "Panda: {:?}, baby: {:?}, distance: {}, direction: {:?}",
        panda_pos,
        baby_pos,
        distance(panda_pos, baby_pos),
        direction,
    );

    if deplacer(direction) == Erreur::MouvementInvalide {
        let bridge = info_pont(panda_pos);
        let value = if bridge.debut_pos == panda_pos {
            bridge.debut_val
        } else {
            bridge.fin_val
        };
        let start_pos = position_dans_direction(panda_pos, direction);

        println!(
            "Pose {} {:?} --> {:?}: {:?}",
            value,
            start_pos,
            direction,
            poser(start_pos, direction, value, value),
        );
    }
}

fn distance((x1, y1): (i32, i32), (x2, y2): (i32, i32)) -> i32 {
    let diff = if (x1 & 1) == (x2 & 1) { 0 } else { 1 };

    diff + ((x2 - x1).pow(2) as f64 + (y2 - y1).pow(2) as f64).sqrt() as i32
}

fn direction((x1, y1): (i32, i32), (x2, y2): (i32, i32)) -> Direction {
    use std::cmp::Ordering::*;

    match (x1.cmp(&x2), y1.cmp(&y2), x1 & 1 == 0 /* Even col => lower */) {
        (Equal, Equal  , _) => unreachable!(),
        (Equal, Less   , _) => Direction::Sud,
        (Equal, Greater, _) => Direction::Nord,

        (Less, Equal  , true ) => Direction::NordEst,
        (Less, Equal  , false) => Direction::SudEst,
        (Less, Less   , _) => Direction::SudEst,
        (Less, Greater, _) => Direction::NordEst,

        (Greater, Equal  , true ) => Direction::NordOuest,
        (Greater, Equal  , false) => Direction::SudOuest,
        (Greater, Less   , _) => Direction::SudOuest,
        (Greater, Greater, _) => Direction::NordOuest,
    }
}

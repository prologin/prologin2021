#include "actions.hh"
#include "game_state.hh"

#include <iomanip>
#include <iostream>
#include <string>

static void dump_player_turn(std::ostream& ss, const GameState& st,
                             int player_id);

// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2021 Association Prologin <association@prologin.org>

#pragma once

#include <rules/player.hh>
#include <vector>

#include "constant.hh"
#include "map.hh"

class Panda;

class Bebe
{
public:
    Bebe(int joueur, int num, position pos);

    // Returns the identifier of the player that may save this bebe.
    int player_id() const;
    // Returns the identifier of the bebe.
    int id() const;

    // Returns the baby's position.
    position pos() const;
    // Updates the baby's position.
    void update_pos(position pos);

    // Return 'false' if the baby hasn't been saved yet
    bool is_saved() const;
    // Returns a pointer to the panda that saved that bebe, if any. If not
    // saved yet, returns nullptr.
    const Panda* savior() const;
    // Sets the baby's status as saved.
    void save(const Panda& savior);

private:
    int joueur_;
    int num_;
    position pos_;
    const Panda* savior_ = nullptr;
};

class Panda
{
public:
    Panda(int joueur, int num, position pos);

    // Returns the identifier of the player that controls this panda.
    int player_id() const;
    // Returns the identifier of the panda.
    int id() const;

    // Returns the panda's position.
    position pos() const;
    // Updates the panda's position.
    void update_pos(position pos);

    // Returns the vector of all bebes saved by this panda.
    const std::vector<const Bebe*> saved_bebes() const;

    // Marks the given bebe as saved by this panda. This method will
    // automatically call Bebe::save().
    void save_bebe(Bebe& bebe);

private:
    int joueur_;
    int num_;
    position pos_;
    std::vector<const Bebe*> saved_bebes_;
};

class Player
{
public:
    Player(std::shared_ptr<rules::Player> rules_player,
           const std::vector<position>& pandas_positions,
           const std::vector<position>& bebes_positions);

    // Returns the player, as seen by the overall Stechec2 engine.
    const rules::Player& rules_player() const;

    // Returns the identifier of the player.
    int id() const;
    // Returns the vector of all pandas controlled by the player.
    const std::vector<Panda>& pandas() const;
    // Returns the vector of all the bebes that may be saved by the player.
    const std::vector<Bebe>& bebes() const;

    // Returns a pointer to the panda with the given identifier. If no such
    // panda exists, nullptr is returned.
    const Panda* panda_at(int id) const;
    Panda* panda_at(int id);
    // Returns a pointer to the bebe with the given identifier. If no such bebe
    // exists, nullptr is returned.
    const Bebe* bebe_at(int id) const;
    Bebe* bebe_at(int id);

    const std::vector<action_hist>& last_actions() const;
    void reset_last_actions();
    void log_action(action_hist action);

private:
    std::shared_ptr<rules::Player> rules_player_;
    std::vector<Panda> pandas_;
    std::vector<Bebe> bebes_;
    int turns_blocked_ = 0;
    std::vector<action_hist> last_actions_;

    // A ajouter en plus ??? score, inventory...
};

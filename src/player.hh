// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2021 Association Prologin <association@prologin.org>

#pragma once

#include <vector>

#include "constant.hh"
#include "map.hh"

class Bebe
{
public:
    Bebe(Map& map, int joueur, int num, position pos);

    // Returns the baby's position.
    position get_pos();
    // Sets the baby's position.
    // Returns 'false' if the given position is invalid.
    bool set_pos(position pos);

    // Return 'false' if the baby hasn't been saved yet
    bool is_saved();
    // Sets the baby's status as saved.
    void save();

private:
    Map& map_;
    int joueur_;
    int num_;
    position pos_;
    bool saved_ = false;
};

class Panda
{
public:
    Panda(Map& map, int joueur, int num, position pos);

    // Returns the panda's position.
    position get_pos() const;
    // Sets the panda's position.
    // Returns 'false' if the given position is invalid.
    bool set_pos(position pos);

private:
    Map& map_;
    int joueur_;
    int num_;
    position pos_;
};

class Player
{
public:
    Player(Panda& panda_one, Panda& panda_two, std::vector<Bebe>& bebes);

private:
    Panda panda_one_;
    Panda panda_two_;
    std::vector<Bebe> bebes_;
    int turns_bloced_ = 0;

    // A ajouter en plus ??? score, inventory...
};

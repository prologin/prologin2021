// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2021 Association Prologin <association@prologin.org>

#include "player.hh"

#include <cassert>
#include <stdexcept>

Bebe::Bebe(int joueur, int num, position pos)
    : joueur_(joueur)
    , num_(num)
    , pos_(pos)
{
}

int Bebe::player_id() const
{
    return joueur_;
}

int Bebe::id() const
{
    return num_;
}

position Bebe::pos() const
{
    return pos_;
}

void Bebe::update_pos(position pos)
{
    pos_ = pos;
}

bool Bebe::is_saved() const
{
    return savior_ != nullptr;
}

const Panda* Bebe::savior() const
{
    return savior_;
}

void Bebe::save(const Panda& savior)
{
    assert(savior_ == nullptr);

    savior_ = &savior;
}

Panda::Panda(int joueur, int num, position pos)
    : joueur_(joueur)
    , num_(num)
    , pos_(pos)
{
}

int Panda::player_id() const
{
    return joueur_;
}

int Panda::id() const
{
    return num_;
}

position Panda::pos() const
{
    return pos_;
}

void Panda::update_pos(position pos)
{
    pos_ = pos;
}

void Panda::save_bebe(Bebe& bebe)
{
    assert(bebe.player_id() == player_id());

    bebe.save(*this);
    saved_bebes_.push_back(&bebe);
}

const std::vector<const Bebe*> Panda::saved_bebes() const
{
    return saved_bebes_;
}

Player::Player(std::shared_ptr<rules::Player> rules_player,
               const std::vector<position>& pandas_positions,
               const std::vector<position>& bebes_positions)
    : rules_player_(std::move(rules_player))
{
    int id = rules_player_->id;

    pandas_.reserve(pandas_positions.size());
    bebes_.reserve(bebes_positions.size());

    for (size_t panda_id = 0; panda_id < pandas_positions.size(); panda_id++)
    {
        pandas_.push_back(Panda(id, panda_id, pandas_positions[panda_id]));
    }

    for (size_t bebe_id = 0; bebe_id < bebes_positions.size(); bebe_id++)
    {
        bebes_.push_back(Bebe(id, bebe_id, bebes_positions[bebe_id]));
    }
}

rules::Player& Player::rules_player() const
{
    return *rules_player_;
}

int Player::id() const
{
    return rules_player_->id;
}

const std::vector<Panda>& Player::pandas() const
{
    return pandas_;
}

const std::vector<Bebe>& Player::bebes() const
{
    return bebes_;
}

const Panda* Player::panda_at(int id) const
{
    if (id >= 0 && (size_t)id < pandas_.size())
    {
        return &pandas_[id];
    }

    return nullptr;
}

Panda* Player::panda_at(int id)
{
    if (id >= 0 && (size_t)id < pandas_.size())
    {
        return &pandas_[id];
    }

    return nullptr;
}

const Bebe* Player::bebe_at(int id) const
{
    if (id >= 0 && (size_t)id < bebes_.size())
    {
        return &bebes_[id];
    }

    return nullptr;
}

Bebe* Player::bebe_at(int id)
{
    if (id >= 0 && (size_t)id < bebes_.size())
    {
        return &bebes_[id];
    }

    return nullptr;
}

const std::vector<internal_action>& Player::get_internal_history() const
{
    return internal_hist_;
}

void Player::reset_internal_history()
{
    internal_hist_.clear();
}

void Player::add_internal_action(internal_action action)
{
    internal_hist_.push_back(action);
}

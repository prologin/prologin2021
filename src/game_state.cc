// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (c) 2015 Association Prologin <association@prologin.org>

#include "game_state.hh"

GameState::GameState(const rules::Players& players, Map map)
    : rules::GameState(players)
    , map_(std::move(map))
{
    // Determine position of all pandas for all players.
    std::vector<std::vector<position>> panda_player_positions;
    std::vector<std::vector<position>> bebe_player_positions;

    for (int x = 0; x < map_.width(); x++)
        for (int y = 0; y < map_.height(); y++)
        {
            // Determine nature of panda.
            const Cell& cell = map_.get({x, y});
            int player, num;
            bool is_panda;

            if (cell.has_panda(&player, &num))
            {
                is_panda = true;
            }
            else if (cell.is_bebe(&player, &num))
            {
                is_panda = false;
            }
            else
            {
                continue;
            }

            // Fill previous values in the positions vectors to make sure the
            // next indexing operation is valid.
            std::vector<std::vector<position>>& player_positions =
                is_panda ? panda_player_positions : bebe_player_positions;

            if (player_positions.size() <= (size_t)player)
            {
                player_positions.resize(player + 1, {});
            }

            std::vector<position>& positions = player_positions[player];

            if (positions.size() <= (size_t)num)
            {
                positions.resize(num + 1, {-1, -1});
            }
            else
            {
                // Make sure that panda / player hasn't already been specified.
                assert(positions[num] == (position{-1, -1}));
            }

            positions[num] = {x, y};
        }

    // Ensure that all players have the same number of pandas and babies.
    // Also ensure that all values have been provided (no {-1, -1} position).
    const size_t players_count = panda_player_positions.size();

    assert(players_count > 1);
    assert(panda_player_positions.size() == bebe_player_positions.size());

    const size_t pandas_per_player = panda_player_positions[0].size();
    const size_t bebes_per_player = bebe_player_positions[0].size();

    for (const auto& vec : panda_player_positions)
    {
        assert(vec.size() == pandas_per_player);

        for (const position& pos : vec)
        {
            assert(pos != (position{-1, -1}));
        }
    }

    for (const auto& vec : bebe_player_positions)
    {
        assert(vec.size() == bebes_per_player);

        for (const position& pos : vec)
        {
            assert(pos != (position{-1, -1}));
        }
    }

    // The map is valid. We can initialize the players.
    own_players_.reserve(players_count);

    for (size_t player_id = 0; player_id < players_count; player_id++)
    {
        own_players_.push_back(Player(players[player_id],
                                      panda_player_positions[player_id],
                                      bebe_player_positions[player_id]));
    }
}

GameState::GameState(const GameState& st)
    : rules::GameState(st)
    , map_(st.map_)
    , own_players_(st.own_players_)
{
}

GameState::~GameState()
{
    // Nothing to dispose of.
}

GameState* GameState::copy() const
{
    return new GameState(*this);
}

const Player* GameState::player_at(int id) const
{
    if (id >= 0 && (size_t)id < own_players_.size())
    {
        return &own_players_[id];
    }

    return nullptr;
}

Player* GameState::player_at(int id)
{
    if (id >= 0 && (size_t)id < own_players_.size())
    {
        return &own_players_[id];
    }

    return nullptr;
}

bool GameState::is_finished() const
{
    for (const auto& player : players())
    {
        int count = 0;
        for (const auto& bebe : player.bebes())
            if (bebe.is_saved())
                count++;
        if (count == player.bebes().size())
            return true;
    }
    return round_ >= NB_TOURS;
}

int GameState::round_id() const
{
    return round_;
}

int GameState::round_player_id() const
{
    return round_ % player_count();
}

int GameState::round_panda_id() const
{
    return round_ % (player_count() * pandas_per_player()) /
           pandas_per_player();
}

void GameState::next_round()
{
    // Increment round counter.
    round_++;

    if (round_player_id() == 0)
    {
        const int points_per_saved_bebe = 5;

        for (Player& player : own_players_)
        {
            int32_t& player_score = player.rules_player().score;

            // Update scores for each saved baby.
            for (const Panda& panda : player.pandas())
            {
                player_score +=
                    panda.saved_bebes().size() * points_per_saved_bebe;
            }
        }
    }
}

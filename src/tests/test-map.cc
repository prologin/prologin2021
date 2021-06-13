#include <unordered_set>
#include <gtest/gtest.h>
#include "../map.hh"

bool operator==(position a, position b)
{
    return std::pair(a.x, a.y) == std::pair(b.x, b.y);
}

bool operator<(position a, position b)
{
    return std::pair(a.x, a.y) < std::pair(b.x, b.y);
}

TEST(MapTest, PositionValidation)
{
    Map map;

    ASSERT_TRUE(map.is_valid({0, 0}));
    ASSERT_TRUE(map.is_valid({1, 1}));
    ASSERT_TRUE(map.is_valid({RIVIERE_MAX_X - 1, RIVIERE_MAX_Y - 1}));

    // Max values are exclusive.
    ASSERT_FALSE(map.is_valid({RIVIERE_MAX_X, 0}));
    ASSERT_FALSE(map.is_valid({0, RIVIERE_MAX_Y}));
    ASSERT_FALSE(map.is_valid({RIVIERE_MAX_X, RIVIERE_MAX_Y}));

    // Negative values are invalid.
    ASSERT_FALSE(map.is_valid({-1, 0}));
    ASSERT_FALSE(map.is_valid({0, -1}));
    ASSERT_FALSE(map.is_valid({-1, -1}));
}

TEST(MapTest, EvenColumnsAreLower)
{
    Map map;

    ASSERT_TRUE(map.is_lower({0, 0}));
    ASSERT_TRUE(map.is_lower({0, 1}));
    ASSERT_TRUE(map.is_lower({2, 2}));

    // Odd columns are higher.
    ASSERT_FALSE(map.is_lower({1, 0}));
    ASSERT_FALSE(map.is_lower({3, 0}));

    // is_lower returns false for invalid positions.
    ASSERT_FALSE(map.is_lower({-1, -1}));
}

TEST(MapTest, AdjacentPositions)
{
    Map map;

    // Use sets, since we don't care about the order.
    const auto to_set = [](std::vector<position> positions) {
        return std::set<position>(positions.begin(), positions.end());
    };

    // Normal case: odd column.
    ASSERT_EQ(
        to_set(map.get_adjacent_positions({1, 1})),
        std::set<position>({{0, 0}, {1, 0}, {2, 0}, {2, 1}, {1, 2}, {0, 1}}));

    // Normal case: even column.
    ASSERT_EQ(
        to_set(map.get_adjacent_positions({2, 2})),
        std::set<position>({{1, 2}, {2, 1}, {3, 2}, {3, 3}, {2, 3}, {1, 3}}));

    // Edge case: invalid position.
    ASSERT_EQ(
        to_set(map.get_adjacent_positions({-1, -1})),
        std::set<position>({}));

    // Edge case: top-left.
    ASSERT_EQ(
        to_set(map.get_adjacent_positions({0, 0})),
        std::set<position>({{1, 0}, {1, 1}, {0, 1}}));

    // Edge case: left.
    ASSERT_EQ(
        to_set(map.get_adjacent_positions({0, 1})),
        std::set<position>({{0, 0}, {1, 1}, {1, 2}, {0, 2}}));

    // Edge case: top (odd column).
    ASSERT_EQ(
        to_set(map.get_adjacent_positions({1, 0})),
        std::set<position>({{0, 0}, {1, 1}, {2, 0}}));

    // Edge case: top (even column).
    ASSERT_EQ(
        to_set(map.get_adjacent_positions({2, 0})),
        std::set<position>({{1, 0}, {1, 1}, {2, 1}, {3, 1}, {3, 0}}));
}

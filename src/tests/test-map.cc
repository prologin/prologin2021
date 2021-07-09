#include "../map.hh"
#include <gtest/gtest.h>
#include <unordered_set>

TEST(MapTest, EmptyInitialization)
{
    Map map(8, 10);

    ASSERT_EQ(map.width(), 8);
    ASSERT_EQ(map.height(), 10);

    for (int x = 0; x < map.width(); x++)
        for (int y = 0; y < map.height(); y++)
        {
            ASSERT_TRUE(map.get({x, y}).is_empty());
        }
}

// Reminder: even columns are "lower" than odd columns.
constexpr std::string_view kValidMap = "4 5\n"
                                       "A11 -34 ___ Y23\r\n"
                                       "-42 C01 ___ -66\n"
                                       "___ B55 ___ ___\r\n"
                                       "+62 ___ X13 Z01\n"
                                       "___ -25 -46 ___\n";
constexpr PontPolarity kIsStart = PontPolarity::Start;
constexpr PontPolarity kIsEnd = PontPolarity::End;
constexpr int kPlayer1 = 0;
constexpr int kPlayer2 = 1;
constexpr int kPanda1 = 0;
constexpr int kPanda2 = 1;

TEST(MapTest, ParseMap)
{
    std::istringstream ss(kValidMap.data());
    Map map(ss, 2);

    // Line #0.
    ASSERT_EQ(map.get({0, 0}),
              Cell::pont(1, NORD_EST, kIsStart).with_panda(kPlayer1, kPanda1));
    ASSERT_EQ(map.get({1, 0}), Cell::pont(3, SUD_OUEST, kIsEnd));
    ASSERT_EQ(map.get({2, 0}), Cell::empty());
    ASSERT_EQ(map.get({3, 0}),
              Cell::pont(2, SUD, kIsStart).with_panda(kPlayer2, kPanda2));

    // Line #1.
    ASSERT_EQ(map.get({0, 1}), Cell::pont(4, SUD_EST, kIsEnd));
    ASSERT_EQ(map.get({1, 1}), Cell::bebe(kPlayer1, 0));
    ASSERT_EQ(map.get({2, 1}), Cell::empty());
    ASSERT_EQ(map.get({3, 1}), Cell::pont(6, NORD, kIsEnd));

    // Line #2.
    ASSERT_EQ(map.get({0, 2}), Cell::empty());
    ASSERT_EQ(
        map.get({1, 2}),
        Cell::pont(5, NORD_OUEST, kIsStart).with_panda(kPlayer1, kPanda2));
    ASSERT_EQ(map.get({2, 2}), Cell::empty());
    ASSERT_EQ(map.get({3, 2}), Cell::empty());

    // Line #3.
    ASSERT_EQ(map.get({0, 3}), Cell::pont(6, SUD_EST, kIsStart));
    ASSERT_EQ(map.get({1, 3}), Cell::empty());
    ASSERT_EQ(map.get({2, 3}),
              Cell::pont(1, SUD, kIsStart).with_panda(kPlayer2, kPanda1));
    ASSERT_EQ(map.get({3, 3}), Cell::bebe(kPlayer2, 0));

    // Line #4.
    ASSERT_EQ(map.get({0, 4}), Cell::empty());
    ASSERT_EQ(map.get({1, 4}), Cell::pont(2, NORD_OUEST, kIsEnd));
    ASSERT_EQ(map.get({2, 4}), Cell::pont(4, NORD, kIsEnd));
    ASSERT_EQ(map.get({3, 4}), Cell::empty());
}

TEST(MapTest, ParseInvalidMap)
{
    auto parse_map = [](std::string_view map_str) {
        std::istringstream ss(map_str.data());
        Map map(ss, 2);
    };
    auto replace = [](std::string_view str, std::string_view pat,
                      std::string_view rep) {
        for (std::string rep_str(str);;)
        {
            size_t i = rep_str.find(pat);

            if (i == std::string::npos)
                return rep_str;

            rep_str.replace(i, pat.size(), rep);
        }
    };

    // Correct example.
    parse_map(kValidMap);

    // Empty.
    ASSERT_DEATH(parse_map(""), "");

    // Wrong dimensions.
    ASSERT_DEATH(parse_map(replace(kValidMap, "4 5\n", "4 6\n")), "");

    // Unknown cell.
    ASSERT_DEATH(parse_map(replace(kValidMap, "A11", "I11")), "");

    // Invalid cell value.
    ASSERT_DEATH(parse_map(replace(kValidMap, "55", "75")), "");

    // Unmatched bridge.
    ASSERT_DEATH(parse_map(replace(kValidMap, "A11", "___")), "");

    // Bridge facing the wrong way.
    ASSERT_DEATH(parse_map(replace(kValidMap, "34", "35")), "");

    // Bridge only has + ends.
    ASSERT_DEATH(parse_map(replace(kValidMap, "-", "+")), "");
}

TEST(MapTest, PositionValidation)
{
    Map map(10, 10);

    ASSERT_TRUE(map.is_valid({0, 0}));
    ASSERT_TRUE(map.is_valid({1, 1}));
    ASSERT_TRUE(map.is_valid({map.width() - 1, map.height() - 1}));

    // Max values are exclusive.
    ASSERT_FALSE(map.is_valid({map.width(), 0}));
    ASSERT_FALSE(map.is_valid({0, map.height()}));
    ASSERT_FALSE(map.is_valid({map.width(), map.height()}));

    // Negative values are invalid.
    ASSERT_FALSE(map.is_valid({-1, 0}));
    ASSERT_FALSE(map.is_valid({0, -1}));
    ASSERT_FALSE(map.is_valid({-1, -1}));
}

TEST(MapTest, EvenColumnsAreLower)
{
    Map map(10, 10);

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
    Map map(10, 10);

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
    ASSERT_EQ(to_set(map.get_adjacent_positions({-1, -1})),
              std::set<position>({}));

    // Edge case: top-left.
    ASSERT_EQ(to_set(map.get_adjacent_positions({0, 0})),
              std::set<position>({{1, 0}, {1, 1}, {0, 1}}));

    // Edge case: left.
    ASSERT_EQ(to_set(map.get_adjacent_positions({0, 1})),
              std::set<position>({{0, 0}, {1, 1}, {1, 2}, {0, 2}}));

    // Edge case: top (odd column).
    ASSERT_EQ(to_set(map.get_adjacent_positions({1, 0})),
              std::set<position>({{0, 0}, {1, 1}, {2, 0}}));

    // Edge case: top (even column).
    ASSERT_EQ(to_set(map.get_adjacent_positions({2, 0})),
              std::set<position>({{1, 0}, {1, 1}, {2, 1}, {3, 1}, {3, 0}}));
}

TEST(MapTest, RelativePosition)
{
    Map map(10, 10);

    // Even column.
    ASSERT_EQ(map.get_relative_position({2, 2}, NORD_EST), (position{3, 2}));
    ASSERT_EQ(map.get_relative_position({2, 2}, SUD_EST), (position{3, 3}));
    ASSERT_EQ(map.get_relative_position({2, 2}, SUD), (position{2, 3}));
    ASSERT_EQ(map.get_relative_position({2, 2}, SUD_OUEST), (position{1, 3}));
    ASSERT_EQ(map.get_relative_position({2, 2}, NORD_OUEST), (position{1, 2}));
    ASSERT_EQ(map.get_relative_position({2, 2}, NORD), (position{2, 1}));

    // Odd column.
    ASSERT_EQ(map.get_relative_position({1, 1}, NORD_EST), (position{2, 0}));
    ASSERT_EQ(map.get_relative_position({1, 1}, SUD_EST), (position{2, 1}));
    ASSERT_EQ(map.get_relative_position({1, 1}, SUD), (position{1, 2}));
    ASSERT_EQ(map.get_relative_position({1, 1}, SUD_OUEST), (position{0, 1}));
    ASSERT_EQ(map.get_relative_position({1, 1}, NORD_OUEST), (position{0, 0}));
    ASSERT_EQ(map.get_relative_position({1, 1}, NORD), (position{1, 0}));
}

TEST(MapTest, RelativeDirection)
{
    Map map(10, 10);

    // Even column.
    ASSERT_EQ(map.get_relative_direction({2, 2}, {3, 2}), NORD_EST);
    ASSERT_EQ(map.get_relative_direction({2, 2}, {3, 3}), SUD_EST);
    ASSERT_EQ(map.get_relative_direction({2, 2}, {2, 3}), SUD);
    ASSERT_EQ(map.get_relative_direction({2, 2}, {1, 3}), SUD_OUEST);
    ASSERT_EQ(map.get_relative_direction({2, 2}, {1, 2}), NORD_OUEST);
    ASSERT_EQ(map.get_relative_direction({2, 2}, {2, 1}), NORD);

    // Odd column.
    ASSERT_EQ(map.get_relative_direction({1, 1}, {2, 0}), NORD_EST);
    ASSERT_EQ(map.get_relative_direction({1, 1}, {2, 1}), SUD_EST);
    ASSERT_EQ(map.get_relative_direction({1, 1}, {1, 2}), SUD);
    ASSERT_EQ(map.get_relative_direction({1, 1}, {0, 1}), SUD_OUEST);
    ASSERT_EQ(map.get_relative_direction({1, 1}, {0, 0}), NORD_OUEST);
    ASSERT_EQ(map.get_relative_direction({1, 1}, {1, 0}), NORD);

    // Invalid arguments.
    ASSERT_EQ(map.get_relative_direction({1, 1}, {1, 1}), -1);
    ASSERT_EQ(map.get_relative_direction({1, 1}, {1, 3}), -1);
    ASSERT_EQ(map.get_relative_direction({1, 1}, {2, 2}), -1);
}

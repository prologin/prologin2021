#include "../player.hh"

#include <gtest/gtest.h>

TEST(PlayerTest, EmptyInitialization)
{
    Map map(8, 10);

    Bebe bebe(map, 1, 1, {4, 3});
    ASSERT_EQ(bebe.get_pos().x, 4);
    ASSERT_EQ(bebe.get_pos().y, 3);
    ASSERT_FALSE(bebe.is_saved());
    ASSERT_EQ(map.get({4, 3}), Cell::bebe(/* joueur= */ 1, /* num= */ 1));

    Panda panda_one(map, 1, 1, {5, 5});
    ASSERT_EQ(panda_one.get_pos().x, 5);
    ASSERT_EQ(panda_one.get_pos().y, 5);
    ASSERT_EQ(map.get({5, 5}), Cell::panda(/* joueur= */ 1, /* num= */ 1));

    Panda panda_two(map, 1, 1, {7, 5});
    ASSERT_EQ(panda_two.get_pos().x, 7);
    ASSERT_EQ(panda_two.get_pos().y, 5);
    ASSERT_EQ(map.get({7, 5}), Cell::panda(/* joueur= */ 1, /* num= */ 1));

    std::vector<Bebe> babies = {bebe};
    Player player(panda_one, panda_two, babies);
}

TEST(PlayerTest, SetBebeValid)
{
    Map map(8, 10);

    ASSERT_NO_THROW(Bebe bebe(map, 1, 1, {4, 3}));
}

TEST(PlayerTest, SetBebeInvalid)
{
    Map map(8, 10);

    ASSERT_ANY_THROW(Bebe bebe(map, 1, 1, {9, 3}));
}

TEST(PlayerTest, SetPandaValid)
{
    Map map(8, 10);

    ASSERT_NO_THROW(Panda panda(map, 1, 1, {4, 3}));
}

TEST(PlayerTest, SetPandaInvalid)
{
    Map map(8, 10);

    ASSERT_ANY_THROW(Panda panda(map, 1, 1, {9, 3}));
}

#include "../player.hh"

#include <gtest/gtest.h>

TEST(PlayerTest, PandaAndBebe)
{
    Bebe bebe(1, 1, {4, 3});
    ASSERT_EQ(bebe.id(), 1);
    ASSERT_EQ(bebe.player_id(), 1);
    ASSERT_EQ(bebe.pos().x, 4);
    ASSERT_EQ(bebe.pos().y, 3);
    ASSERT_EQ(bebe.savior(), nullptr);
    ASSERT_FALSE(bebe.is_saved());

    Panda panda(1, 1, {5, 5});
    ASSERT_EQ(panda.id(), 1);
    ASSERT_EQ(panda.player_id(), 1);
    ASSERT_EQ(panda.pos().x, 5);
    ASSERT_EQ(panda.pos().y, 5);
    ASSERT_TRUE(panda.saved_bebes().empty());

    // Add a baby, both values change.
    panda.save_bebe(bebe);

    ASSERT_TRUE(bebe.is_saved());
    ASSERT_EQ(bebe.savior(), &panda);
    ASSERT_EQ(panda.saved_bebes().size(), (size_t)1);
    ASSERT_EQ(panda.saved_bebes().at(0), &bebe);

    // Add the same baby again, that's a no-no.
    ASSERT_DEATH(panda.save_bebe(bebe),
                 "Assertion `savior_ == nullptr' failed");

    // Add a baby belonging to another player, that's a no-no.
    Bebe other_player_bebe(0, 0, {0, 0});

    ASSERT_DEATH(panda.save_bebe(other_player_bebe),
                 "Assertion `bebe.player_id\\(\\) == player_id\\(\\)' failed");
}

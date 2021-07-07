#include <gtest/gtest.h>

#include "../api.hh"
#include "../dumper.hh"
#include "../game_state.hh"

extern const char* dump_state_json();

struct Player_api
{
    int id;
    std::unique_ptr<Api> api;
};
std::vector<Player> players;

std::string map = "4 5\n"
                  "A11 -34 ___ Y23\n"
                  "-42 C01 ___ -66\n"
                  "___ B55 ___ ___\n"
                  "+62 ___ X13 Z01\n"
                  "___ -25 -46 ___\n";

TEST(DumpTest, Dump)
{
    rules::Players players;
    players.add(std::make_shared<rules::Player>(0, rules::PLAYER));
    players.add(std::make_shared<rules::Player>(1, rules::PLAYER));

    std::istringstream map_stream(map);
    Map mp(map_stream, 2);
    // auto st = std::make_unique<GameState>(players, mp);
    std::cout << "HELP";

    // std::vector<Player_api> apis;
    // apis.push_back(Player_api{
    //     1337, std::make_unique<Api>(std::unique_ptr<GameState>(st->copy()),
    //                                 players[0])});
    // apis.push_back(Player_api{
    //     42, std::make_unique<Api>(std::unique_ptr<GameState>(st->copy()),
    //                               players[1])});

    // std::cout << dump_state_json();
}

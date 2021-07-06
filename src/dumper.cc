#include "api.hh"
#include <iomanip>

// from api.cc
extern Api* api;

constexpr auto COMMA = ", ";

/// Decodes a UTF-8 string to a list of 32 bit unicode codepoints. Ignores
/// erroneous characters.
/// Imported from prologin2016
static std::u32string utf8_decode(std::string_view s)
{
    std::u32string ret;
    size_t i = 0;
    size_t size = s.size();

    while (i < size)
    {
        if ((s[i] & 0x80) == 0)
        {
            ret.push_back(s[i++]);
        }
        else if ((s[i] & 0xe0) == 0xc0 && (i + 1) < size &&
                 (s[i + 1] & 0xc0) == 0x80)
        {
            ret.push_back(((s[i] & 0x1f) << 6) | (s[i + 1] & 0x3f));
            i += 2;
        }
        else if ((s[i] & 0xf0) == 0xe0 && (i + 2) < size &&
                 (s[i + 1] & 0xc0) == 0x80 && (s[i + 2] & 0xc0) == 0x80)
        {
            ret.push_back(((s[i] & 0x0f) << 12) | ((s[i + 1] & 0x3f) << 6) |
                          (s[i + 2] & 0x3f));
            i += 3;
        }
        else if ((s[i] & 0xf8) == 0xf0 && (i + 3) < size &&
                 (s[i + 1] & 0xc0) == 0x80 && (s[i + 2] & 0xc0) == 0x80 &&
                 (s[i + 1] & 0xc0) == 0x80)
        {
            ret.push_back(((s[i] & 0x07) << 18) | ((s[i + 1] & 0x3f) << 12) |
                          ((s[i + 2] & 0x3f) << 6) | (s[i + 3] & 0x3f));
            i += 4;
        }
        else
        {
            i++;
        }
    }

    return ret;
}

/// Dump a JSON-escaped UTF-8 string
/// Imported from prologin2016
static void dump_string(std::ostream& ss, std::string_view s)
{
    /*
     * RFC4627, 2.5:
     * All Unicode characters may be placed within the quotation marks except
     * for the characters that must be escaped: quotation mark, reverse solidus,
     * and the control characters (U+0000 through U+001F).
     */
    std::ios state(nullptr);
    state.copyfmt(ss);
    std::u32string utf32 = utf8_decode(s);
    ss << "\"";
    for (char32_t& c : utf32)
    {
        if (c == u'"')
        {
            ss << "\\\"";
        }
        else if (c == u'\\')
        {
            ss << "\\\\";
        }
        else if (u'\u0020' <= c && c <= u'\u007E')
        {
            // printable ASCII
            ss << static_cast<char>(c);
        }
        else if (c > u'\uFFFF')
        {
            // surrogate pair
            // http://unicode.org/faq/utf_bom.html#utf16-2
            const unsigned s = c - 0x010000;
            const unsigned lead = (s >> 10) + 0xD800;
            const unsigned trail = (s & 0x3FF) + 0xDC00;
            ss << "\\u" << std::hex << std::setfill('0') << std::setw(4)
               << lead;
            ss.copyfmt(state);
            ss << "\\u" << std::hex << std::setfill('0') << std::setw(4)
               << trail;
            ss.copyfmt(state);
        }
        else
        {
            ss << "\\u" << std::hex << std::setfill('0') << std::setw(4) << c;
            ss.copyfmt(state);
        }
    }
    ss << '"';
}

// static void dump_player_turn(std::ostream& ss, const GameState& st,
//                              int player_id)
// {
//     ss << "{";
//     ss << "\"round\": [" << st.round_id() << ", " << NB_TOURS << "]";

//     ss << ", \"active_player\": {";
//     ss << "\"player_id\"" << player_id << ", \"name\":";

//     const Player* player = st.player_at(player_id);
//     dump_string(ss, player->rules_player().name);

//     ss << ", \"score\": " << player->rules_player().score << "}";
//     ss << ", \"actions\": [";
//     const std::vector<action_hist> history = player->last_actions();
//     std::string sep = "";
//     for (const action_hist& action : history)
//     {
//         ss << sep;
//         sep = ",";
//         // TODO
//         // action.dump_json();
//     }
// }

struct Str
{
    Str(std::string_view str)
        : str(str)
    {
    }

    std::string_view str;
};

static std::ostream& operator<<(std::ostream& ss, Str str)
{
    dump_string(ss, str.str);

    return ss;
}

// Enums.
// ===========================================================================

static std::ostream& operator<<(std::ostream& ss, enum action_type action_type)
{
    ss << "\"";
    switch (action_type)
    {
    case ACTION_DEPLACER:
        ss << "ACTION_DEPLACER";
        break;
    case ACTION_POSER:
        ss << "ACTION_POSER";
        break;
    }
    return ss << "\"";
}

static std::ostream& operator<<(std::ostream& ss, case_type ctype)
{
    ss << "\"";
    switch (ctype)
    {
    case LIBRE:
        ss << "LIBRE";
        break;
    case OBSTACLE:
        ss << "OBSTACLE";
        break;
    case PONT:
        ss << "PONT";
        break;
    case BEBE:
        ss << "BEBE";
        break;
    }
    ss << "\"";
    return ss;
}

static std::ostream& operator<<(std::ostream& ss, direction dir)
{
    ss << "\"";
    switch (dir)
    {
    case NORD_EST:
        ss << "NORD_EST";
        break;
    case SUD_EST:
        ss << "SUD_EST";
        break;
    case SUD:
        ss << "SUD";
        break;
    case SUD_OUEST:
        ss << "SUD_OUEST";
        break;
    case NORD_OUEST:
        ss << "NORD_OUEST";
        break;
    case NORD:
        ss << "NORD";
        break;
    }
    ss << "\"";
    return ss;
}

// Basic structs.
// ===========================================================================

template <typename V> struct KV
{
    KV(std::string_view key, const V& value)
        : key(key)
        , value(value)
    {
    }

    std::string_view key;
    const V& value;
};

template <typename V>
static std::ostream& operator<<(std::ostream& ss, KV<V> kv)
{
    return ss << Str(kv.key) << ": " << kv.value;
}

template <typename T> struct Vec
{
    Vec(const std::vector<T>& vec)
        : vec(vec)
    {
    }

    const std::vector<T>& vec;
};

static std::ostream& operator<<(std::ostream& ss, position pos)
{
    return ss << '{' << KV{"x", pos.x} << ", " << KV{"y", pos.y} << '}';
}

static std::ostream& operator<<(std::ostream& ss, tour_info tour)
{
    return ss << '{' << KV{"round_id", tour.id_tour} << ", "
              << KV{"player_id", tour.id_joueur_joue} << ", "
              << KV{"panda_id", tour.id_panda_joue} << '}';
}

static std::ostream& operator<<(std::ostream& ss, action_hist action)
{
    ss << '{' << KV{"type", action.type_action} << ", "
       << KV{"panda_id", action.id_panda} << ", ";

    switch (action.type_action)
    {
    case ACTION_DEPLACER:
        ss << KV{"direction", action.dir};
        break;
    case ACTION_POSER:
        ss << KV{"direction", action.dir} << ", "
           << KV{"start_value", action.valeur_debut} << ", "
           << KV{"end_value", action.valeur_fin} << ", "
           << KV{"start_position", action.pos_debut} << ", "
           << KV{"end_position", action.pos_fin};
        break;
    }

    return ss << '}';
}

// Large classes.
// ===========================================================================

template <typename T>
static std::ostream& operator<<(std::ostream& ss, Vec<T> vec)
{
    ss << '[';

    const auto& values = vec.vec;

    for (size_t i = 0; i < values.size(); i++)
    {
        ss << values[i];

        if (i < values.size() - 1)
            ss << ", ";
    }

    return ss << ']';
}

static std::ostream& operator<<(std::ostream& ss, const Map& map)
{
    ss << R"({"cells": [)";

    for (int x = 0; x < map.width(); x++)
        for (int y = 0; y < map.height(); y++)
        {
            const position pos{x, y};
            const Cell cell = map.get(pos);

            ss << '{' << KV{"position", pos} << ", ";

            int value, player;
            direction dir;
            bool is_start;

            if (cell.is_empty())
            {
                ss << KV{"type", LIBRE};
            }
            else if (cell.is_bebe(&player, &value))
            {
                ss << KV{"type", BEBE} << ", " << KV{"player", player} << ", "
                   << KV{"id", value};
            }
            else if (cell.is_pont(&value, &dir, &is_start))
            {
                ss << KV{"type", PONT} << ", " << KV{"value", value} << ", "
                   << KV{"direction", dir} << ", " << KV{"is_start", is_start};

                if (cell.has_panda(&player, &value))
                {
                    ss << KV{"panda", true} << ", " << KV{"player", player}
                       << ", " << KV{"id", value};
                }
                else
                {
                    ss << KV{"panda", false};
                }
            }

            ss << '}';

            if (x < map.width() - 1 || y < map.height() - 1)
                ss << ", ";
        }

    return ss << "]}";
}

static std::ostream& operator<<(std::ostream& ss, const Panda& panda)
{
    return ss << '{' << KV{"id", panda.id()} << ", " << KV{"pos", panda.pos()}
              << ", " << KV{"saved_babies", panda.saved_bebes().size()} << '}';
}

static std::ostream& operator<<(std::ostream& ss, const Player& player)
{
    return ss << '{' << KV{"id", player.id()} << ", "
              << KV{"name", player.rules_player().name} << ", "
              << KV{"score", player.rules_player().score} << ", "
              << KV{"total_babies", player.bebes().size()} << ", "
              << KV{"pandas", Vec{player.pandas()}} << ", "
              << KV{"last_actions", Vec{player.last_actions()}} << '}';
}

static std::ostream& operator<<(std::ostream& ss, const GameState& st)
{
    return ss << '{' << KV{"round", api->info_tour()} << ", "
              << KV{"map", st.map()} << ", " << KV{"players", Vec{st.players()}}
              << '}';
}

extern "C" const char* dump_state_json()
{
    // Warning: everytime this function is called, it invalidates the previous
    // return values by free-ing them.
    // This allows us to return a const char* that doesn't get invalidated as
    // soon as the function returns, though.
    static std::string s;
    std::ostringstream ss;
    ss << api->game_state();
    s = ss.str();
    return s.c_str();
}

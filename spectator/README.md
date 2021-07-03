# Spectator
Displays a match in real time

## Structure
- www : Web site interface files
- champion : The champion to use as spectator

## Setup
1. Front end must be set up (see [front/README](../front/README.md))
1. Execute launch_spectator.sh from the root folder
1. The link to the server will be printed, open it in your web browser
1. Go to spectator/champion and build the champion :
```sh
make
```
1. Add this line to your player_env/<language>/config.yml :
```yaml
spectators:
  - /path/to/prologin2021/spectator/champion/champion.so
```
1. Start a new game with stechec2

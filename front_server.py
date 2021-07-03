# Front end (map editor / replay / spectator) web server
# This script must be executed from the root directory

import os
import sys
from http import server
from socketserver import TCPServer
import requests


BASE_PORT = 8000
SPECTATOR_URL = "http://localhost:8102"


class RequestHandler(server.SimpleHTTPRequestHandler):
    # Root of the current server (i.e. editor)
    root = "."

    def __init__(self, *args):
        super().__init__(*args)

    def do_GET(self):
        print("GET", self.path)

        is_action = self.path.startswith("/action/")

        if is_action:
            action = self.path[len("/action/") :]

            if action == "next_state":
                # Get from spectator server
                rq = requests.get(SPECTATOR_URL)

                # Write next_state file
                if rq.status_code == 200:
                    data = rq.text
                    with open("front/www/next_state", "w") as f:
                        f.write(data)
            elif action == "stop":
                # Just stop
                rq = requests.get(SPECTATOR_URL + "/stop")

            self.path = "/front/" + action

        is_shared = self.path.startswith("/front/")

        # Change directory
        if is_shared:
            # Remove /front prefix
            self.path = self.path[len("/front") :]

            # Change to shared front directory
            self.directory = os.path.abspath(self.directory + "/front/www")
        else:
            self.directory = os.path.abspath(
                self.directory + "/" + RequestHandler.root + "/www"
            )

        return super().do_GET()


def print_help():
    print("utilisation:")
    print("front_server editor      Lance l'éditeur de cartes")
    print("front_server replay      Lance le replay")
    print("front_server spectator   Lance le spectateur")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print_help()
        exit()
    elif sys.argv[1] == "editor":
        server_id = 1
        server_name = "l'éditeur de map"
        server_root = "editor"
    elif sys.argv[1] == "replay":
        server_id = 2
        server_name = "le replay"
        server_root = "replay"
    elif sys.argv[1] == "spectator":
        server_id = 3
        server_name = "le spectateur"
        server_root = "spectator"
    else:
        print_help()
        exit(-1)

    port = BASE_PORT + server_id
    RequestHandler.root = server_root

    # To avoid address already in use error
    TCPServer.allow_reuse_address = True
    with TCPServer(("127.0.0.1", port), RequestHandler) as httpd:
        print(f"Lien vers {server_name} : http://localhost:{port}")
        httpd.serve_forever()
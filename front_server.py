# Front end (map editor / replay...) web server
# This script must be executed from the root directory

import os
import sys
from http import server
from socketserver import TCPServer


BASE_PORT = 8000


class RequestHandler(server.SimpleHTTPRequestHandler):
    # Root of the current server (i.e. editor)
    root = "."

    def __init__(self, *args):
        super().__init__(*args)

    def do_GET(self):
        print("GET", self.path)
        is_shared = self.path.startswith("/front/")

        # Change directory
        if is_shared:
            # Remove /front prefix
            self.path = self.path[len("/front") :]

            # Change to shared front directory
            self.directory = os.path.abspath(self.directory + "/front/www")
        else:
            print(self.directory)
            print(RequestHandler.root)

            self.directory = os.path.abspath(
                self.directory + "/" + RequestHandler.root + "/www"
            )

            print(self.directory)
            print('--------')

        return super().do_GET()


def print_help():
    print("utilisation:")
    print("front_server editor      Lance l'éditeur de cartes")
    print("front_server replay      Lance le replay")


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
    else:
        print_help()
        exit(-1)

    port = BASE_PORT + server_id
    RequestHandler.root = server_root

    with TCPServer(("", port), RequestHandler) as httpd:
        print(f"Lien vers {server_name} : http://localhost:{port}")
        httpd.serve_forever()

# Map editor web server
# This script must be executed from the /editor directory

import os
from http import server
from socketserver import TCPServer


PORT = 8000


class RequestHandler(server.SimpleHTTPRequestHandler):
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
            self.directory = os.path.abspath(self.directory + "/../front/www")
        else:
            self.directory = os.path.abspath(self.directory + "/www")

        return super().do_GET()


with TCPServer(("", PORT), RequestHandler) as httpd:
    print(f"Lien vers l'éditeur de cartes : http://localhost:{PORT}")
    httpd.serve_forever()

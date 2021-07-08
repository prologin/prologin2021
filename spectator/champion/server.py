from http import server
from socketserver import TCPServer
from queue import Queue
import threading
import ctypes


LIBPROLOGIN = "libprologin2021.so"
librules = ctypes.cdll.LoadLibrary(LIBPROLOGIN)
get_dump = librules.dump_state_json
get_dump.argtypes = []
get_dump.restype = ctypes.c_char_p


class Server(server.SimpleHTTPRequestHandler):
    PORT = 8102
    server: TCPServer = None
    queue: Queue = None

    @classmethod
    def start(cls):
        cls.queue = Queue()
        TCPServer.allow_reuse_address = True
        cls.server = TCPServer(("127.0.0.1", cls.PORT), Server)
        th = threading.Thread(target=Server.serve)
        th.daemon = True
        th.start()
        print(f"Started spectator at http://localhost:{cls.PORT}")

    @classmethod
    def serve(cls):
        cls.server.serve_forever()

    @classmethod
    def stop(cls):
        if cls.server is not None:
            cls.server.shutdown()
            cls.server.server_close()
            cls.server = None
            print("Spectator server stopped")

    def __init__(self, *args):
        super().__init__(*args)

    def do_GET(self):
        print("GET", self.path)

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        if self.path == "/stop":
            self.wfile.write(b"Stopping")
            Server.queue.put(None)
        else:
            self.wfile.write(get_dump())
            Server.queue.put("Get")

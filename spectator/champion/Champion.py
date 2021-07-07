from api import *
from server import Server


# Fonction appelée au début de la partie.
def partie_init():
    # Start server
    Server.start()


# Fonction appelée à chaque tour.
def jouer_tour():
    # Don't wait if the server is stopped
    if Server.server is not None:
        # Wait for server request (/next_state)
        result = Server.queue.get()

        if result is None:
            Server.stop()


# Fonction appelée à la fin de la partie.
def partie_fin():
    Server.stop()

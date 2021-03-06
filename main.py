# from https://stackoverflow.com/questions/51295378/start-http-web-server-then-open-browser
import sys
import time
import threading
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

ip = "127.0.0.1"
port = 3600
url = f"http://{ip}:{port}"


def start_server():
    server_address = (ip, port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    httpd.serve_forever()


threading.Thread(target=start_server).start()
webbrowser.open_new(url)

while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        sys.exit(0)

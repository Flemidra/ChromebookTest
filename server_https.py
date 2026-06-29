#!/usr/bin/env python3
import http.server, ssl, socketserver, os
PORT = 8443
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args): pass
os.chdir(DIRECTORY)
if not (os.path.exists("localhost.pem") and os.path.exists("localhost-key.pem")):
    print("ERROR: HTTPS certificates not found.")
    print("Run: mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1")
    exit(1)
httpd = socketserver.TCPServer(("0.0.0.0", PORT), QuietHandler)
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="localhost.pem", keyfile="localhost-key.pem")
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
print(f"Serving HTTPS at https://0.0.0.0:{PORT}")
httpd.serve_forever()

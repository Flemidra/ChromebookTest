#!/usr/bin/env python3
import http.server, socketserver, os
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args): pass
    def end_headers(self):
        self.send_header("Cache-Control","no-store, no-cache, must-revalidate")
        self.send_header("Pragma","no-cache")
        super().end_headers()
os.chdir(DIRECTORY)
print(f"Serving HTTP at http://0.0.0.0:{PORT}")
with socketserver.TCPServer(("0.0.0.0", PORT), QuietHandler) as httpd:
    httpd.serve_forever()

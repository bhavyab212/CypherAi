import http.server
import socketserver
import os
import mimetypes

PORT = 3001
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("application/javascript", ".mjs")
mimetypes.add_type("application/octet-stream", ".framercms")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("image/jpeg", ".jpg")
mimetypes.add_type("image/jpeg", ".jpeg")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("text/css", ".css")

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Remove query parameters and hash
        clean_path = self.path.split("?")[0].split("#")[0]
        # Resolve local path
        local_path = os.path.normpath(os.path.join(DIRECTORY, clean_path.lstrip("/")))
        
        # If file does not exist, and it is a page route, serve index.html (SPA Fallback)
        if not os.path.exists(local_path) and not any(clean_path.endswith(ext) for ext in [".js", ".mjs", ".css", ".png", ".jpg", ".jpeg", ".svg", ".woff2", ".woff", ".ttf", ".framercms"]):
            self.path = "/index.html"
            
        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"SPA Server running on http://127.0.0.1:{PORT}")
        httpd.serve_forever()

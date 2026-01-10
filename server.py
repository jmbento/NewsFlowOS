#!/usr/bin/env python3
"""
Servidor HTTP simples para NewsFlow OS
Execute: python3 server.py
"""

import http.server
import socketserver
import os
import sys

PORT = 3000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Headers CORS para desenvolvimento
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Log customizado
        sys.stderr.write(f"[{self.address_string()}] {format % args}\n")

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print("=" * 60)
        print(f"🚀 NewsFlow OS - Servidor HTTP")
        print("=" * 60)
        print(f"📁 Diretório: {os.getcwd()}")
        print(f"🌐 URL: http://localhost:{PORT}")
        print(f"🌐 URL: http://127.0.0.1:{PORT}")
        print("=" * 60)
        print("Pressione Ctrl+C para parar o servidor")
        print("=" * 60)
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor parado pelo usuário")
            sys.exit(0)

if __name__ == "__main__":
    main()

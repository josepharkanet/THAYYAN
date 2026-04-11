import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from server import app

# Passenger expects a WSGI-compatible 'application' object
# FastAPI is ASGI, so we use uvicorn to bridge it
from uvicorn.middleware.wsgi import WSGIMiddleware

# This won't work directly — Passenger needs WSGI.
# Instead, we run uvicorn as a subprocess or use a2wsgi.
# The recommended approach for cPanel is to use a2wsgi:
try:
    from a2wsgi import ASGIMiddleware
    application = ASGIMiddleware(app)
except ImportError:
    # Fallback: direct WSGI won't work for async routes
    # Install a2wsgi: pip install a2wsgi
    raise ImportError("Please install a2wsgi: pip install a2wsgi")

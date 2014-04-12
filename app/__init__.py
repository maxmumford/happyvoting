from flask import Flask
import os

# init app
app = Flask(__name__)

# handle configuration
app.config.update(
    DEBUG=False,
    UPLOAD_FOLDER = '/tmp/happify/',
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024, # 16 megabytes
)
app.secret_key = '23809redwfiojt34ckuvmrco12332r23rfw2tr534lr3-3r-32t-34t-g34=gt'

# import custom python files
from app import views
from app import jinja_functions

# fix "connection reset" on post
# http://flask.pocoo.org/snippets/47/
from werkzeug.wsgi import LimitedStream
class StreamConsumingMiddleware(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        stream = LimitedStream(environ['wsgi.input'], int(environ.get('CONTENT_LENGTH') or 0))
        environ['wsgi.input'] = stream
        app_iter = self.app(environ, start_response)
        try:
            stream.exhaust()
            for event in app_iter:
                yield event
        finally:
            if hasattr(app_iter, 'close'):
                app_iter.close()
app.wsgi_app = StreamConsumingMiddleware(app.wsgi_app)

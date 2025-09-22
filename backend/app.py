from flask import Flask
from routes.sendcode import code_bp
from routes.postmp3 import postmp3_bp
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# register all blueprints
app.register_blueprint(code_bp)
app.register_blueprint(postmp3_bp)

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask
from routes.getcode import get_code_bp
from routes.postmp3 import upload_bp

app = Flask(__name__)

# register all blueprints
app.register_blueprint(get_code_bp)
app.register_blueprint(upload_bp)

if __name__ == "__main__":
    app.run(debug=True)

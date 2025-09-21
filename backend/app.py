from flask import Flask, send_file

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, Flask is working!"

@app.route("/stream")
def stream_audio():
    return send_file("song.mp3", mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(debug=True)

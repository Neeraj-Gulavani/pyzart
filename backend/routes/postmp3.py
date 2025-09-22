from flask import Blueprint, send_file, jsonify
import os
import time

postmp3_bp = Blueprint("postmp3", __name__)

@postmp3_bp.route("/stream-mp3", methods=["GET"])
def stream_mp3():
    path = os.path.join("..", "rec.wav")

    if not os.path.exists(path):
        return jsonify({"error": "File not found"}), 404
    return send_file(path, mimetype="audio/wav", as_attachment=False)
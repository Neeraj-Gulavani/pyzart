from flask import Blueprint, request, jsonify
import os

upload_bp = Blueprint("upload", __name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@upload_bp.route("/upload-mp3", methods=["POST"])
def upload_mp3():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "" or not file.filename.lower().endswith(".mp3"):
        return jsonify({"error": "Invalid file"}), 400
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)
    return jsonify({"message": "File uploaded", "path": path})
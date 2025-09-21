from flask import Blueprint, request, jsonify

code_bp = Blueprint("code", __name__)

@code_bp.route("/send-code", methods=["POST"])
def send_code():
    data = request.get_json()  # Parse JSON body
    if not data or "code" not in data:
        return jsonify({"error": "missing 'code'"}), 400

    code = data["code"]
    return jsonify({"message": "Code received!", "code": code})


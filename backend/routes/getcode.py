from flask import Blueprint, request, jsonify

get_code_bp = Blueprint("get_code", __name__)

@get_code_bp.route("/get", methods=["GET"])
def get_code():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "missing 'code'"}), 400
    code_str=str(code)
    return jsonify({"code_str": str(code)})

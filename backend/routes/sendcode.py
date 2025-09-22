from flask import Blueprint, request, jsonify
from packages.evalcode import safe_exec
from musiclib.pyzart import Piano, Guitar, Instrument
from scamp import Session
import os
allowed_objects = {
    "Piano": Piano,
    "Guitar": Guitar,
    "Instrument": Instrument,
}
code_bp = Blueprint("code", __name__)

@code_bp.route("/send-code", methods=["POST"])
def send_code():
   #if os.path.exists("rec.wav"):
    #    os.remove("rec.wav")
    data = request.get_json()  # Parse JSON body
    if not data or "code" not in data:
        return jsonify({"error": "missing 'code'"}), 400

    code = data["code"]
    #safe_exec(code,allowed_objects)
    

    try:
        # create separate globals/locals so user code can't touch your Flask internals
        safe_globals = {"__builtins__": {"range": range}}   # no dangerous builtins
        safe_locals = allowed_objects.copy()
        session = Session()
        exec(code, safe_globals, safe_locals)

        return jsonify({"message": "Code received!", "code": code})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

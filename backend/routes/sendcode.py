from flask import Blueprint, request, jsonify
from packages.evalcode import safe_exec
from musiclib.pyzart import Instrument,Chord,instrument_keywords,MajorScale
from scamp import Session,fork,wait,wait_for_children_to_finish,wait_forever
import os
from time import sleep 
import random
import math
import itertools
#instruments = ["Piano", "Guitar", "Flute", "Violin", "Cello","Timpani"]

allowed_objects = {
    "Session": Session,
    "Chord" : Chord,
    "MajorScale": MajorScale,
}

for cls_name, scamp_keyword in instrument_keywords.items():
    cls = type(cls_name, (Instrument,), {
        "__init__": lambda self, session, name=scamp_keyword: super(type(self), self).__init__(session, name)
    })
    globals()[cls_name] = cls
    allowed_objects[cls_name] = cls
    
code_bp = Blueprint("code", __name__)

@code_bp.route("/send-code", methods=["POST"])
def send_code():

    data = request.get_json()  # Parse JSON body
    if not data or "code" not in data:
        return jsonify({"error": "missing 'code'"}), 400

    code = data["code"]

    

    try:
        # create separate globals/locals so user code can't touch your Flask internals
        safe_globals = {
    "__builtins__": {
        # Core safe builtins
        "range": range,
        "len": len,
        "enumerate": enumerate,
        "zip": zip,
        "min": min,
        "max": max,
        "sum": sum,
        "abs": abs,
        "round": round,
        "int": int,
        "float": float,
        "str": str,
        "bool": bool,
        "list": list,
        "dict": dict,
        "set": set,
        "tuple": tuple,
        "print": print,
    },

    # Useful modules
    "math": math,       # sin, cos, pi, etc.
    "random": random,   # random(), randint(), choice(), shuffle()
    "itertools": itertools,  # cycle, permutations, combinations, etc.
    "wait": wait,     # rests in music
    "sync": fork,
    "Chord" : Chord,
    "Session": Session,
}
        
        #safe_locals = allowed_objects.copy()
        safe_globals.update(allowed_objects)
        code = "session = Session()\n" + code
        for cls_name, scamp_keyword in instrument_keywords.items():
            code = code.replace(f"{cls_name}()", f"{cls_name}(session, '{scamp_keyword}')")
        print(code)
        exec(code, safe_globals, safe_globals)

        return jsonify({"message": "Code received!", "code": code})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

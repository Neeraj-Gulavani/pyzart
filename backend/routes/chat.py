from flask import Blueprint,jsonify, request
from external.geminiManager import askGemini
chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat",methods=["POST"])
def bot_chat():
    data = request.get_json()
    user_message = data.get("message","")
    bot_reply = askGemini(user_message)
    return jsonify({"reply":bot_reply})

# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from ..fabric_draw_back.node_generator import parse_json

app = Flask(__name__)
CORS(app)  # 添加这一行来启用CORS


@app.route("/", methods=["POST"])
def handle_post_request():
    data = request.get_json()
    message = data.get("message", "No message received")
    if message == "Drag":
        json_file = "config.json"
    with open(json_file) as js:
        network_json = json.load(js)
        parse_json(network_json)

    return jsonify({"response": "Message received successfully"})


if __name__ == "__main__":
    app.run(port=5000)

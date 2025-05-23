import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS 
from chat import get_response

app=  Flask(__name__)
CORS(app)

# @app.get("/")
# def index_get():
#  return render_template("base.html")

@app.get("/")
def home():
    return jsonify({"status": "Chatbot backend is live!"})

@app.post("/predict")
def predict():
    text= request.get_json().get("message")
    response= get_response(text)
    message ={'answer': response}
    return jsonify(message)

# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # use Render-assigned port
    app.run(host="0.0.0.0", port=port, debug=True)
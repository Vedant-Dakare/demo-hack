import torch
import torch.nn as nn
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torchvision.transforms as transforms
from huggingface_hub import snapshot_download
import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Allow requests from the Vite dev server if needed
CORS(app, supports_credentials=True , resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

repo_path = snapshot_download("SoloScript/SmartGovModel")

sys.path.append(repo_path)

from model import build_model

model = build_model(4)
model.load_state_dict(torch.load(os.path.join(repo_path, "image_modelv2.pth"), map_location="cpu"))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

classnames = ["Drainage", "Road_Damage", "Street_Light", "Trash"]

@app.route("/classify-image", methods=["POST"])
def classify_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(file).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(image)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    return jsonify({
        "classification": classnames[int(predicted.item())],
        "confidence": float(confidence.item())
    })


@app.route("/classify-text", methods=["POST"])
def classify_text():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Send JSON with 'text' field"}), 400

    text = data["text"]
    candidate_labels = classnames
    token = os.getenv("HF_TOKEN")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    payload = {
        "inputs": text,
        "parameters": {
            "candidate_labels": candidate_labels,
            "multi_label": False
        }
    }

    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/valhalla/distilbart-mnli-12-3",
            headers=headers,
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()
    except Exception as e:
        return jsonify({"error": f"Text classification failed: {str(e)}"}), 502

    label = None
    score = None

    # HF can return either {"labels": [...], "scores": [...]} or [{"label": "...", "score": ...}, ...]
    if isinstance(result, dict):
        labels = result.get("labels", [])
        scores = result.get("scores", [])
        if labels and scores:
            label = labels[0]
            score = scores[0]
        elif "label" in result and "score" in result:
            label = result["label"]
            score = result["score"]
    elif isinstance(result, list) and result and isinstance(result[0], dict):
        ranked = sorted(result, key=lambda x: float(x.get("score", 0)), reverse=True)
        label = ranked[0].get("label")
        score = ranked[0].get("score")

    if label is None or score is None:
        return jsonify({"error": "Unexpected response format from text classifier"}), 502

    return jsonify({
        "classification": label,
        "confidence": float(score)
    })

if __name__ == "__main__":
    app.run(debug=True)

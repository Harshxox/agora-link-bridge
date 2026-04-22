from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the trained ML model on startup
with open('compliance_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/analyze', methods=['POST'])
def analyze_transaction():
    data = request.get_json()
    
    # Extract features from the request
    # Features must match the training data: [amount, wallet_age_days, freq_per_hour]
    features = pd.DataFrame([[
        data['amount'], 
        data['wallet_age'], 
        data['frequency']
    ]], columns=['amount', 'wallet_age_days', 'freq_per_hour'])
    
    # Predict: 1 = Normal, -1 = Anomaly (Fraud)
    prediction = model.predict(features)[0]
    
    # Calculate a decision
    status = "APPROVED" if prediction == 1 else "FLAGGED"
    risk_level = "LOW" if prediction == 1 else "HIGH"

    return jsonify({
        "status": status,
        "risk_level": risk_level,
        "anomaly_score": int(prediction),
        "message": "Transaction analyzed by Agora-Link ML Engine"
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)
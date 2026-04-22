import pandas as pd
from sklearn.ensemble import IsolationForest
import pickle

def train():
    # Load data
    data = pd.read_csv('transactions.csv')
    
    # Initialize Model
    # contamination=0.05 means we expect 5% outliers
    model = IsolationForest(contamination=0.05, random_state=42)
    
    # Train model
    model.fit(data)
    
    # Save the 'Brain' to a file
    with open('compliance_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    print("ML Model 'compliance_model.pkl' trained and saved successfully.")

if __name__ == "__main__":
    train()
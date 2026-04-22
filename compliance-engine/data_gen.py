import pandas as pd
import numpy as np

def generate_data():
    np.random.seed(42)
    # Generate 1000 Normal Transactions
    normal_data = {
        'amount': np.random.normal(100, 50, 1000), # Avg $100
        'wallet_age_days': np.random.randint(30, 365, 1000), # Old wallets
        'freq_per_hour': np.random.randint(1, 3, 1000) # Low frequency
    }
    
    # Generate 50 Anomalous (Fraud) Transactions
    anomaly_data = {
        'amount': np.random.normal(5000, 1000, 50), # High amount spikes
        'wallet_age_days': np.random.randint(0, 2, 50), # Brand new wallets
        'freq_per_hour': np.random.randint(10, 50, 50) # Rapid-fire attempts
    }
    
    df_normal = pd.DataFrame(normal_data)
    df_anomaly = pd.DataFrame(anomaly_data)
    df = pd.concat([df_normal, df_anomaly])
    
    df.to_csv('transactions.csv', index=False)
    print("Dataset 'transactions.csv' created with 1050 samples.")

if __name__ == "__main__":
    generate_data()
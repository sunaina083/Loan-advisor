from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('audit_log.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            input_data TEXT,
            prediction TEXT,
            probability REAL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def log_prediction(input_data, prediction, probability):
    conn = sqlite3.connect('audit_log.db')
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO predictions (timestamp, input_data, prediction, probability) VALUES (?, ?, ?, ?)',
        (datetime.now().isoformat(), str(input_data), prediction, probability)
    )
    conn.commit()
    conn.close()

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = joblib.load('final_pipeline.pkl')

class LoanApplication(BaseModel):
    no_of_dependents: int
    education: int
    self_employed: int
    income_annum: float
    loan_amount: float
    loan_term: int
    cibil_score: int
    residential_assets_value: float
    commercial_assets_value: float
    luxury_assets_value: float
    bank_asset_value: float
    total_assets_value: float
    debt_to_income_ratio: float

@app.get("/")
def read_root():
    return {"message": "AI Loan Advisor API is running"}

@app.post("/predict")
def predict(application: LoanApplication):
    input_data = pd.DataFrame([application.model_dump()])
    prediction = pipeline.predict(input_data)[0]
    probability = pipeline.predict_proba(input_data)[0][1]
    result = "Approved" if prediction == 1 else "Rejected"
    log_prediction(application.model_dump(), result, float(probability))
    return {
        "prediction": result,
        "approval_probability": round(float(probability), 4)
    }
regressor = joblib.load('random_forest_regressor.pkl')
scaler_reg = joblib.load('scaler_reg.pkl')

class EligibilityApplication(BaseModel):
    no_of_dependents: int
    education: int
    self_employed: int
    income_annum: float
    loan_term: int
    cibil_score: int
    residential_assets_value: float
    commercial_assets_value: float
    luxury_assets_value: float
    bank_asset_value: float
    total_assets_value: float

@app.post("/eligibility")
def eligibility(application: EligibilityApplication):
    input_data = pd.DataFrame([application.model_dump()])
    input_data_scaled = scaler_reg.transform(input_data)
    predicted_amount = regressor.predict(input_data_scaled)[0]
    return {
        "eligible_loan_amount": round(float(predicted_amount), 2),
        "eligible_range_low": round(float(predicted_amount * 0.9), 2),
        "eligible_range_high": round(float(predicted_amount * 1.05), 2)
    }
import shap

explainer = shap.TreeExplainer(pipeline.named_steps['classifier'])

@app.post("/explain")
def explain(application: LoanApplication):
    input_data = pd.DataFrame([application.dict()])
    input_data_scaled = pipeline.named_steps['scaler'].transform(input_data)
    shap_values = explainer.shap_values(input_data_scaled)

    feature_names = input_data.columns.tolist()
    impacts = shap_values[0, :, 1]

    factors = []
    for name, impact in zip(feature_names, impacts):
        factors.append({"feature": name, "impact": round(float(impact), 4)})

    factors.sort(key=lambda x: abs(x["impact"]), reverse=True)

    return {"top_factors": factors[:5]}
class WhatIfRequest(BaseModel):
    application: LoanApplication
    feature_to_change: str
    new_value: float

@app.post("/whatif")
def whatif(request: WhatIfRequest):
    input_data = pd.DataFrame([request.application.dict()])
    input_data[request.feature_to_change] = request.new_value
    probability = pipeline.predict_proba(input_data)[0][1]
    prediction = pipeline.predict(input_data)[0]
    return {
        "prediction": "Approved" if prediction == 1 else "Rejected",
        "approval_probability": round(float(probability), 4)
    }
@app.get("/model-stats")
def model_stats():
    return {
        "models": [
            {"name": "Logistic Regression", "accuracy": 0.9145, "precision": 0.9584, "recall": 0.9030, "f1": 0.9299, "roc_auc": 0.9185},
            {"name": "KNN", "accuracy": 0.8770, "precision": 0.9499, "recall": 0.8489, "f1": 0.8966, "roc_auc": 0.8867},
            {"name": "Decision Tree", "accuracy": 0.9930, "precision": 0.9981, "recall": 0.9907, "f1": 0.9944, "roc_auc": 0.9938},
            {"name": "SVM", "accuracy": 0.9344, "precision": 0.9669, "recall": 0.9272, "f1": 0.9467, "roc_auc": 0.9369},
            {"name": "Naive Bayes", "accuracy": 0.9321, "precision": 0.9838, "recall": 0.9067, "f1": 0.9437, "roc_auc": 0.9408},
            {"name": "Random Forest", "accuracy": 0.9988, "precision": 0.9981, "recall": 1.0000, "f1": 0.9991, "roc_auc": 0.9984},
            {"name": "Gradient Boosting", "accuracy": 0.9977, "precision": 0.9981, "recall": 0.9981, "f1": 0.9981, "roc_auc": 0.9975}
        ],
        "final_model": "Random Forest (Tuned)"
    }

@app.get("/feature-importance")
def feature_importance():
    importances = pipeline.named_steps['classifier'].feature_importances_
    feature_names = pipeline.named_steps['classifier'].feature_names_in_.tolist() if hasattr(pipeline.named_steps['classifier'], 'feature_names_in_') else []
    
    if not feature_names:
        feature_names = ['no_of_dependents', 'education', 'self_employed', 'income_annum', 'loan_amount', 'loan_term', 'cibil_score', 'residential_assets_value', 'commercial_assets_value', 'luxury_assets_value', 'bank_asset_value', 'total_assets_value', 'debt_to_income_ratio']
    
    importance_data = [{"feature": name, "importance": round(float(imp), 4)} for name, imp in zip(feature_names, importances)]
    importance_data.sort(key=lambda x: x["importance"], reverse=True)
    
    return {"feature_importances": importance_data}
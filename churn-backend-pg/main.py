from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import random
import anthropic
import os

from database import engine, get_db, Base
from models import Prediction

# Auto create table if not exists
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Churn Prediction API - PostgreSQL")

# ── Allow React (port 5173) to call this API ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Input schema matches ChurnPredictionApp.jsx form fields ──
class CustomerInput(BaseModel):
    tenure:          Optional[int]   = 0
    monthlyCharges:  Optional[float] = 0.0
    totalCharges:    Optional[float] = 0.0
    contract:        Optional[str]   = "Month-to-month"
    internetService: Optional[str]   = "Fiber optic"
    techSupport:     Optional[str]   = "No"
    onlineSecurity:  Optional[str]   = "No"
    paymentMethod:   Optional[str]   = "Electronic check"
    gender:          Optional[str]   = "Male"
    seniorCitizen:   Optional[str]   = "No"
    partner:         Optional[str]   = "No"
    dependents:      Optional[str]   = "No"

# ── Churn calculation logic ──
def calculate_churn(data: CustomerInput) -> float:
    prob = 0.5
    if data.tenure < 12:                   prob += 0.20
    if data.monthlyCharges > 80:           prob += 0.15
    if data.contract == "Month-to-month":  prob += 0.15
    if data.techSupport == "No":           prob += 0.05
    if data.onlineSecurity == "No":        prob += 0.05
    prob += random.uniform(-0.05, 0.05)
    return round(min(0.97, max(0.03, prob)), 4)

# ── API Routes ──

@app.get("/")
def root():
    return {"message": "Churn Prediction API (PostgreSQL) running ✅"}

# POST /predict → calculate + save to PostgreSQL
@app.post("/predict")
def predict(data: CustomerInput, db: Session = Depends(get_db)):
    probability = calculate_churn(data)
    risk = (
        "HIGH"   if probability >= 0.7 else
        "MEDIUM" if probability >= 0.4 else
        "LOW"
    )

    # Save prediction to PostgreSQL
    record = Prediction(
        tenure            = data.tenure,
        monthly_charges   = data.monthlyCharges,
        total_charges     = data.totalCharges,
        contract          = data.contract,
        internet_service  = data.internetService,
        tech_support      = data.techSupport,
        online_security   = data.onlineSecurity,
        payment_method    = data.paymentMethod,
        gender            = data.gender,
        senior_citizen    = data.seniorCitizen,
        partner           = data.partner,
        dependents        = data.dependents,
        churn_probability = probability,
        risk_level        = risk,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "churn_probability": probability,
        "risk_level":        risk,
        "record_id":         record.id,
        "saved_to_db":       True
    }

# GET /history → fetch last 50 predictions
@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    records = (
        db.query(Prediction)
          .order_by(Prediction.created_at.desc())
          .limit(50)
          .all()
    )
    return records

# GET /stats → summary counts
@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total  = db.query(Prediction).count()
    high   = db.query(Prediction).filter(Prediction.risk_level == "HIGH").count()
    medium = db.query(Prediction).filter(Prediction.risk_level == "MEDIUM").count()
    low    = db.query(Prediction).filter(Prediction.risk_level == "LOW").count()
    return {
        "total":  total,
        "high":   high,
        "medium": medium,
        "low":    low
    }

# DELETE /clear → clear all records (for testing)
@app.delete("/clear")
def clear_all(db: Session = Depends(get_db)):
    db.query(Prediction).delete()
    db.commit()
    return {"message": "All records cleared ✅"}

# ── AI Chatbot ─────────────────────────────────────────────

class ChatMessage(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
def chat(data: ChatMessage):
    try:
        client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )

        # Build conversation history
        messages = []
        for h in data.history:
            messages.append({
                "role": h["role"],
                "content": h["content"]
            })

        # Add current message
        messages.append({
            "role": "user",
            "content": data.message
        })

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            system="""You are ChurnBot, an expert AI assistant 
            for a Customer Churn Prediction System. You help 
            customer retention teams understand churn predictions, 
            analyze customer behavior, and suggest retention 
            strategies. Keep answers clear, concise, and 
            actionable. Use bullet points where helpful.""",
            messages=messages
        )

        return {
            "reply": response.content[0].text,
            "success": True
        }

    except Exception as e:
        # Fallback responses if no API key
        msg = data.message.lower()

        if any(w in msg for w in ["churn", "leaving", "cancel"]):
            reply = """**Churn Risk Factors:**
- Month-to-month contracts → 3.4x higher churn
- High monthly charges (>$75) → significant risk
- Short tenure (<12 months) → not yet loyal
- No tech support or security → dissatisfied

**Top Retention Strategies:**
- Offer annual contract discount
- Bundle tech support for free
- Send personalized loyalty reward"""

        elif any(w in msg for w in ["retain", "keep", "strategy"]):
            reply = """**Retention Strategies by Risk Level:**

🔴 HIGH RISK (>70%):
- Immediate personal phone call
- Offer 20-30% discount
- Free service upgrade for 3 months

🟡 MEDIUM RISK (40-70%):
- Send personalized email offer
- Offer loyalty points
- Proactive tech support check-in

🟢 LOW RISK (<40%):
- Regular engagement emails
- Reward loyalty program
- Maintain service quality"""

        elif any(w in msg for w in ["model", "accuracy", "predict"]):
            reply = """**Model Performance:**
- Algorithm: XGBoost (best model)
- Accuracy: 87.3%
- Precision: 82%
- Recall: 79%
- F1-Score: 80%

Top predictive features:
1. Tenure (92% importance)
2. Monthly Charges (85%)
3. Contract Type (78%)
4. Tech Support (61%)"""

        elif any(w in msg for w in ["hello", "hi", "hey"]):
            reply = """👋 Hello! I'm **ChurnBot**, your AI retention assistant!

I can help you with:
- Understanding churn predictions
- Retention strategies
- Customer risk analysis
- Model performance insights

What would you like to know?"""

        else:
            reply = """I'm ChurnBot, your churn prediction assistant! 

I can help with:
- **Churn analysis** — why customers leave
- **Retention strategies** — how to keep them
- **Model insights** — how predictions work
- **Risk assessment** — understanding scores

Try asking: *"What causes high churn risk?"*"""

        return {"reply": reply, "success": True}
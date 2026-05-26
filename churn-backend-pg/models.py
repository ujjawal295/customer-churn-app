from sqlalchemy import Column, Integer, String, Float, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id                = Column(Integer, primary_key=True, index=True)
    tenure            = Column(Integer)
    monthly_charges   = Column(Float)
    total_charges     = Column(Float)
    contract          = Column(String(50))
    internet_service  = Column(String(50))
    tech_support      = Column(String(10))
    online_security   = Column(String(10))
    payment_method    = Column(String(50))
    gender            = Column(String(10))
    senior_citizen    = Column(String(5))
    partner           = Column(String(5))
    dependents        = Column(String(5))
    churn_probability = Column(Float)
    risk_level        = Column(String(20))
    created_at        = Column(
                            TIMESTAMP(timezone=True),
                            server_default=func.now()
                        )
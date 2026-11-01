import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field

# Load the trained model once, when the service starts
bundle = joblib.load("model.joblib")
model = bundle["model"]
features = bundle["features"]

app = FastAPI(title="AdaptIQ ML service")


class TopicStats(BaseModel):
    topic_accuracy: float = Field(ge=0, le=100)
    questions_answered: int = Field(ge=0)
    overall_accuracy: float = Field(ge=0, le=100)
    difficulty: int = Field(ge=1, le=3)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(stats: TopicStats):
    row = pd.DataFrame([stats.model_dump()])[features]
    probability = float(model.predict_proba(row)[0][1])

    if probability < 0.45:
        mastery = "weak"
    elif probability < 0.65:
        mastery = "developing"
    else:
        mastery = "strong"

    return {"probability_correct": round(probability, 3), "mastery": mastery}
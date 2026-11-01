import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("student_history.csv")

features = ["topic_accuracy", "questions_answered", "overall_accuracy", "difficulty"]
X = df[features]       # what the model sees
y = df["correct_next"]  # what it must predict (1 = correct, 0 = wrong)

# Keep 20% of the rows hidden. The model never trains on them,
# so scoring on them shows how it does on students it hasn't seen.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

models = {
    "Logistic Regression": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
    "Random Forest": RandomForestClassifier(n_estimators=200, max_depth=6, random_state=42),
}

best_name, best_model, best_auc = None, None, 0
for name, model in models.items():
    model.fit(X_train, y_train)
    predicted = model.predict(X_test)
    probability = model.predict_proba(X_test)[:, 1]  # chance of "correct"
    accuracy = accuracy_score(y_test, predicted)
    auc = roc_auc_score(y_test, probability)
    print(f"{name}: accuracy {accuracy:.2f}, AUC {auc:.2f}")
    if auc > best_auc:
        best_name, best_model, best_auc = name, model, auc

print("Best model:", best_name)

# Save the model and the exact feature order it expects
joblib.dump({"model": best_model, "features": features}, "model.joblib")
print("Saved model.joblib")
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)  # fixed seed, so you get the same data every run
N = 3000

difficulty = rng.integers(1, 4, N)            # 1 = easy, 2 = medium, 3 = hard
questions_answered = rng.integers(0, 31, N)   # how many questions seen on this topic
true_skill = rng.beta(2, 2, N)                # hidden real ability, 0 to 1

# What we can observe: accuracy so far is a noisy view of the hidden skill.
# The fewer questions answered, the noisier it is.
noise = rng.normal(0, 0.25 / np.sqrt(questions_answered + 1), N)
topic_accuracy = np.clip(true_skill + noise, 0, 1) * 100
topic_accuracy = np.where(questions_answered == 0, 50, topic_accuracy)  # unknown = 50

overall_accuracy = np.clip(0.7 * true_skill + 0.3 * rng.random(N), 0, 1) * 100

# Chance of a correct answer: higher skill helps, harder questions hurt
p_correct = 1 / (1 + np.exp(-(4 * (true_skill - 0.5) - 0.8 * (difficulty - 2))))
correct_next = (rng.random(N) < p_correct).astype(int)

df = pd.DataFrame(
    {
        "topic_accuracy": topic_accuracy.round(1),
        "questions_answered": questions_answered,
        "overall_accuracy": overall_accuracy.round(1),
        "difficulty": difficulty,
        "correct_next": correct_next,
    }
)

df.to_csv("student_history.csv", index=False)
print("Saved student_history.csv with", len(df), "rows")
print("Share of correct answers:", round(df["correct_next"].mean(), 2))
print(df.head())
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import classification_report
from sklearn.neural_network import MLPClassifier
from sklearn.multiclass import OneVsRestClassifier
import re
import nltk
from nltk.stem import WordNetLemmatizer
import joblib

nltk.download('wordnet')
nltk.download('omw-1.4')

lemmatizer = WordNetLemmatizer()

# ===== 1. Load dataset =====
df = pd.read_csv(r"books_dataset_clean.csv")
df.dropna(subset=["summary", "genre"], inplace=True)

# فرض: ژانرها به شکل "Fantasy|Adventure"
df["genre_list"] = df["genre"].apply(lambda x: [g.strip() for g in str(x).split("|")])

# ===== 2. حذف ژانرهای نادر =====
all_genres = pd.Series([g for sublist in df["genre_list"] for g in sublist])
valid_genres = all_genres.value_counts()[lambda x: x >= 50].index
df["genre_list"] = df["genre_list"].apply(lambda genres: [g for g in genres if g in valid_genres])
df = df[df["genre_list"].map(len) > 0]


# ===== 3. Clean summaries =====
def clean_text(text):
    text = re.sub(r"[^a-zA-Z]", " ", text.lower())
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if len(word) > 2]
    return " ".join(tokens)


df["summary_clean"] = df["summary"].astype(str).apply(clean_text)

# ===== 4. Features & Labels =====
X = df["summary_clean"]
mlb = MultiLabelBinarizer()
y = mlb.fit_transform(df["genre_list"])

# ===== 5. TF-IDF & Split =====
tfidf = TfidfVectorizer(stop_words="english", max_features=5000, min_df=2, max_df=0.95)
X_tfidf = tfidf.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)

# ===== 6. مدل =====
base_model = MLPClassifier(hidden_layer_sizes=(512, 256), activation='relu',
                           solver='adam', max_iter=200, random_state=42,
                           alpha=1e-4, early_stopping=True)
model = OneVsRestClassifier(base_model)

# ===== 7. آموزش =====
model.fit(X_train, y_train)

# ===== 8. ارزیابی =====
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=mlb.classes_))

# ===== 9. ذخیره مدل و ابزارها =====
joblib.dump(model, "book_genre_model.pkl")
joblib.dump(tfidf, "tfidf_vectorizer.pkl")
joblib.dump(mlb, "label_binarizer.pkl")

print("مدل و ابزارها ذخیره شدند.")


# ===== 10. پیش‌بینی با مدل ذخیره‌شده =====
def predict_top_genres(summary, top_n=3, threshold=0.3):
    model_loaded = joblib.load("book_genre_model.pkl")
    tfidf_loaded = joblib.load("tfidf_vectorizer.pkl")
    mlb_loaded = joblib.load("label_binarizer.pkl")

    clean = clean_text(summary)
    vec = tfidf_loaded.transform([clean])
    probs = model_loaded.predict_proba(vec)[0]
    top_indices = probs.argsort()[-top_n:][::-1]
    return [(mlb_loaded.classes_[i], round(probs[i] * 100, 2)) for i in top_indices if probs[i] >= threshold]


# Example
example_summary = "A young wizard attends a school for magic and must defeat a dark lord."
print(predict_top_genres(example_summary, top_n=3))
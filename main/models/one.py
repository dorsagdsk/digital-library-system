import pandas as pd
import re
import nltk

from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag, word_tokenize
from sklearn.preprocessing import LabelEncoder

# دانلود داده‌های NLTK
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('punkt_tab')
# ===== 1. خواندن دیتاست =====
df = pd.read_csv("data.csv")  # مسیر CSV خودت رو بذار

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# ===== 2. نگاشت POS Tag برای Lemmatization =====
def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return 'a'  # adjective
    elif tag.startswith('V'):
        return 'v'  # verb
    elif tag.startswith('N'):
        return 'n'  # noun
    elif tag.startswith('R'):
        return 'r'  # adverb
    else:
        return 'n'

# ===== 3. تابع پاکسازی متن =====
def clean_text(text):
    # حذف HTML
    text = BeautifulSoup(str(text), "html.parser").get_text()

    # حذف هرچیزی جز حروف
    text = re.sub(r"[^a-zA-Z\s]", " ", text)

    # حروف کوچک
    text = text.lower()

    # حذف فاصله‌های اضافی
    text = re.sub(r"\s+", " ", text).strip()

    # حذف تکرار حروف (مثلاً coooool -> cool)
    text = re.sub(r'(.)\1{2,}', r'\1\1', text)

    # توکن‌سازی
    words = word_tokenize(text)

    # حذف کلمات کوتاه و استاپ‌ورد
    words = [w for w in words if w not in stop_words and len(w) > 2]

    # POS tagging + Lemmatization دقیق
    pos_tags = pos_tag(words)
    words = [lemmatizer.lemmatize(w, get_wordnet_pos(tag)) for w, tag in pos_tags]

    return " ".join(words)

# ===== 4. اعمال پاکسازی =====
df["clean_summary"] = df["summary"].apply(clean_text)

# ===== 5. کوتاه‌سازی متن (200 کلمه) =====
def truncate_text(text, max_words=200):
    words = text.split()
    return " ".join(words[:max_words])

df["clean_summary"] = df["clean_summary"].apply(lambda x: truncate_text(x, 200))

# ===== 6. حذف ردیف‌های با خلاصه خیلی کوتاه =====
df = df[df["clean_summary"].str.split().str.len() > 5]

# ===== 7. برچسب‌گذاری ژانر =====
label_encoder = LabelEncoder()
df["genre_label"] = label_encoder.fit_transform(df["genre"])

# ===== 8. ذخیره خروجی =====
df.to_csv("books_dataset_clean.csv", index=False)

print("✅ پیش‌پردازش پیشرفته کامل شد! فایل books_dataset_clean.csv ذخیره شد.")
print(df.head())


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
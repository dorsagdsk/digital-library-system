import re
from nltk.stem import WordNetLemmatizer

# این خطوط را برای استفاده از Lemmatizer نیاز دارید
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = re.sub(r"[^a-zA-Z]", " ", text.lower())
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if len(word) > 2]
    return " ".join(tokens)
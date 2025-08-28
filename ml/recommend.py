# recommend.py
import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 절대 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CARDS_PATH = os.path.join(BASE_DIR, "../data/cards.json")
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "embeddings.npy")

# 데이터 로드
with open(CARDS_PATH, "r", encoding="utf-8") as f:
    cards = json.load(f)

embeddings = np.load(EMBEDDINGS_PATH, allow_pickle=True)

# 모델 초기화
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def recommend_card(query: str, top_k: int = 3):
    """주어진 query와 가장 유사한 카드 추천"""
    query_emb = model.encode([query])
    sims = cosine_similarity(query_emb, embeddings)[0]
    top_indices = sims.argsort()[::-1][:top_k]
    return [cards[i] for i in top_indices]

if __name__ == "__main__":
    import sys
    query = sys.argv[1] if len(sys.argv) > 1 else ""
    recs = recommend_card(query)
    # JSON 문자열로 출력
    import json
    print(json.dumps(recs, ensure_ascii=False))


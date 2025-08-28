from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

# 절대 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../data/cards.json")
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "../data/embeddings.npy")

# FastAPI 앱 생성
app = FastAPI()

# CORS 허용 (프론트엔드 테스트용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 카드 데이터 로드
with open(DATA_PATH, "r", encoding="utf-8") as f:
    cards = json.load(f)

# 임베딩 로드 (allow_pickle=True)
embeddings = np.load(EMBEDDINGS_PATH, allow_pickle=True)

# 추천 모델 준비 (SentenceTransformer)
model = SentenceTransformer('all-MiniLM-L6-v2')

# 추천 함수
def recommend(card_index: int, top_k: int = 3):
    # 선택 카드 임베딩
    card_emb = embeddings[card_index].reshape(1, -1)
    # 코사인 유사도 계산
    sims = cosine_similarity(card_emb, embeddings)[0]
    # 자기 자신 제외, 상위 top_k
    sims[card_index] = -1
    top_indices = sims.argsort()[::-1][:top_k]
    return [cards[i] for i in top_indices]

# API 엔드포인트
@app.get("/recommend/{card_index}")
def get_recommendations(card_index: int, top_k: int = 3):
    if card_index < 0 or card_index >= len(cards):
        return {"error": "Invalid card_index"}
    recs = recommend(card_index, top_k)
    return {"recommendations": recs}

@app.get("/cards")
def get_all_cards():
    return {"cards": cards}


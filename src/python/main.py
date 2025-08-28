
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from scipy.sparse import coo_matrix, csr_matrix
from implicit.als import AlternatingLeastSquares
from sqlalchemy import create_engine

# .env 파일 로드
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# SQLAlchemy로 MySQL 연결
engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")



app = FastAPI()

# 허용할 origin 설정
origins = [
    os.getenv("FRONTEND_APP_URL"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # 허용할 origin
    allow_credentials=True,         # 쿠키 인증 허용 여부
    allow_methods=["*"],            # 허용할 HTTP 메서드 (GET, POST 등)
    allow_headers=["*"],            # 허용할 HTTP 헤더
)

query="""
SELECT * FROM likes
"""

data = pd.read_sql(query,engine)

df=data[['userId','itemId']]
# 모든 회원의 좋아요한 상품 정보를 추출

user_en=LabelEncoder()
item_en=LabelEncoder()

df['user_id_enc']=user_en.fit_transform(df['userId'])
df["item_id_enc"]=item_en.fit_transform(df['itemId'])
# 회원, 상품 id 인코딩

matrix = csr_matrix(
    (np.ones(len(df)), (df["user_id_enc"], df["item_id_enc"]))
)


model = AlternatingLeastSquares(factors=10, iterations = 50) 
# 반복 학습 50회: 데이터 규모에 따라 유동적으로 변경하여 최적해 도출 (과적합 우려)

model.fit(matrix)



@app.get("/recommend")
def recommend(user_id: int = Query(..., description="원본 user_id 입력"), top_n: int = 10):
    if user_id not in df['userId'].values:
        # 유저가 존재하지 않는 경우
        raise HTTPException(status_code=404, detail="해당 user_id는 데이터에 없습니다.")
    
    user_idx=user_en.transform([user_id])
    user_v = csr_matrix(matrix[user_idx])

    # 학습된 데이터와 해당 유저가 좋아요한 상품 목록을 대조하여 유사도가 높은 상품id 상위 10개를 출력
    item_indices , scores = model.recommend(
        userid = user_idx[0],
        user_items=user_v,
        N=top_n,
    )

    item_de = item_en.inverse_transform(item_indices) # 결과값 디코딩

    res = [{'item':int(item_id), 'score':float(score)}
           for item_id, score in zip (item_de, scores)]
    
    return res 




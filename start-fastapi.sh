#!/bin/bash
cd fastapi_backend
# 데이터베이스 URL 환경변수가 이미 설정되어 있음을 확인
echo "Using DATABASE_URL: ${DATABASE_URL}"
# FastAPI 앱 실행
python main.py
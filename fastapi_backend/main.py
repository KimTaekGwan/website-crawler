import uvicorn

if __name__ == "__main__":
    # 개발 서버 실행
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
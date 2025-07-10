FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
EXPOSE 8501
COPY . .
CMD ["streamlit", "run", "app.py"]
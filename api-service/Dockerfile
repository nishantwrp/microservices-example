FROM python:3.8.10

WORKDIR /app
COPY . .

RUN pip3 install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

ENTRYPOINT ["uvicorn", "app:app", "--host", "0.0.0.0"]

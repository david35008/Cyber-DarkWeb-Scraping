FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

WORKDIR /app/server-python

ADD ./requirements.txt ./
RUN pip install -U pip
RUN pip install -U -r ./requirements.txt

ADD ./wait_for_it.sh ./
RUN chmod +x /app/server-python/wait_for_it.sh
EXPOSE 80

COPY . .

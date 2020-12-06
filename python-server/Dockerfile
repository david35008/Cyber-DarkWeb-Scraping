FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

WORKDIR /app/python-server

ADD ./requirements.txt ./
RUN pip install -U pip
RUN pip install -U -r ./requirements.txt

ADD ./wait_for_it.sh ./
RUN chmod +x /app/python-server/wait_for_it.sh
EXPOSE 80

COPY . .

FROM python:3.9-slim
WORKDIR /app

RUN /usr/local/bin/python -m pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000
CMD [ "python",  "./server.py" ]

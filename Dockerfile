FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN corepack enable && yarn install

RUN yarn global add tsx nodemon

COPY . .

RUN chmod +x scripts/docker-entrypoint.sh

EXPOSE 3000

CMD ["./scripts/docker-entrypoint.sh"]
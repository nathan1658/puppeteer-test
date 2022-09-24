FROM node:16

ENV IS_DOCKER=true
# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*F

WORKDIR /usr/src/app
COPY package.json .
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build
EXPOSE 3000

CMD ["node", "./dist/server.js"]

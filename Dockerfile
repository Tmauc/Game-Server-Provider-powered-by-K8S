FROM node:latest

WORKDIR /app

COPY package.json /app

COPY --from=lachlanevenson/k8s-kubectl:latest /usr/local/bin/kubectl /usr/local/bin/kubectl

RUN npm install

COPY . /app

CMD ["npm", "start"]

EXPOSE 443
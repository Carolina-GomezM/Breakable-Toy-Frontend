FROM node:19-alpine
WORKDIR /Frontend
ENV PATH /Frontend/node_modules/.bin:$PATH
COPY package.json .
COPY package-lock.json .
RUN npm install # -g npm@9.0.0
COPY . .
EXPOSE 5173:80
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]
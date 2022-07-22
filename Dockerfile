FROM node:14-alpine

WORKDIR /homosexual

COPY package.json yarn.lock ./

COPY /src/pages /homosexual/

COPY . /homosexual/

RUN yarn

RUN yarn build

COPY . /homosexual/

EXPOSE 3000

CMD ["yarn", "private"]
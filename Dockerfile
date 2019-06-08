FROM node:10-alpine

ENV HOME=/home/node/app

RUN mkdir -p $HOME/node_modules && chown -R node:node $HOME

WORKDIR $HOME

COPY package*.json ./ 

COPY src/ ./src/

USER node

RUN npm install --silent --progress=false --production

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "./server.sh" ]

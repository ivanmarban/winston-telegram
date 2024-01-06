ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
COPY . .
RUN npm install && \
  echo $'#!/bin/sh\n\
  sed -i "s/TELEGRAM_TOKEN/$TELEGRAM_TOKEN/g" /app/examples/*\n\
  sed -i "s/CHAT_ID_1/$CHAT_ID/g" /app/examples/*\n\
  sed -i "s/CHAT_ID_2/$CHAT_ID/g" /app/examples/*\n\
  sed -i "s/CHAT_ID/$CHAT_ID/g" /app/examples/*\n\
  files=$(find /app/examples -type f)\n\
  for i in $files\n\
  do\n\
    echo "running example: $i"\n\
    node $i\n\
    sleep 5\n\
  done'\
  >> /app/start.sh && \
  chmod +x /app/start.sh
CMD ["/bin/sh", "/app/start.sh"]

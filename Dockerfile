FROM mhart/alpine-node:6
WORKDIR /app
COPY . .
RUN npm install
RUN echo $'#!/bin/sh\n\
sed -i "s/TELEGRAM_TOKEN/$TELEGRAM_TOKEN/g" /app/examples/*\n\
sed -i "s/CHAT_ID_1/$CHAT_ID/g" /app/examples/*\n\
sed -i "s/CHAT_ID_2/$CHAT_ID/g" /app/examples/*\n\
sed -i "s/CHAT_ID/$CHAT_ID/g" /app/examples/*\n\
files=$(find /app/examples -type f)\n\
for i in $files\n\
do\n\
  node $i\n\
  sleep 5\n\
done'\
>> /app/start.sh
RUN chmod +x /app/start.sh
CMD ["/bin/sh", "/app/start.sh"]

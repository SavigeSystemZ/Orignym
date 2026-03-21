#!/bin/bash
cd /home/whyte/.MyAppZ/Orignym
docker-compose up -d
npm start &
sleep 5
xdg-open http://localhost:10941
wait

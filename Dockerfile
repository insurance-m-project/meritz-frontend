FROM node:21.4.0
WORKDIR /
COPY meritz/package.json .
RUN npm install
COPY meritz/ .
EXPOSE 4000
CMD ["npm", "start"]

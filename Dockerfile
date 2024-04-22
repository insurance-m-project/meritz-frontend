FROM node:21.4.0
WORKDIR /
COPY meritz/package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
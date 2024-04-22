FROM node:21.4.0
WORKDIR /meritz
COPY package.json mertiz
RUN npm install
COPY . meritz
EXPOSE 4000
CMD ["npm", "start"]
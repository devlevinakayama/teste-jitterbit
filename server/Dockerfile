# Imagem oficial do Node.js
FROM node:18

# Pasta de trabalho
WORKDIR /app

# Copiando o arquivo package.json para a pasta de trabalho
COPY package*.json ./

# Permitindo criar arquivos na pasta de cache
RUN chmod a+rwx cache

# Expõe a porta 3000
EXPOSE 3000

# Inicia a aplicação
CMD bash -c "npm install && node index.js"
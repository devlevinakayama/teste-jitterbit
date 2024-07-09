# Imagem oficial do Node.js
FROM node:18

# Pasta de trabalho
WORKDIR /app

# Copiando o arquivo package.json para a pasta de trabalho
COPY package*.json ./

# Instalando as dependências do projeto
RUN npm install

# Copiando o restante dos arquivos para a pasta de trabalho
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Inicia a aplicação
CMD ["node", "index.js"]
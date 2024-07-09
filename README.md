# Nome do Projeto
Teste Jitterbit

## Requisitos
- Node v18
- Docker
- Docker Compose v3+

## Instalaçao 

1. Clone o repositório
2. Acesse a pasta do projeto
3. Rode o comando ```docker-compose build```
4. Depois rode o comando ```docker-compose up```

## Observações
1. O docker irá subir os 2 testes, backend (com banco) e front (apenas o html)
2. Tenha certeza que as portas 3000, 3001 e 5432 do banco estejam disponíveis, caso não troque de acordo com a necessidade.

## Como acessar ?
- Para testar o backend, existe um collection na pasta server que aponta para **http://localhost:3000** que pode ser usado para tetar os endpoints
- Para testar o front, basta acessar **http://localhost:3001**
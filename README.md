# To do list

Aplicativo criado para colocar em prática meu conhecimento em backend, frontend, banco de dados e infraestrutura.

Na pasta frontend está a aplicação construida com Vite + React/Typescript.

Na pasta backend está a aplicação construida com Javascript/Express.

Na pasta vídeo contém o deploy da AWS mostrando a aplicação funcionando.

## Instruções frontend

Para rodar localmente o frontend:
1-> cd frontend
2-> npm i
3-> npm run dev
4-> Abrir no navegador 'localhost:5473'

## Instruções backend

### Configurar .env
Para configurar o backend é necessário criar um arquivo .env com as seguintes características:
RDS_HOSTNAME=
RDS_PORT=
RDS_DB_NAME=
RDS_USERNAME=
RDS_PASSWORD=

### Criar tabelas do banco de dados
Para criar o banco de dados através do SQL é necessário rodar os seguintes comandos:
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('todo', 'doing', 'done')) NOT NULL,
    user_id INT REFERENCES "user" (id)
);

### Executar aplicação
Para rodar localmente o backend:
1-> cmd: cd backend
2-> cmd: npm i
3-> cmd: npm run dev
4-> Checar status no cmd: server is running 'Server is running on port 8000.'
5-> Checar status no cmd: connecting to database

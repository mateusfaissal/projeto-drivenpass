# DrivenPass - Gerenciador de Senhas

## Introdução

Navegar na internet pode ser muito divertido e informativo, mas também vem com riscos de segurança. O aumento dos golpes virtuais nos lembra da necessidade de proteger nossas informações pessoais. Uma das melhores práticas de segurança é o uso de senhas diferentes e complexas para cada serviço. O DrivenPass é um gerenciador de senhas projetado para ajudar a gerenciar suas senhas com segurança, permitindo que você mantenha senhas únicas e fortes para todos os seus serviços sem a necessidade de memorizá-las todas.

## Funcionalidades

- Criação segura de login com e-mail e senha mestra.
- Login e autenticação de usuários.
- Visualização segura da lista de todas as senhas armazenadas.
- Criação, deleção e armazenamento seguro de registros de senhas em várias categorias.
- Acesso seguro aos registros de senhas a qualquer momento.
- Logout seguro e retorno à tela inicial.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript do lado do servidor.
- **TypeScript**: Superset de JavaScript que adiciona tipos estáticos.
- **Express**: Framework para Node.js que fornece recursos de roteamento e middleware.
- **Prisma ORM**: ORM para TypeScript e JavaScript para interação com o banco de dados PostgreSQL.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.

## Segurança

- **Autenticação**: Uso de JWT (JSON Web Tokens) para autenticação e proteção das rotas da API.
- **Hash de Senha**: A senha do usuário é protegida com `bcrypt`, assegurando que mesmo as senhas mestras não sejam armazenadas em texto puro.
- **Criptografia de Dados**: Utilizamos `cryptr` para a criptografia de dados sensíveis armazenados, com uma chave de criptografia definida como variável de ambiente.

## Configuração do Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento e executar o projeto localmente.

### Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em seu sistema:
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) 
- [PostgreSQL](https://www.postgresql.org/)

Além disso, você deverá ter uma instância do PostgreSQL rodando localmente ou em um servidor remoto.

### Instalação

1. Clone o repositório
   ```sh
   git clone https://github.com/mateusfaissal/projeto-drivenpass.git
2. Entre no diretório do projeto
   ```sh
   cd projeto-drivenpass
3. Instale as dependências do projeto
   ```sh
   npm install
4. Configuração das Variáveis de Ambiente

    Copie o arquivo .env.example para um novo arquivo chamado .env e preencha com suas próprias variáveis de ambiente. 
    ```bash
    JWT_SECRET=your_jwt_secret_here
    DATABASE_URL=your_database_url_here
5. Configuração do Banco de Dados

    Utilize o Prisma ORM para configurar o banco de dados. Execute as migrações para criar as tabelas necessárias:
    ```sh
    npx prisma migrate dev
6. Executando o projeto
    ```sh
    npm run dev

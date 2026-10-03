# HelpDesk - Sistema de Chamados

Sistema simples de atendimento interno de uma empresa. Os funcionários registram chamados quando precisam de suporte (computador que não liga, impressora sem papel, acesso bloqueado etc.) e acompanham a situação de cada um.

## Funcionalidades

- Cadastrar, listar, visualizar, editar e excluir chamados (CRUD completo)
- Dashboard com o total de chamados e as quantidades de abertos, em atendimento e resolvidos
- Pesquisa de chamados pelo título
- Filtros por setor, prioridade e status (podem ser usados juntos com a pesquisa)
- Alteração do status do chamado: Aberto, Em atendimento, Resolvido ou Cancelado
- Confirmação antes de excluir
- Mensagens de sucesso e de erro após cada operação

## Tecnologias

- **Banco de dados:** MySQL
- **Backend:** Node.js, Express, mysql2, cors e dotenv
- **Frontend:** HTML, CSS, JavaScript e Axios

## Estrutura

```
HelpDesk
├── backend
│   ├── db.sql
│   ├── package.json
│   └── src
│       ├── server.js
│       ├── config/db.js
│       ├── models/chamadoModel.js
│       ├── controllers/chamadoController.js
│       └── routes/chamadoRoutes.js
└── frontend
    ├── index.html
    ├── style.css
    └── script.js
```

## Banco de dados

Banco `helpdesk_db`, com a tabela `chamados`:

| Campo      | Descrição                                                              |
|------------|------------------------------------------------------------------------|
| id         | Identificação automática do chamado                                    |
| titulo     | Resumo do problema                                                     |
| setor      | TI, Financeiro, RH, Administrativo, Comercial ou Produção              |
| prioridade | Alta, Média ou Baixa                                                   |
| status     | Aberto (padrão), Em atendimento, Resolvido ou Cancelado                |

## Endpoints da API

| Método | Rota              | Descrição         |
|--------|-------------------|-------------------|
| POST   | /api/chamados     | Cria um chamado   |
| GET    | /api/chamados     | Lista os chamados |
| GET    | /api/chamados/:id | Busca um chamado  |
| PUT    | /api/chamados/:id | Altera um chamado |
| DELETE | /api/chamados/:id | Exclui um chamado |

## Pesquisa e filtros

A pesquisa por título e os filtros de setor, prioridade e status são feitos no frontend, sobre a lista de chamados que já foi carregada da API (`GET /api/chamados`). Por isso, não precisam de endpoints novos.

## Como executar

1. Execute o arquivo `backend/db.sql` no MySQL (pelo DBeaver, por exemplo) para criar o banco `helpdesk_db` e a tabela `chamados`.
2. Na pasta `backend`, instale as dependências e inicie a API:
   ```bash
   npm install
   npm run dev
   ```
3. Abra o arquivo `frontend/index.html` no navegador.

A API roda em `http://localhost:3000`. Se o seu MySQL usar outro usuário ou senha, crie um arquivo `.env` na pasta `backend` com `DB_HOST`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.

## Autor

Giovany Wittlich © 2026

# Registro de Ocorrências

Projeto desenvolvido na disciplina de Frameworks Front-end do curso superior de
Análise e Desenvolvimento de Sistemas.

Aplicação em Vue 3 que simula um livro de ocorrências: o usuário registra uma
descrição e ela é adicionada a uma lista com número de protocolo e horário. O
estado é gerenciado com Pinia.

## Tecnologias

- Vue 3 (`<script setup>`)
- Pinia
- Vite

## Como executar

```sh
npm install
npm run dev
```

Build de produção:

```sh
npm run build
```

## Estrutura

- `src/App.vue` — interface e lógica de registro
- `src/stores/ocorrencias.js` — store Pinia com a lista de ocorrências
- `src/main.js` — inicialização do app e do Pinia

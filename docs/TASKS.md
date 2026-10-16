# Tarefas de Implementação — Projeto 2 (Performance Dashboard)

- [x] **Tarefa 1: Setup do Projeto e Estrutura Base**
  - Inicializar projeto Vite com React + TypeScript e Tailwind CSS.
  - Instalar dependências: `react-hook-form`, `zod`, `@hookform/resolvers`, `@tanstack/react-query`, `@tanstack/react-virtual`.
  - Configurar layout base com abas para navegação entre os experimentos.

- [x] **Tarefa 2: O Desafio do Formulário Pesado (useState vs. react-hook-form + Zod)**
  - Implementar o formulário com 25+ campos paramétricos.
  - Criar componente de contador de renderizações (`RenderCounter`).
  - Implementar o switch entre Modo Controlado (`useState`) e Modo Otimizado (`react-hook-form` + Zod schema).

- [x] **Tarefa 3: Concorrência no React 18 e Virtualização de Tabela**
  - Gerar mock de 2.500 registros de estudos urbanísticos.
  - Implementar a tabela sem virtualização vs. tabela com `@tanstack/react-virtual`.
  - Integrar filtro de texto com `useTransition` exibindo spinner/feedback durante o processamento em background.

- [x] **Tarefa 4: Mitigação de Race Condition com AbortController**
  - Criar serviço simulado de API com latência configurável.
  - Criar componente demonstrando a falha de requisições fora de ordem.
  - Implementar a correção usando `AbortController` com `signal` no cleanup do `useEffect`.

- [x] **Tarefa 5: Server State & Ciclo de Cache com TanStack Query**
  - Envolver a aplicação com `QueryClientProvider`.
  - Implementar queries com `staleTime` de 1 minuto e mutação com invalidação de cache declarativa.

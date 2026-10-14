# PRD — Projeto 2: Dashboard Paramétrico de Alta Performance (React Sênior)

## 1. Visão Geral
Construir uma aplicação React + TypeScript de alta fidelidade simulando o painel de viabilidade urbanística do ArqLab. A aplicação deve demonstrar, por meio de código e métricas visuais na tela, a diferença prática entre abordagens ingênuas (que causam gargalos de CPU, re-renders em cascata e condições de corrida) e as soluções arquiteturais de nível sênior.

## 2. Escopo e Requisitos Funcionais

### RF01: Formulário Paramétrico de Zoneamento (Controlado vs. Não-Controlado)
- O formulário deve conter mais de 25 campos de parâmetros urbanísticos (recuo frontal, recuo lateral, gabarito, coeficiente de aproveitamento, taxa de ocupação, vagas por tipologia, etc.).
- **Modo A (Ingênuo):** Formulário controlado via `useState` único na raiz, demonstrando o re-render de toda a árvore a cada tecla digitada (com contador visual de renders).
- **Modo B (Sênior):** Formulário não-controlado utilizando `react-hook-form` integrado a schema de validação estrito em tempo de execução com **Zod**, mantendo a digitação a 60 FPS sem disparar re-renders desnecessários.

### RF02: Tabela de Cenários Densos & Virtualização
- Simulação de uma base com 2.500 tipologias e cenários de implantação gerados.
- **Modo A (Sem virtualização):** Renderização direta de todas as linhas no DOM, demonstrando lentidão de rolagem e estouro de nós no DOM.
- **Modo B (Com virtualização):** Renderização utilizando `@tanstack/react-virtual`, mantendo apenas os elementos visíveis na viewport ativos no DOM.

### RF03: Concorrência e Filtragem Pesada (React 18 Transitions)
- Barra de busca/filtro instantâneo sobre a lista de cenários.
- Implementar o padrão com `useTransition` / `useDeferredValue`: a digitação do input deve ter prioridade máxima e resposta imediata, enquanto o recálculo/filtragem da lista densa roda em segundo plano com indicador visual (`isPending`).

### RF04: Resiliência contra Condições de Corrida (Race Conditions)
- Simulação de busca assíncrona de detalhes de diferentes terrenos (Terreno A com latência simulada de 2s e Terreno B com latência de 500ms).
- Demonstrar o bug de resposta fora de ordem sobrescrevendo dados recentes.
- Implementar a correção obrigatória utilizando **`AbortController`** na função de cleanup do hook para cancelar requisições em voo.

### RF05: Separação de Estados & Server State com TanStack Query
- Configurar o **TanStack Query (React Query)** para consumir e cachear a lista de projetos e estudos.
- Demonstrar `staleTime`, revalidação em segundo plano e invalidação declarativa (`queryClient.invalidateQueries`) após salvar novos parâmetros.

## 3. Requisitos Não Funcionais
- **Stack:** React 18+, TypeScript (strict mode), Vite, Tailwind CSS (ou CSS limpo), `react-hook-form`, `zod`, `@tanstack/react-query`, `@tanstack/react-virtual`.
- **Métricas:** Incluir contadores visuais de renderização simples nos componentes para comprovar visualmente a redução drástica de re-renders.
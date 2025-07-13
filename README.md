# 🚀 Vizeval - Plataforma de Avaliação de IA

> **Visualize e avalie seus workflows de IA com evaluators especializados**

🌐 **Acesse a plataforma**: [app.vizeval.com](https://app.vizeval.com)

Este projeto foi desenvolvido para o **Hackathon da Adapta** e representa nossa visão ideal da plataforma Vizeval - uma solução completa para monitoramento, avaliação e análise de sistemas de IA em diferentes domínios de conhecimento.

## 🎯 Sobre o Projeto

O Vizeval é uma plataforma que permite visualizar e avaliar workflows de IA através de evaluators especializados. Nossa solução oferece insights detalhados sobre a performance de modelos de linguagem em diferentes contextos, com **foco inicial em medicina** devido à criticidade e complexidade da área da saúde. Planejamos expandir para outras áreas críticas como direito e educação.

## ✨ Funcionalidades

### 📊 Dashboard

- Visão geral dos workflows de IA
- Métricas de performance em tempo real
- Gráficos interativos com análise de tendências
- Cards com estatísticas principais

### 📋 Requests

- Monitoramento de todas as requisições
- Análise detalhada de latência e performance
- Histórico completo de interações
- Filtros avançados por modelo, evaluator e score

### 🤖 Evaluators

Evaluators especializados por área de conhecimento:

- **🏥 Medical**: Avaliação de conteúdo médico, diagnósticos e protocolos de saúde _(Foco inicial - Disponível)_
- **⚖️ Legal**: Análise de documentos legais e conformidade regulatória _(Planejado para futuro)_
- **📚 Education**: Avaliação de conteúdo educacional e materiais curriculares _(Planejado para futuro)_

> **🎯 Foco Inicial**: Começamos com o evaluator médico devido à criticidade e complexidade da área da saúde. Os evaluators para outras áreas estão em nosso roadmap de desenvolvimento.

### 🔑 API Keys

- Gerenciamento seguro de chaves de API
- Controle de acesso granular
- Monitoramento de uso por chave

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 15.3.5** - Framework React para produção
- **React 19** - Biblioteca de interface do usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface modernos

### Componentes e UI

- **Radix UI** - Primitivos de interface acessíveis
- **Tabler Icons** - Ícones modernos e consistentes
- **Recharts** - Gráficos e visualizações interativas
- **Lucide React** - Ícones adicionais

### Ferramentas e Utilidades

- **TanStack Table** - Tabelas avançadas e performáticas
- **DND Kit** - Funcionalidades de drag-and-drop
- **Sonner** - Notificações elegantes
- **Zod** - Validação de esquemas

## 🚀 Como Usar

### 💻 Instalação Local

#### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

#### Instalação

```bash
# Clone o repositório
git clone git@github.com:vizeval/platform.git
cd platform

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

#### Execução

```bash
# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

#### Build para Produção

```bash
# Build do projeto
npm run build
npm run start

# ou
yarn build
yarn start
```

## 📚 Estrutura do Projeto

```
platform/
├── src/
│   ├── app/                 # Páginas da aplicação (App Router)
│   │   ├── api-keys/       # Gerenciamento de API Keys
│   │   ├── evaluators/     # Evaluators especializados
│   │   ├── requests/       # Monitoramento de requisições
│   │   └── page.tsx        # Dashboard principal
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base do shadcn/ui
│   │   └── ...            # Componentes específicos
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Utilitários e configurações
│   └── mocks/             # Dados mockados para demonstração
├── public/                # Arquivos estáticos
└── ...                   # Configurações do projeto
```

## 🔗 Recursos Adicionais

### API + SDK dos Evaluators

O valor principal da nossa solução está na **API e SDK dos evaluators**, que permite:

- Integração fácil com sistemas existentes
- Evaluator médico especializado (foco inicial)
- Análise avançada de conteúdo médico
- Métricas detalhadas de qualidade para área da saúde
- Expansão futura para outras áreas críticas

**🚧 Repositório da API + SDK**: [https://github.com/orgs/vizeval/repositories](https://github.com/orgs/vizeval/repositories)

---

**Desenvolvido com ❤️ para o Hackathon da Adapta**

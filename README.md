# Angular Application

Aplicação Angular para adoção de pets com interface responsiva e dashboard administrativo. O painel admin permite gerenciar adoções, controlar pets cadastrados e ter visão geral das operações do sistema.

## Sobre

Plataforma de adoção de pets com navegação, filtros, gerenciamento de usuários e painel administrativo. Desenvolvida com Angular 19.2.15 e API personalizada em Python FastAPI.

## Dashboard Administrativo

O painel administrativo oferece controle total sobre a plataforma:

### Gerenciamento de Adoções
- **Lista completa de adoções** realizadas no sistema
- **Filtros por status** (pendente, aprovada, rejeitada)
- **Busca por pet** ou usuário que fez a adoção
- **Detalhes completos** de cada processo de adoção
- **Dados do interessado** - visualização completa dos dados de quem pretende adotar
- **Contato direto** - botões para WhatsApp e email do interessado
- **Controle de status** das adoções pendentes

### Dashboard Principal
- **Visão geral** das adoções em andamento
- **Contadores básicos** de pets e adoções
- **Navegação intuitiva** entre as funcionalidades

### Controle de Pets
- **Visualização completa** de todos os pets cadastrados
- **Busca avançada** por nome, cidade, sexo
- **Gerenciamento de informações** dos pets
- **Controle de disponibilidade** para adoção

## Principais Funcionalidades

### Recursos Públicos
- **Navegação de Pets**: Listagem de pets com filtros, ordenação e capacidades de busca
- **Detalhes do Pet**: Informações abrangentes do pet com galerias de fotos e detalhes de adoção
- **Processo de Adoção**: Formulário completo para interessados em adotar
- **Contato Direto**: Botões para WhatsApp e email para facilitar comunicação
- **Sistema de FAQ**: Seção abrangente de ajuda e suporte

### Recursos Administrativos
- **Painel de Controle**: Operações CRUD completas para listagens de pets

### Recursos Técnicos
- **Otimização de Performance**: Lazy loading, divisão de código e otimização de bundle
- **Tratamento de Erros**: Gerenciamento de erros com páginas personalizadas (404, 500)
- **Design Responsivo**: Interface adaptável para mobile, tablet e desktop

## Arquitetura

### Estrutura Modular
- **Lazy Loading**: Módulos carregados sob demanda (home, pets, store, admin, auth, errors)
- **Layouts Separados**: MainLayout (público) e AuthLayout (admin)
- **Guards de Rota**: Proteção de rotas administrativas
- **Interceptadores HTTP**: Tratamento global de erros e loading

### Padrões Implementados
- **Services Pattern**: Serviços centralizados para lógica de negócio
- **Component Communication**: Input/Output e Services para comunicação
- **Reactive Forms**: Formulários com validação reativa
- **Error Handling**: Páginas de erro personalizadas (404, 500)

### Stack Técnico
- **Framework**: Angular 19.2.15
- **UI Library**: Angular Material
- **Styling**: SCSS com design system personalizado
- **State Management**: RxJS Observables e Services
- **API Integration**: HTTP Client com interceptadores
- **Routing**: RouterModule com lazy loading

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── config/               # Configuração da aplicação
│   │   ├── constants/            # Constantes da aplicação
│   │   ├── guards/               # Guards de rota
│   │   ├── interceptors/         # Interceptadores HTTP
│   │   ├── models/               # Interfaces TypeScript
│   │   ├── services/             # Serviços de negócio principais
│   │   ├── utils/                # Funções utilitárias
│   │   └── validators/           # Validadores personalizados
│   ├── features/
│   │   ├── admin/                # Funcionalidades administrativas
│   │   │   ├── pages/
│   │   │   │   ├── dashboard/    # Dashboard administrativo
│   │   │   │   ├── login/        # Login administrativo
│   │   │   │   └── user-management/ # Gerenciamento de usuários
│   │   │   └── components/       # Componentes específicos do admin
│   │   ├── pets/                 # Funcionalidades de gerenciamento de pets
│   │   │   ├── pages/
│   │   │   │   ├── pet-list/     # Página de listagem de pets
│   │   │   │   ├── pet-detail/   # Página de detalhes do pet
│   │   │   │   ├── pet-form/     # Formulário de pet (admin)
│   │   │   │   ├── adoption/     # Processo de adoção
│   │   │   │   └── faq/          # Página de FAQ
│   │   │   └── components/       # Componentes específicos de pets
│   │   ├── store/                # Funcionalidades de inventário da loja
│   │   └── user/                 # Funcionalidades de gerenciamento de usuários
│   ├── layouts/
│   │   ├── auth-layout/          # Layout de autenticação
│   │   └── main-layout/          # Layout principal da aplicação
│   ├── pages/
│   │   ├── auth/                 # Páginas de autenticação
│   │   ├── error/                # Páginas de erro (404, 500)
│   │   └── home/                 # Página inicial
│   └── shared/
│       └── components/           # Componentes reutilizáveis
│           ├── header/           # Cabeçalho da aplicação
│           ├── footer/           # Rodapé da aplicação
│           ├── loading-spinner/  # Indicadores de carregamento
│           └── custom-pagination/ # Paginação personalizada
└── assets/                       # Assets estáticos
    ├── images/                   # Assets de imagem
    └── default-pet.png          # Imagem padrão de pet
```

## Componentes Principais

### Serviços
- **PetService**: Gerencia operações CRUD de pets e comunicação com API
- **ImageService**: Gerencia imagens de pets com mecanismos de fallback
- **ErrorService**: Tratamento centralizado de erros com padrões reativos
- **StoreService**: Gerenciamento de inventário e pedidos
- **AdoptionService**: Gerencia processo de adoção de pets
- **NotificationService**: Notificações e alertas do usuário
- **LoadingService**: Gerenciamento de estado de carregamento global

### Módulos
- **HomeModule**: Página inicial com estatísticas de adoção
- **PetsModule**: Listagem, detalhes e gerenciamento de pets
- **StoreModule**: Catálogo de produtos e inventário
- **AdminModule**: Funcionalidades e dashboard administrativos
- **ErrorsModule**: Páginas de erro personalizadas (404, 500)

## Integração com API

- **Endpoints de Pets**: Dados reais de adoção de pets com filtragem avançada
- **Endpoints da Loja**: Gerenciamento de inventário de produtos para pets
- **Endpoints de Adoção**: Processo de adoção de pets

## Recursos de Desenvolvimento

### Qualidade de Código
- **TypeScript**: Modo estrito com tipagem abrangente
- **Linting**: ESLint e regras específicas do Angular
- **Tratamento de Erros**: Interceptador HTTP global com páginas de erro personalizadas
- **Performance**: Lazy loading e tamanhos de bundle otimizados
- **Testes**: Testes unitários completos (43/43 passando - 100% de sucesso, 27.1% cobertura)

### Experiência do Usuário
- **Design Responsivo**: Abordagem mobile-first com breakpoints
- **Estados de Carregamento**: Indicadores de carregamento global
- **Recuperação de Erros**: Mensagens de erro amigáveis
- **Material Design**: Componentes e padrões de UI consistentes

## Como Começar

### Pré-requisitos
- Node.js 18+ 
- npm 9+
- Angular CLI 19+

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lanroo/petstore.git
cd petstore
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
ng serve
```

4. Navegue para `http://localhost:4200` ou `https://adoteumamigo-nu.vercel.app/` (produção)

## Acesso ao Painel Administrativo

Para acessar o painel administrativo:

1. **URL de Login**: 
   - Desenvolvimento: `http://localhost:4200/admin/login` ou `http://localhost:4200/login`
   - Produção: `https://adoteumamigo-nu.vercel.app/admin/login`
2. **Credenciais**: Serão fornecidas pela desenvolvedora
3. **Dashboard**: Após o login, voce ira acessar:
   - Desenvolvimento: `http://localhost:4200/admin/dashboard`
   - Produção: `https://adoteumamigo-nu.vercel.app/admin/dashboard`

### Rotas Principais

#### Desenvolvimento (Local)
- **Página Inicial**: `http://localhost:4200/`
- **Lista de Pets**: `http://localhost:4200/pets`
- **FAQ**: `http://localhost:4200/pets/faq`
- **Login Admin**: `http://localhost:4200/admin/login`
- **Dashboard Admin**: `http://localhost:4200/admin/dashboard`

#### Produção (Vercel)
- **Página Inicial**: `https://adoteumamigo-nu.vercel.app/`
- **Lista de Pets**: `https://adoteumamigo-nu.vercel.app/pets`
- **FAQ**: `https://adoteumamigo-nu.vercel.app/pets/faq`
- **Login Admin**: `https://adoteumamigo-nu.vercel.app/admin/login`
- **Dashboard Admin**: `https://adoteumamigo-nu.vercel.app/admin/dashboard`

### Build para Produção

```bash
ng build --configuration production
```

O build de produção inclui:
- Minificação e otimização de código
- Tree shaking para bundles menores
- Otimização de assets
- Geração de source maps
- Análise de bundle

## Testes

Execute os testes unitários:
```bash
ng test
```

Execute testes com cobertura:
```bash
ng test --code-coverage
```

Testes unitários completos com Jasmine e Karma:
- **155 de 158 testes passando** (98% de sucesso)
- **Serviços testados**: PetService, AuthService, AdoptionService, LoadingService, NotificationService, UserService, StoreService, DashboardService, ErrorService, ImageService
- **Componentes testados**: PetListComponent, PetFormComponent, PetDetailComponent, LoginComponent, MainLayoutComponent, LoadingSpinnerComponent, CustomPaginationComponent, HeaderComponent, FooterComponent
- **Cobertura de código**: 40.67% (519/1276 linhas)
  - **Statements**: 40.67% (519/1276)
  - **Functions**: 36.44% (156/428)
  - **Lines**: 40.96% (510/1245)
- **Tempo de execução**: 0.35 segundos
- **Configuração**: TestBed configurado corretamente com mocks e dependências injetadas
- **Relatório**: Execute `ng test --code-coverage` e abra `coverage/pet-store-app/index.html`

## Deploy

A aplicação está pronta para deploy com:
- Configuração de build de produção
- Otimização de assets
- Configuração de ambiente
- Assets estáticos prontos para CDN

## Stack Tecnológico

- **Frontend**: Angular 19.2.15 + Angular Material
- **Backend**: Python FastAPI (API personalizada em outro repo)
- **Arquitetura**: RESTful com lazy loading

## Configuração da API

✅ **API CONFIGURADA**: Este projeto já está configurado para usar uma API:
- **URL Base**: Definida em `src/environments/environment.ts`
- **Endpoints**: Pets, adoções, usuários e loja
- **Autenticação**: Sistema de login via API com endpoints `/api/auth/login`

### Para rodar o projeto:
1. Execute `ng serve` para o frontend
2. A API já está configurada e funcionando
3. Não é necessário configuração adicional

## Tratamento de Erros

- **Interceptadores HTTP**: Tratamento global de erros
- **Páginas de Erro**: 404 e 500 personalizadas
- **Notificações**: Toast para feedback do usuário

## Otimizações de Performance

- **Lazy Loading**: Módulos de funcionalidades carregados sob demanda
- **Otimização de Imagens**: Imagens de pets com fallbacks
- **Divisão de Bundle**: Carregamento de chunk otimizado
- **Gerenciamento de Memória**: Limpeza adequada de subscriptions

## Suporte a Navegadores

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Navegadores móveis (iOS Safari, Chrome Mobile)

## Licença

Este projeto está licenciado sob a Licença MIT.

## Changelog

### Versão 1.0.0
- Lançamento inicial
- Plataforma de adoção de pets
- Dashboard administrativo
- Design responsivo
- Tratamento de erros
- Otimizações de performance
# Página Pública de Animais

## Descrição

Implementação de páginas públicas para visualização de animais disponíveis para apadrinhamento, sem necessidade de autenticação.

## Estrutura de Arquivos Criados

```
app/
├── api/
│   └── public/
│       └── animals/
│           ├── route.ts                    # API route para listar animais
│           └── [uuid]/
│               └── route.ts                # API route para detalhes do animal
├── public/
│   └── animais/
│       ├── page.tsx                        # Página de listagem pública
│       └── [uuid]/
│           └── page.tsx                    # Página de detalhes do animal
└── components/
    └── Navbar.tsx                          # Atualizado com link "Animais"
```

## Funcionalidades

### 1. Listagem de Animais (`/public/animais`)

- ✅ Grid responsivo de cards de animais
- ✅ Informações: nome, tipo, raça, idade, descrição
- ✅ Foto principal de cada animal
- ✅ Tags coloridas de características
- ✅ Hero section com título
- ✅ Design moderno com hover effects
- ✅ Navbar e Footer integrados

### 2. Detalhes do Animal (`/public/animais/[uuid]`)

- ✅ Galeria com até 3 fotos
- ✅ Seletor de fotos com miniaturas
- ✅ Informações completas do animal
- ✅ Todas as tags de características
- ✅ Descrição detalhada
- ✅ Call-to-action para apadrinhamento
- ✅ Breadcrumb para navegação

### 3. API Routes (Server-Side)

- ✅ `/api/public/animals` - Lista todos os animais
- ✅ `/api/public/animals/[uuid]` - Detalhes de um animal específico
- ✅ Token fixo enviado do servidor (não exposto ao cliente)
- ✅ Tratamento de erros

## Segurança

### Token de API Público

O token usado para acessar a API é mantido seguro através de:

1. **Variável de ambiente SEM `NEXT_PUBLIC_`**
   ```env
   PUBLIC_API_TOKEN=seu_token_aqui
   ```
2. **Uso apenas em API Routes (server-side)**
   - As requisições ao backend são feitas através de `/api/public/*`
   - O token NUNCA é exposto ao cliente
   - Não pode ser acessado via F12 ou DevTools

3. **Fluxo de Requisição**
   ```
   Cliente (Browser)
     → Next.js API Route (Server-Side)
       → Backend API (com token)
         → Resposta
   ```

## Configuração

### 1. Adicionar Token ao .env

Crie ou atualize o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
PUBLIC_API_TOKEN=seu_token_fixo_aqui
```

⚠️ **IMPORTANTE**: Não use `NEXT_PUBLIC_` no nome da variável do token, pois isso a tornaria visível no cliente.

### 2. Backend Requirements

O backend deve ter os seguintes endpoints:

- `GET /animals` - Lista todos os animais
- `GET /animals/:uuid` - Detalhes de um animal específico

Ambos devem aceitar o token via header:

```
Authorization: Bearer {token}
```

## Design e UX

### Cores Utilizadas

- **Primary**: `var(--ong-purple)` - Roxo da ONG
- **Secondary**: `var(--ong-orange)` - Laranja da ONG
- **Backgrounds**: Cinza claro (#F9FAFB)

### Responsividade

- **Mobile**: 1 coluna
- **Tablet**: 2 colunas
- **Desktop**: 3-4 colunas
- **XL**: 4 colunas

### Animações

- Hover em cards: elevação e escala de imagem
- Transições suaves em todos os elementos
- Loading states com spinner animado

## Navegação

### Link na Navbar

Adicionado link "Animais" na navegação principal que direciona para `/public/animais`

### Breadcrumbs

Na página de detalhes, breadcrumb para voltar à listagem

### Botões CTA

- "Ver Detalhes" nos cards
- "Quero Apadrinhar" na página de detalhes (redireciona para login)

## Estados de UI

### Loading

- Spinner animado
- Mensagem "Carregando animais..." ou "Carregando informações..."

### Erro

- Ícone de erro
- Mensagem descritiva
- Botão para tentar novamente ou voltar

### Vazio

- Ícone ilustrativo
- Mensagem amigável
- Sugestão de ação

## Otimizações

1. **Imagens**
   - `unoptimized` para imagens do backend
   - Fallback para placeholder em caso de erro
   - Lazy loading automático do Next.js

2. **Performance**
   - `cache: 'no-store'` nas API routes para dados sempre atualizados
   - Componentes client-side apenas onde necessário

3. **SEO**
   - Títulos descritivos
   - Estrutura semântica HTML
   - Meta tags podem ser adicionadas com Next.js Metadata API

## Próximos Passos (Opcional)

- [ ] Adicionar filtros na página de listagem
- [ ] Implementar paginação
- [ ] Adicionar compartilhamento social
- [ ] Implementar sistema de favoritos
- [ ] Adicionar breadcrumb schema markup (SEO)
- [ ] Implementar ISR (Incremental Static Regeneration)

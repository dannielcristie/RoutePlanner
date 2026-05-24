# 🗺️ Route Planner

Um planejador de rotas Fullstack moderno e otimizado, desenvolvido com React, Node.js e integrado com a API do Google Maps. A aplicação permite roteamento de múltiplos pontos, reordenação intuitiva de paradas (Drag-and-Drop) e histórico inteligente de viagens recentes.

## 🚀 Funcionalidades

- **Google Places Autocomplete:** Preenchimento inteligente de endereços usando a API do Google Places.
- **Modos de Rota Dinâmicos:** Suporte para viagens ponto-a-ponto, rotas cíclicas (Base-Origem-Base) ou paradas customizáveis ilimitadas.
- **Reordenação Drag-and-Drop:** Arraste e solte pontos intermediários facilmente utilizando a biblioteca `@dnd-kit`.
- **Histórico Persistente:** O sistema salva automaticamente as 5 rotas mais recentes via localStorage, exibindo-as em chips clicáveis com opção de exclusão rápida (X).
- **Design Glassmorphism:** Interface moderna e polida utilizando técnicas avançadas de design translúcido em CSS puro.
- **Otimização Extrema (Docker):** O Backend é empacotado em um único arquivo (via `tsup`), reduzindo drasticamente o consumo de disco (ignorando a pasta `node_modules` na imagem final) e travando o limite de RAM a 256MB pelo Docker Compose.
- **TDD (Test-Driven Development):** Suíte de testes automatizados unitários focados na UI e na API, rodando em milissegundos via Vitest.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** + **Vite** (Build ultra rápido)
- **TypeScript** (Tipagem forte e prevenção de bugs)
- **Lucide React** (Ícones SVG escaláveis e limpos)
- **Dnd-kit** (Drag and Drop fluido)
- **Vitest** + **Testing Library** + **JSDOM** (Testes de UI isolados)

### Backend
- **Node.js** + **Express**
- **TypeScript** + **Tsup** (Bundler para imagens Docker microscópicas)
- **Axios** (Integração de APIs REST)
- **Vitest** + **Supertest** (Testes de integração simulando requests HTTP)

### DevOps e Infraestrutura
- **Docker** e **Docker Compose** (Contêineres multi-stage e limitados por CPU/RAM)

---

## ⚙️ Pré-requisitos

Para rodar este projeto perfeitamente, você precisará de:
- **Docker** e **Docker Compose** instalados na sua máquina.
- Uma chave de API válida do [Google Cloud Platform](https://console.cloud.google.com/) com as seguintes APIs ativadas:
  - **Maps JavaScript API** (Para carregar os scripts visuais da caixa de pesquisa)
  - **Places API** (Para o Autocomplete inteligente no Frontend)
  - **Routes API** (Para o cálculo de distância/tempo exatos no Backend)

---

## 📦 Instalação e Uso

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd RoutePlanner
   ```

2. **Configure o ambiente:**
   Crie um arquivo `.env` na raiz do projeto contendo as seguintes variáveis:
   ```env
   # Chave única espelhada para ambos os ambientes
   GOOGLE_MAPS_KEY=AIzaSuaChaveDoGoogleAqui
   VITE_GOOGLE_MAPS_KEY=AIzaSuaChaveDoGoogleAqui
   PORT=3000
   ```

3. **Suba a aplicação com Docker:**
   Execute na pasta raiz do projeto:
   ```bash
   docker compose up -d --build
   ```

4. **Acesse no navegador:**
   - **Interface Gráfica (Frontend):** `http://localhost:5173`
   - **Servidor API (Backend):** `http://localhost:3000`

---

## 🧪 Testes (TDD)

A aplicação segue conceitos rígidos de **Test-Driven Development (TDD)**, simulando requisições e comportamentos para garantir confiabilidade.

### Testes no Frontend (Interface e Componentes)
Navegue até a pasta `frontend` e rode a suíte do Vitest:
```bash
cd frontend
npm install
npm run test
```

### Testes no Backend (Regras e Integração Google API)
Navegue até a pasta `backend` e rode a suíte do Vitest/Supertest (mockada, sem gasto de cota da API):
```bash
cd backend
npm install
npm run test
```

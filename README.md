#  CollabWrite — Frontend (Angular)

O **CollabWrite** é uma plataforma leve de **escrita, edição e compartilhamento de textos** em tempo real.  
O objetivo é permitir que usuários criem documentos, colaborem ao vivo e controlem quem pode ver ou editar cada texto.

Este repositório contém o **frontend** da aplicação, desenvolvido com **Angular**, **Signals**, **TailwindCSS**, **Quill**, **RxJS** e **Y.js**.

---

## Funcionalidades Principais

### Autenticação & Sessão

- Login, registro e sessão persistente via **JWT**
- Armazenamento de `token` + `user` no `localStorage`
- `AuthGuard` protegendo rotas privadas
- `AuthInterceptor` adiciona o token automaticamente nas requisições
- Restauração automática da sessão via `/auth/me`

### Editor de Texto (Quill)

- Editor rico baseado em **ngx-quill**
- Armazena conteúdo como **Delta + HTML**
- **Autosave com debounce** para evitar perda de conteúdo
- Suporte a múltiplos usuários editando o mesmo documento

### Colaboração em Tempo Real (Yjs)

- Sincronização usando **Y.Doc + Y.Text + y-websocket**
- Cada documento é uma *sala* única no servidor WebSocket
- Atualizações instantâneas entre usuários conectados
- Suporte a cursores remotos

### Documentos

- Criar, editar, excluir e listar documentos
- Sistema de visibilidade:
  - **PRIVATE** – somente o autor
  - **SHARED** – compartilhado com usuários específicos
  - **PUBLIC** – aparece na aba “Explorar”
- Compartilhamento via link direto
- Página **Explorar** para visualizar documentos públicos

###  UI/UX

- Estilização com **TailwindCSS**
- Layout **totalmente responsivo**
- Componentes standalone
- Uso opcional de **Lottie Animation** na landing (somente desktop)

---

## Arquitetura Técnica

###  Tecnologias Utilizadas

| Tecnologia            | Uso                         |
|----------------------|------------------------------|
| **Angular 18+**      | Framework principal          |
| **Signals**          | Estado reativo interno       |
| **RxJS**             | Streams, debounce, autosave  |
| **TailwindCSS**      | Estilização responsiva       |
| **Quill / ngx-quill**| Editor de texto              |
| **Y.js + y-websocket** | Colaboração em tempo real |
| **HttpClient**       | Comunicação com API          |
| **Standalone Components** | Modularidade e performance |

---

##  Estrutura de Pastas (simplificada)

```bash
src/
 ├── app/
 │    ├── components/
 │    │     ├── animation-component/
 │    │     ├── dialog/
 │    │     ├── generic-documents/
 │    │     ├── landing-page/
 │    │     └── search/
 │    │
 │    ├── core/
 │    │     ├── guards/
 │    │     ├── resolvers/
 │    │     ├── services/
 │    │     └── models/
 │    │
 │    ├── pages/
 │    │     ├── documents/
 │    │     ├── editor/
 │    │     ├── editor-colab/
 │    │     ├── explore/
 │    │     ├── layout/
 │    │     ├── register/
 │    │     ├── shared-redirect/
 │    │     ├── text-reader/
 │    ├── app.component.html
 │    ├── app.component.scss
 │    ├── app.component.ts
 │    ├── app.component.spec.ts
 │    ├── app.config.server.ts
 │    ├── app.config.ts
 │    ├── app.routes.ts
 │
 └── assets/

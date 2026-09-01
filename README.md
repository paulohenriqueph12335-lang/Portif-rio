# Portif-rio_
Interactive business portfolio focused on Project Management, Business Intelligence, Data Analytics, Process Automation, and AI. Featuring real-world case studies, dashboards, and scalable solutions that transform complex challenges into measurable business results.


## Espaço de portfólio

Este repositório agora inclui uma landing page estática em `index.html`, com estilos em `styles.css`, para apresentar projetos, competências, indicadores e contato profissional.

---

## Versão offline (PWA)

Este projeto foi adaptado para funcionar como **Progressive Web App**:
- Todas as fontes (Fraunces, IBM Plex Mono, Inter) são hospedadas localmente em `assets/fonts/` — nenhuma chamada a CDNs externas.
- `manifest.json` + `service-worker.js` fazem o cache de todos os arquivos (HTML, CSS, JS, imagens, fontes) no primeiro acesso.
- Depois do primeiro acesso, o site funciona **sem internet**, inclusive pode ser "instalado" (ícone na tela inicial / atalho).

### Publicar no GitHub Pages (grátis, sem prazo de validade)

1. Crie um repositório no GitHub e envie todo o conteúdo desta pasta para a branch `main`.
2. No repositório, vá em **Settings → Pages**.
3. Em "Build and deployment", selecione **Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Salve. Em 1–2 minutos o GitHub gera o link, algo como `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.
5. Compartilhe esse link. Na primeira visita (com internet) o site já cacheia tudo sozinho; nas próximas vezes ele abre normalmente mesmo sem conexão.

### Atualizando o conteúdo depois

Se editar qualquer arquivo, troque o número em `CACHE_NAME` no `service-worker.js` (ex: `ph-portfolio-v1` → `ph-portfolio-v2`). Isso avisa o navegador de quem já visitou que existe conteúdo novo para baixar.

# SEO Checklist - Próximos Passos

## Configurações Importantes (Substituir)

### 1. **Domínio Base**
Substitua `seu-dominio.com` por seu domínio real em:
- `layout.tsx` - metadata canonical
- `portfolio/page.tsx` - metadata canonical
- `robots.txt` - sitemap URL
- `sitemap.ts` - baseUrl
- `structured-data.ts` - URLs

### 2. **Google & Bing**
```bash
# Substitua pelos seus códigos de verificação:
- layout.tsx: metadata.verification.google = "SEU_CÓDIGO_AQUI"
```

Envie seu sitemap em:
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters

### 3. **Redes Sociais**
Atualize URLs em `structured-data.ts`:
- GitHub
- LinkedIn  
- Twitter

## Otimizações Implementadas

✅ **Metadata** - Title templates, descriptions completas
✅ **Open Graph** - Imagens e links corretos para compartilhamento
✅ **Structured Data (JSON-LD)** - Person, Portfolio, Projects
✅ **Robots.txt** - Controla crawlers, bloqueia /admin
✅ **Sitemap** - URLs prioritizadas automaticamente
✅ **Manifest** - PWA metadata
✅ **Canonical URLs** - Evita conteúdo duplicado
✅ **Rota /portfolio** - SEO-friendly sem hash

## Performance & SEO

Para melhorias adicionais:

1. **Imagens**
   - Use `next/image` component (já está em use)
   - Comprima imagens com WebP
   - Use lazy loading

2. **Speed**
   ```bash
   npm run build
   npm start
   # Teste em Lighthouse (DevTools)
   ```

3. **Mobile**
   - Viewport já está configurado
   - Teste em dispositivos reais

4. **Acessibilidade (A11y)**
   - Aria labels já existem
   - Use verificador: https://wave.webaim.org

## Links Úteis

- Google Search Console: https://search.google.com/search-console
- Bing Webmaster: https://www.bing.com/webmasters
- Schema.org: https://schema.org
- PageSpeed Insights: https://pagespeed.web.dev
- Lighthouse: Chrome DevTools > Lighthouse

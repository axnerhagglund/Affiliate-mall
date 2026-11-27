# 8. Lansering

## Innan

```bash
npm test && npm run lint && npm run build
```

- [ ] `domain` i konfigurationen är rätt.
- [ ] Om oss, Affiliate och Integritetspolicy är publicerade och stämmer.
- [ ] Inga publicerade artiklar saknar källor.
- [ ] Startsidan har bild, och artiklarna har bilder eller ser bra ut utan.
- [ ] Be Claude kontrollera en produktionsbyggnad: alla sidor svarar 200, mobil utan sidledsscroll, inga trasiga bilder, Lighthouse.

## Vercel

1. **Add New → Project** och välj repot. Inga miljövariabler behövs om `DEFAULT_SITE` är satt.
2. **Deploy.**
3. **Settings → Domains:** lägg till `<domän>` och `www.<domän>`. Lägg in DNS-posterna hos domänleverantören (oftast en A-post och en CNAME för www).
4. `www` skickas vidare till domänen utan www av koden.
5. Vercel Analytics slås på under projektets Analytics-flik. Den sätter inga cookies.

## Efter

- [ ] **Google Search Console:** lägg till domänen, verifiera via DNS och skicka in `https://<domän>/sitemap.xml`.
- [ ] **Bing Webmaster Tools:** importera från Search Console.
- [ ] Lägg till domänen i molnmiljöns nätverkslista och be Claude kontrollera den publicerade sajten.
- [ ] Testa en delningslänk i LinkedIn Post Inspector eller Facebooks delningsfelsökare.
- [ ] Kör Rich Results Test på startsidan och en artikel.
- [ ] Ansök till affiliateprogrammen ([06-affiliate.md](06-affiliate.md)).

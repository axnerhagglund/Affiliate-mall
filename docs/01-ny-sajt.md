# 1. Ny sajt från mallen

## Skapa repot

1. Öppna Affiliate-mallen på GitHub och välj **Use this template → Create a new repository**.
2. Ge repot ett namn, till exempel `kaffe`, och välj privat eller publikt.

Repot är fristående: ändringar i mallen följer inte med automatiskt. Förbättringar som gäller alla sajter görs i mallen och förs över för hand vid behov.

## Molnmiljö för Claude

Starta en Claude Code-session med det nya repot och be Claude sätta upp en molnmiljö (se [prompter.md](prompter.md)). Miljön behöver:

- **Installationsskript:** `npm ci` i repots mapp.
- **Miljövariabel:** `NEXT_TELEMETRY_DISABLED=1`.
- **Nätverk:** paketregister är tillåtna som standard. Lägg till värdar för de källor Claude ska läsa, till exempel myndigheter, branschorganisationer och butikerna du länkar till. Lägg till sajtens egen domän efter lansering, så att Claude kan kontrollera den.

## Byt namn på exemplet

1. Kopiera `src/config/sites/exempel.ts` till `src/config/sites/<sajt>.ts` (till exempel `kaffe.ts`) och ändra `slug` till samma namn.
2. Registrera filen i `src/config/sites/index.ts` och sätt `DEFAULT_SITE` till den.
3. Skapa `src/content/<sajt>/` och `src/data/<sajt>/`.

Låt `exempel` och `test-site` ligga kvar. Testerna använder dem för att visa att den delade koden fungerar för alla sajter, och exemplet är bra att titta på när du skriver.

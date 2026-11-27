# 5. Bilder

goldenretrievers.se använder AI-genererade bilder från Runway. Krav:

- **Realistiska.** De ska se ut som riktiga foton.
- **Rätt i sak.** Färger, proportioner och miljö ska stämma med texten. En bild som visar något som texten säger är fel (en hundfärg som inte är tillåten, en farlig situation) byts eller beskärs.
- **Svensk miljö** när sajten är svensk: svenska hus, natur och ljus.
- **Inga loggor eller varumärken** i bild.

## Promptmall för Runway

```
Realistic photograph of <motiv> in <miljö i Sverige>, <ljus och årstid>,
<vad som händer>, natural colours, <35mm|50mm> lens, shallow depth of field, no text
```

Exempel från goldenretrievers.se:

```
Realistic photograph of a golden retriever with a light gold coat walking on a snowy forest path in Sweden,
wearing a dark green water-repellent dog coat covering its back and tail base, light snowfall, spruce trees,
soft blue winter daylight, snow on the dog's whiskers, natural colours, 50mm lens, no text
```

Be Claude skriva en prompt per artikel (se [prompter.md](prompter.md)).

## Konvertera

Namnge filerna efter vad de ska heta, lägg dem i en mapp och kör:

```bash
npm run bilder -- ~/Downloads/runway <sajt>
```

Resultatet hamnar i `public/images/<sajt>/` som WebP, högst 1920 px bred, kvalitet 80. Runways PNG-filer på 5–8 MB blir ungefär 100–250 KB.

## Använda

- **Startsidan:** `hero.image` och `hero.imageAlt` i konfigurationen. `hero.imageFocusX` (procent) håller motivet i bild på mobil.
- **Artiklar:** `image` och `imageAlt` i frontmatter. Bilden visas överst och på korten.
- **Delningsbilder** för sociala medier genereras automatiskt från titeln.

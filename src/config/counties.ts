/** Sweden's 21 counties, in the order SKK and the site clubs list them (by county letter). */
export const counties = [
  "Stockholms län",
  "Uppsala län",
  "Södermanlands län",
  "Östergötlands län",
  "Jönköpings län",
  "Kronobergs län",
  "Kalmar län",
  "Gotlands län",
  "Blekinge län",
  "Skåne län",
  "Hallands län",
  "Västra Götalands län",
  "Värmlands län",
  "Örebro län",
  "Västmanlands län",
  "Dalarnas län",
  "Gävleborgs län",
  "Västernorrlands län",
  "Jämtlands län",
  "Västerbottens län",
  "Norrbottens län",
] as const;

export type County = (typeof counties)[number];

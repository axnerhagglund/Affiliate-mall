import type { Breeder, Merits } from "./data";

/** "Cert & CACIB" stays as is; joins with commas and "och". */
function list(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} och ${items[items.length - 1]}`;
}

function meritPhrases(merits: Merits) {
  const phrases: string[] = [];
  if (merits.show) phrases.push(`utställning (${merits.show})`);
  if (merits.hunt) phrases.push(`jaktprov (${merits.hunt})`);
  return phrases;
}

/**
 * A few sentences about the kennel, built only from what the site club lists:
 * where it is, and the parents' merits, mental status and function description.
 * A description the kennel wrote itself always wins. Returns null when there is
 * nothing to say, so the card shows no text rather than filler.
 */
export function describeKennel(breeder: Breeder): string | null {
  if (breeder.description) return breeder.description;
  const litter = breeder.litter;
  if (!litter) {
    // On the club's register but no current litter: say what the register requires.
    if (!breeder.inRegister || !breeder.source) return null;
    return [
      `${breeder.kennel} i ${breeder.town} finns i ${breeder.source.name}.`,
      breeder.source.about,
      "Just nu har kenneln ingen kull i rasklubbens valphänvisning.",
    ]
      .filter(Boolean)
      .join(" ");
  }

  const sentences: string[] = [
    `${breeder.kennel} i ${breeder.town} har en kull i rasklubbens valphänvisning, som bara tar med kullar där svenskägda föräldrar uppfyller klubbens krav på hälsa och meriter.`,
  ];

  // The club marks foreign-owned parents with "*" and cannot check their health or merits.
  const parents = [
    { role: "Fadern", name: litter.sire, merits: litter.sireMerits },
    { role: "Modern", name: litter.dam, merits: litter.damMerits },
  ];
  for (const { role, name, merits } of parents) {
    if (name?.trim().endsWith("*")) {
      sentences.push(`${role} är utlandsägd, så klubben har inte kontrollerat ${role === "Fadern" ? "hans" : "hennes"} hälsa och meriter.`);
      continue;
    }
    const phrases = merits ? meritPhrases(merits) : [];
    if (phrases.length) sentences.push(`${role} är meriterad på ${list(phrases)}.`);
  }

  const mental = parents.filter((p) => p.merits?.mental).map((p) => p.role.toLowerCase());
  const described = parents.filter((p) => p.merits?.functionDescribed).map((p) => p.role.toLowerCase());
  if (mental.length === 2) sentences.push("Båda föräldrarna har känd mental status (MH eller BPH).");
  else if (mental.length === 1) sentences.push(`${capitalize(mental[0])} har känd mental status (MH eller BPH).`);
  if (described.length === 2) sentences.push("Båda är funktionsbeskrivna.");
  else if (described.length === 1) sentences.push(`${capitalize(described[0])} är funktionsbeskriven.`);

  return sentences.join(" ");
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

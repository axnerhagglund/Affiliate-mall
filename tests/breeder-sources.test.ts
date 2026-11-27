import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSectionList } from "../scripts/breeder-sources/section-list";

const page = `
<p id="x"><strong>JÄMTLAND / HÄRJEDALEN</strong><br><a href="http://www.a.se/"><strong>Alfa</strong></a><br>Svensson Anna, Brunflo<br><br><strong>Beta Kennel</strong><br>Eva Karlsson, Gatan 145, 832 49 ORRVIKEN. Tfn 063 – 400 33<br><br><a href="https://c.se">Gamma&lt;/strong &gt;</a><br>Ek Per, Ås</p>
<p id="y"><strong>OKÄND SEKTION</strong><br>Delta<br>Ek Bo, Någonstans</p>`;

test("register parser keeps town and owner, and never phone numbers or addresses", () => {
  const { kennels, problems } = parseSectionList(page);
  assert.deepEqual(
    kennels.map((k) => [k.kennel, k.owners, k.town, k.url]),
    [
      ["Alfa", "Svensson Anna", "Brunflo", "http://www.a.se/"],
      ["Beta Kennel", undefined, "Orrviken", undefined],
      ["Gamma", "Ek Per", "Ås", "https://c.se"],
    ],
  );
  const stored = JSON.stringify(kennels);
  assert.ok(!/\d{3}\s?\d{2}|tfn|gatan/i.test(stored), "phone number, postcode or street left in the data");
  assert.deepEqual(problems, ['Unknown club section "OKÄND SEKTION"']);
});

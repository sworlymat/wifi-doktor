export const questions = [
  { id: "problem", title: "Co vás nejvíc trápí?", options: [
    ["slow", "Pomalá Wi-Fi"], ["drops", "Wi-Fi vypadává"], ["signal", "Slabý signál"],
    ["video", "Seká se TV nebo video"], ["other", "Jiný problém"],
  ] },
  { id: "location", title: "Kde problém pozorujete?", options: [
    ["everywhere", "V celém bytě/domě"], ["rooms", "Jen v některých místnostech"],
    ["device", "Jen na jednom zařízení"], ["unknown", "Nevím"],
  ] },
  { id: "near", title: "Když jste s telefonem přímo u routeru, funguje Wi-Fi dobře?", options: [
    ["yes", "Ano"], ["no", "Ne"], ["unknown", "Nevím"],
  ] },
  { id: "walls", title: "Je problémové místo přes jednu nebo více zdí či stropů od routeru?", options: [
    ["yes", "Ano"], ["no", "Ne"], ["unknown", "Nevím"],
  ] },
] as const;

export type Category = "A" | "B" | "C" | "D" | "E";
export type Answers = readonly string[];

// Prioritize concrete device/location evidence; uncertainty is a valid outcome.
export function classify(answers: Answers): Category {
  if (answers.length !== questions.length || answers.some((answer, i) =>
    !questions[i].options.some(([value]) => value === answer))) return "E";
  const [problem, location, near, walls] = answers;
  if (location === "device") return near === "no" ? "E" : "C";
  if (location === "rooms" && near === "no") return "E";
  if (near === "yes" && (location === "rooms" || (walls === "yes" && problem === "signal"))) return "A";
  if (location === "rooms" && walls === "yes" && near === "unknown" && problem === "signal") return "A";
  if (near === "no" && location === "everywhere") return "D";
  if (near === "no" && location === "unknown" && problem !== "other") return "B";
  if (near === "yes" && walls === "no" && (problem === "slow" || problem === "drops" || problem === "video")) return "B";
  return "E";
}

export const results: Record<Category, { title: string; description: string; hint: string }> = {
  A: { title: "Stopa vede k pokrytí Wi-Fi", description: "Podle vašich odpovědí může problém souviset s pokrytím Wi-Fi, umístěním routeru, použitým pásmem nebo překážkami mezi routerem a zařízením.", hint: "Nekupujte zatím nový router. Samotné odpovědi ještě nepotvrzují, zda je internetová přípojka v pořádku." },
  B: { title: "Prověřit router a nastavení Wi-Fi", description: "Podle vašich odpovědí je jednou z možných příčin router, nastavení Wi-Fi nebo rušení. Podobně se ale může projevit i problém přípojky či zařízení.", hint: "Zatím nic neresetujte do továrního nastavení. Nejdřív je potřeba možné příčiny rozlišit." },
  C: { title: "Stopa vede ke konkrétnímu zařízení", description: "Podle vašich odpovědí může být problém v jednom telefonu, televizi nebo počítači. Jeho připojení či umístění může hrát větší roli než samotná internetová přípojka.", hint: "Kvůli jedinému zařízení zatím nekupujte nový router." },
  D: { title: "Prověřit přípojku i domácí síť", description: "Podle vašich odpovědí se problém projevuje na více místech i blízko routeru. Jednou z možných příčin je internetová přípojka, ale také router nebo širší problém domácí sítě.", hint: "Z těchto odpovědí nelze určit, na které straně je chyba. Nejdřív je potřeba oddělit problém Wi-Fi od problému přípojky." },
  E: { title: "Zatím nemáme jednoznačnou stopu", description: "Podle vašich odpovědí zatím nelze spolehlivě určit, kde hledat hlavní příčinu. Některé informace chybí nebo ukazují více směry.", hint: "To je v pořádku. Další krok je postupně ověřit jednotlivé možnosti, ne měnit nastavení naslepo." },
};

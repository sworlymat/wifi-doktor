# Kontrola funkčnosti — 7. 9. 2026

## Opraveno

- Všechny zbývající odkazy next/link nahrazeny běžnými odkazy kvůli doloženému pádu navigace vinext beta.
- Chyba či zrušení Checkout zobrazí vysvětlení přímo v nabídce.
- Ověření přístupu kontroluje produkt, cenu, měnu a jednorázový režim platby. Výpadek Stripe už nevypadá jako nezaplacená objednávka.
- Webhook ověřuje podpis asynchronně pomocí Web Crypto. Obsluhuje také checkout.session.async_payment_succeeded.
- D1 lease brání souběžnému zpracování oznámení. CRM a e-mail se zkoušejí nezávisle; při chybě odpověď 503 umožňuje Stripe opakovat doručení. Odeslaný e-mail a vytvořená úloha se evidují samostatně.
- Resend dostává idempotency key; externí volání mají časový limit.
- Návratové a přístupové adresy používají pevnou veřejnou doménu. Citlivé stránky mají no-store, noindex a no-referrer.
- Průvodce umožňuje ukončit vyřešený problém; doplněny pokyny pro výpadek sítě, heslo a zákaz neuváženého továrního resetu.
- OG image používá pevnou veřejnou doménu místo neověřených hlaviček, doplněna existující ikona, opravené typy Cloudflare, mobilní zalamování a viditelný fokus.

## Ověření

TypeScript, ESLint, produkční sestavení a testy v tests/.
Testy používají izolovanou SQLite databázi se všemi skutečnými migracemi a podepsané syntetické Stripe události.
Neúčtují skutečné platby ani neposílají zákazníkům e-maily.

## Zbývající nastavení

Ve zveřejněném prostředí byly při auditu dostupné pouze STRIPE_RESTRICTED_KEY, STRIPE_WEBHOOK_SECRET a CLICKUP_LIST_ID.
Chybí CLICKUP_API_TOKEN, RESEND_API_KEY a ORDER_FROM_EMAIL. Nevyplněné integrace se přeskočí; chybějící klíče nelze opravit změnou kódu.
Po doplnění klíčů je nutné nasazení a nové doručení dřívějších událostí ze Stripe, jinak se již přijaté objednávky automaticky zpětně neodešlou.

Pro platby vyžadující dodatečné potvrzení musí Stripe destination odebírat obě události:
checkout.session.completed a checkout.session.async_payment_succeeded.
Úspěch HTTP webhooku sám o sobě nepotvrzuje doručení do nenastaveného CRM nebo e-mailu.

Stripe zůstává testovací. Pro ostrý provoz zbývá aktivace účtu, samostatný live klíč a live webhook secret.
Na právních stránkách stále chybí provozovatel, IČO, adresa, kontakt a definitivní nákupní podmínky. Tyto údaje nebyly odhadovány.

## Provozní omezení

Přístupový odkaz obsahuje tajný identifikátor zaplacené Checkout session. Nesmí se veřejně sdílet. Přístup při každém načtení závisí na Stripe; přepnutí na jiný účet/live klíč nezachová testovací přístupy.
Pokud ClickUp úlohu vytvoří, ale odpověď se ztratí před uložením jejího ID, při dalším doručení stále může vzniknout duplikát. Lease řeší souběh, nikoli atomickou transakci napříč dvěma službami.
Průvodce obsahuje čtyři základní cesty po třech krocích; nejde o automatickou diagnostiku routeru.

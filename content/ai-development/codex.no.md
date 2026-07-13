---
title: "OpenAI Codex"
translationKey: ai-codex
eyebrow: "Coding agent"
summary: "En praktisk guide til Codex som utviklingsagent: arbeidsflater, prosjektinstruksjoner, verktøy, delegering, kodegjennomgang og verifisering."
last_reviewed: "13. juli 2026"
weight: 20
official_sources:
  - name: "Codex documentation"
    description: "Offisiell inngang til oppsett, arbeidsflater, konfigurasjon og bruk."
    url: "https://developers.openai.com/codex/"
  - name: "Codex use cases"
    description: "Konkrete arbeidsmønstre for utvikling, analyse, kvalitet og automatisering."
    url: "https://developers.openai.com/codex/use-cases"
  - name: "OpenAI Codex på GitHub"
    description: "Kildekode, releases og issues for Codex CLI."
    url: "https://github.com/openai/codex"
---

## Hva Codex er

Codex er OpenAIs utviklingsagent for å forstå, endre, teste, gjennomgå og feilsøke programvare. Forskjellen fra tradisjonell autocomplete er arbeidsomfanget: Codex kan undersøke en hel kodebase, bruke utviklerverktøy, endre flere filer og følge feedback fra bygg og tester.

Codex er mest nyttig når oppgaven beskriver et resultat fremfor én bestemt kodelinje. Typiske oppgaver er å finne årsaken til en feil, implementere en avgrenset funksjon, modernisere kode uten å endre oppførsel, skrive regresjonstester, gjennomgå en diff eller forklare hvordan en ukjent del av systemet henger sammen.

## Arbeidsflatene

- **CLI** passer når terminalen, repoet og eksisterende kommandolinjeverktøy er sentrum for arbeidet.
- **IDE-integrasjon** holder agenten nær åpne filer, editor-kontekst og den vanlige kodeflyten.
- **Codex-appen** kombinerer samtale, planlegging, filendringer, terminalarbeid, visuell kontroll og håndtering av flere oppgaver.
- **Cloud/web-oppgaver** kan arbeide i et isolert miljø og egner seg for avgrensede oppgaver som kan delegeres og gjennomgås senere.

Velg arbeidsflate etter hvor konteksten og kontrollpunktene finnes. Det er sjelden nødvendig å standardisere alt på én flate; en lokal undersøkelse kan for eksempel bli til en delegert oppgave og ende som en lokal review.

## Codex sin arbeidsmodell

En god Codex-oppgave kombinerer fem ting:

1. **Et konkret mål** med akseptansekriterier.
2. **Repo-kontekst** som forklarer hvordan prosjektet bygges, testes og organiseres.
3. **Verktøy** for å lese tilstand og utføre handlinger.
4. **Tillatelser og sandbox** som avgrenser hva agenten kan påvirke.
5. **Verifikasjon** som avgjør om arbeidet faktisk er ferdig.

Prompten starter oppgaven, men prosjektets instruksjoner og verktøy gjør kvaliteten repeterbar.

## Varige prosjektinstruksjoner med AGENTS.md

`AGENTS.md` er stedet for regler Codex bør kjenne hver gang den arbeider i repoet. Legg inn informasjon som er stabil og handlingsrettet:

- kommandoer for bygg, test, linting og lokal kjøring
- arkitekturgrenser og hvilke lag som eier hva
- kodestil som ikke allerede håndheves maskinelt
- filer eller områder som ikke skal endres
- krav til migreringer, bakoverkompatibilitet og sikkerhet
- forventet verifikasjon før en oppgave rapporteres ferdig

Instruksjoner kan ligge nærmere bestemte deler av repoet når reglene bare gjelder et deltre. Hold filene korte. Regler som kan håndheves med formatter, kompilator, test eller hook bør håndheves der, ikke bare uttrykkes som tekst.

## Skills, plugins, MCP og hooks

Codex kan utvides på flere nivåer:

- En **skill** beskriver en gjenbrukbar arbeidsflyt, ofte med referanser, scripts eller maler.
- En **plugin** pakker skills sammen med verktøy, MCP-oppsett, hooks, apper eller andre ressurser som kan installeres samlet.
- **MCP** kobler agenten til strukturerte verktøy og fersk kontekst fra eksterne systemer.
- **Hooks** håndhever mekaniske regler rundt verktøykall og livssyklus.
- **Konfigurasjon** styrer personlige eller prosjektspesifikke standardvalg som modell, sandbox, godkjenning og integrasjoner.

Bruk den minste mekanismen som løser behovet. En engangsregel hører hjemme i oppgaven. En stabil repo-konvensjon hører hjemme i `AGENTS.md`. En gjentakbar prosess kan bli en skill. Levende eksterne data og handlinger bør eksponeres gjennom et verktøy eller MCP.

## En god Codex-flyt

### 1. Start med ønsket resultat

Oppgi mål, avgrensning og bevis. Eksempel: «Legg til rate limiting på de offentlige API-endepunktene. Bevar eksisterende klientkontrakt, dokumenter konfigurasjonen og verifiser med integrasjonstester.»

### 2. Be om undersøkelse når systemet er ukjent

La Codex finne inngangspunkter, følge kallkjeder og oppsummere eksisterende mønstre før implementasjonen. På risikofylte oppgaver er en reviewbar plan et godt kontrollpunkt.

### 3. Gi autonomi innenfor riktig grense

Agenten bør kunne lese og skrive i arbeidsområdet og kjøre relevante utviklerkommandoer. Nettverk, hemmeligheter, produksjonsmiljø og irreversible handlinger bør være mer restriktive.

### 4. La verktøyene gi feedback

Codex blir langt mer effektiv når den kan kjøre en smal test, lese den faktiske feilen og iterere. Oppgi de mest relevante kommandoene i repo-instruksjonene.

### 5. Gjennomgå resultatet, ikke bare forklaringen

Les diffen, sjekk om akseptansekriteriene er dekket og vurder om testene beviser riktig oppførsel. Se etter unødvendig omfang, svekkede valideringer og tester som er tilpasset implementasjonen i stedet for kravet.

## Bruk Codex til review

Kodegjennomgang er en egen oppgave, ikke bare siste steg i implementasjonen. Be Codex prioritere konkrete feil, regresjoner, sikkerhetsproblemer og manglende tester. Gi den diffen og relevant kontekst, men la den undersøke omkringliggende kode når funnet avhenger av systematferd.

En sterk review beskriver:

- hva som kan gå galt
- hvilke input eller tilstander som utløser feilen
- hvor problemet ligger
- hvorfor eksisterende tester ikke fanger det
- en avgrenset retning for retting

Be gjerne en separat Codex-oppgave gjøre review. Uavhengig kontekst reduserer risikoen for at agenten forsvarer sin egen tidligere løsning.

## Parallelle oppgaver og delegering

Parallelisering fungerer når oppgavene er uavhengige: research i forskjellige komponenter, separate tester, dokumentasjon og implementasjon i ulike områder. Den fungerer dårlig når flere agenter redigerer samme filer eller tar arkitekturvalg som avhenger av hverandre.

Hver delegert oppgave bør ha eget mål, tydelig eierskap til filer eller resultat, og en definert måte å levere funn på. Hovedoppgaven må integrere og verifisere helheten.

## Sikker bruk

- Start med arbeidsområdet som sikkerhetsgrense.
- Gi nettverk og eksterne systemer bare når oppgaven trenger det.
- Ikke legg produksjonshemmeligheter i filer agenten kan lese.
- Kontroller kommandoer som endrer data, tilgang eller eksterne ressurser.
- Behandle innhold hentet fra web, issues og dokumenter som ubetrodd input.
- Bruk branch, commit og diff som reversible kontrollpunkter – men ikke som erstatning for backup eller tilgangskontroll.

Codex kan gjøre mye arbeid selvstendig. Ansvar for arkitektur, tilgang, produktbeslutninger og hva som faktisk blir satt i produksjon forblir menneskelig.

## Når Codex gir størst verdi

Codex gir størst gevinst når feedback er tilgjengelig og oppgaven har et verifiserbart mål. Jo bedre repoet kan bygge, teste og forklare seg selv, desto mer autonomt kan agenten arbeide. Et repo uten pålitelige tester, dokumenterte kommandoer eller klare grenser blir ikke automatisk modent fordi en sterk modell får tilgang til det.

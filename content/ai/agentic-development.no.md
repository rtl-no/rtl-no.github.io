---
title: "Agentisk utvikling"
translationKey: ai-agentic-development
eyebrow: "Grunnprinsipper"
summary: "Hvordan målstyrte AI-agenter arbeider, hva som gjør dem nyttige, og hvordan de får nok frihet til å levere uten å få et ukontrollert skadepotensial."
last_reviewed: "13. juli 2026"
weight: 10
official_sources:
  - name: "Building effective agents"
    description: "Anthropics skille mellom workflows og agenter, med enkle komponerbare mønstre."
    url: "https://www.anthropic.com/engineering/building-effective-agents"
  - name: "Demystifying evals for AI agents"
    description: "Praktisk veiledning for å evaluere flerstegs agentatferd."
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - name: "Microsoft agent architecture"
    description: "Arkitektur-, evaluerings- og driftsveiledning for agentsystemer."
    url: "https://learn.microsoft.com/en-us/agents/"
---

## Hva «agentisk» betyr

En språkmodell svarer på en melding. En agent får et mål, tilgang til kontekst og verktøy, og kan selv velge en serie handlinger for å nå målet. Etter hver handling observerer den resultatet og avgjør hva som bør skje videre.

Den grunnleggende løkken er enkel:

1. **Forstå målet** og hva som teller som ferdig.
2. **Samle kontekst** fra kode, dokumentasjon, logger eller eksterne systemer.
3. **Velge og utføre en handling** med et verktøy.
4. **Observere resultatet**, inkludert feil og uventede konsekvenser.
5. **Justere planen** og gjenta til akseptansekriteriene er møtt.
6. **Levere bevis**: tester, byggresultat, diff, skjermbilde, spor eller annen verifikasjon.

Det avgjørende skiftet er at modellen ikke bare foreslår neste tekst. Den bruker programvare for å påvirke en tilstand utenfor modellen.

## Workflow eller agent?

| Tilnærming | Hvem bestemmer neste steg? | Passer best når |
|---|---|---|
| Tradisjonell kode | Programmet | Reglene er stabile og kan beskrives deterministisk. |
| AI-workflow | Forhåndsdefinert flyt med modellsteg | Prosessen er kjent, men enkelte steg krever tolkning. |
| Agent | Modellen velger dynamisk handling og verktøy | Veien til målet er ukjent og krever utforsking eller tilpasning. |

Start med den enkleste arkitekturen som løser problemet. Agenter gir fleksibilitet, men betaler for den med mer ventetid, høyere kostnad og større variasjon. Et deterministisk workflow er ofte bedre for stabile forretningsprosesser.

## Byggeklossene

### Modell og instruksjoner

Modellen står for tolkning, planlegging og valg. Instruksjonene definerer rolle, grenser, prioriteringer og hvordan uklarhet skal håndteres. De bør være korte nok til å bli fulgt og konkrete nok til å kunne testes.

### Kontekst

Kontekst er mer enn en lang prompt. Den består av oppgaven, repo-regler, relevante filer, tidligere beslutninger, eksempler, verktøybeskrivelser og fersk tilstand fra systemene agenten arbeider med. God kontekst er selektiv: riktig informasjon til riktig steg.

### Verktøy

Et godt agentverktøy gjør én ting tydelig, har et presist inputskjema, returnerer strukturerte resultater og skiller mellom lesing og skriving. Feilmeldinger må gi agenten nok informasjon til å korrigere seg. Kommandolinjeverktøy, API-er og MCP-servere fungerer godt når grensesnittet er forutsigbart.

### Tilstand og minne

Kortvarig tilstand holder styr på planen og observasjonene i én kjøring. Varig minne kan lagre preferanser, beslutninger eller læring på tvers av kjøringer. Varig minne må ha eierskap, levetid og mulighet for korrigering; ellers blir gamle antagelser usynlig teknisk gjeld.

### Orkestrering

Orkestrering styrer løkken, verktøykall, retry, tidsgrenser, delegering og stoppkriterier. Multi-agent-design er orkestrering med flere spesialiserte kontekster – ikke automatisk bedre intelligens.

## En modenhetsstige for delegering

1. **Assistent:** foreslår kode eller analyse; mennesket utfører handlingene.
2. **Overvåket agent:** kan lese, endre og teste innenfor et avgrenset arbeidsområde; risikable steg krever godkjenning.
3. **Avgrenset autonom agent:** kan fullføre veldefinerte oppgaver selvstendig i sandbox med målbare stoppkriterier.
4. **Orkestrert agentsystem:** flere agenter eller arbeidsstrømmer samarbeider, mens en kontrollmekanisme eier budsjett, tilgang og sluttverifikasjon.

Flytt bare oppover når målingene viser at mer autonomi gir bedre resultat enn mer styring.

## En robust utviklingsflyt

### 1. Definer kontrakten

Beskriv ønsket resultat, hva som ikke skal endres, tekniske begrensninger og hvordan løsningen skal verifiseres. «Forbedre autentiseringen» er for svakt. «Avvis utløpte tokens, bevar eksisterende API-kontrakt og legg til regresjonstester» kan kontrolleres.

### 2. La agenten undersøke før den skriver

Be agenten finne relevante filer, følge dataflyten og forklare eksisterende mønstre. Dette reduserer risikoen for at den bygger en parallell løsning fordi den ikke oppdaget den etablerte.

### 3. Gjennomgå planen ved høy risiko

Planen bør navngi komponenter, avveininger, verifikasjon og mulige migreringsbehov. Små, reversible endringer kan gjennomføres direkte; omfattende data-, sikkerhets- eller infrastrukturendringer fortjener et eksplisitt kontrollpunkt.

### 4. Arbeid i små verifiserbare steg

Bevar korte feedback-løkker. Kjør relevante tester etter hvert sammenhengende steg. Store, uverifiserte endringssett gjør feilårsaken vanskeligere å finne for både agent og menneske.

### 5. Krev uavhengig verifikasjon

Agentens egen forklaring er ikke bevis. Bruk kompilator, tester, linting, typekontroll, sikkerhetsskannere, nettlesertester og gjennomgang av diffen. For viktige endringer kan en separat agent eller person gjøre en review uten å ha sett implementasjonsdialogen.

### 6. Fang læring i repoet

Når et prosjekt har uventede regler, dokumenter dem i repo-instruksjoner, tester eller verktøy. Ikke gjør neste agent avhengig av at en gammel samtale fortsatt finnes.

## Evaluering: hvordan vet vi at agenten virker?

En agent må vurderes på både sluttresultat og forløp:

- **Oppgavefullføring:** Ble det faktisk levert et brukbart resultat?
- **Korrekthet:** Består deterministiske tester og faglige kontrollpunkter?
- **Verktøybruk:** Valgte agenten riktig verktøy med riktige parametere?
- **Sikkerhet og etterlevelse:** Holdt den seg innenfor instruksjoner og tilgang?
- **Effektivitet:** Hvor mye tid, tokens, verktøykall og menneskelig oppfølging krevdes?
- **Robusthet:** Fungerer den på variasjoner og kanttilfeller, ikke bare ett eksempel?

Bygg et representativt evalueringssett før du optimaliserer prompten. Kombiner kodebaserte sjekker, scenarioer, modellbasert gradering og menneskelig fagvurdering. Kjør evals igjen når modell, instruksjoner, verktøy eller kunnskapskilder endres.

## Sikkerhet og kontroll

Agentens skadepotensial bestemmes av hva den kan nå, ikke bare hvor høflig den er instruert.

- Bruk **minste privilegium** og separate identiteter for agenter.
- Begrens filsystem og nettverk med **sandbox og allowlists**.
- Hold hemmeligheter utenfor prompt, logger og arbeidskatalog når det er mulig.
- Krev eksplisitt godkjenning for irreversible handlinger, produksjon, betalinger og tilgangsendringer.
- Behandle nettsider, issues, dokumenter og verktøyresultater som potensielt fiendtlig input; prompt injection kan følge med konteksten.
- Logg verktøykall og beslutningsrelevant tilstand slik at hendelser kan undersøkes.
- Ha budsjett, tidsgrense, retry-grense og en tydelig måte å stoppe agenten på.

Mange godkjenningsdialoger gir ikke nødvendigvis mer sikkerhet. De kan skape godkjenningstretthet. Gode, teknisk håndhevede grenser er sterkere enn at et menneske ukritisk klikker «tillat» hele dagen.

## Vanlige feil

- Uklart mål og ingen akseptansekriterier.
- For mye irrelevant kontekst eller manglende prosjektregler.
- Verktøy med tvetydige navn og ustrukturerte svar.
- Agenten får lov til å endre testene som skulle bevise at implementasjonen er riktig.
- Multi-agent-oppsett brukes før én agent og et enkelt workflow er målt.
- «Det så riktig ut» erstatter regresjonstester og evals.
- Produksjonstilgang gis fordi sandkassen oppleves som upraktisk.

God agentisk utvikling er derfor fortsatt god software engineering: tydelige kontrakter, små endringer, automatiserte bevis, observability og ansvarlig endringskontroll.

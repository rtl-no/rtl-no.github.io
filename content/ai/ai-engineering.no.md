---
title: "AI engineering: fra prototype til produksjon"
translationKey: ai-engineering
eyebrow: "Komplett læringsløp"
summary: "En praktisk felthåndbok i de seks ferdighetene som ligger bak nyttige, forankrede, målbare og produksjonsklare AI-applikasjoner."
last_reviewed: "22. august 2026"
weight: 5
official_sources:
  - name: "AI Engineering Skills Map"
    description: "Andrew Ngs seksdelte kart for å bygge og produksjonssette AI-applikasjoner—utgangspunktet for denne utvidede guiden."
    url: "https://www.linkedin.com/pulse/ai-engineering-skills-map-building-deploying-applications-andrew-ng-gyn5e/"
  - name: "Machine Learning Crash Course"
    description: "Googles praktiske moduler om modeller, data, embeddings, LLM-er, produksjonssystemer og rettferdighet."
    url: "https://developers.google.com/machine-learning/crash-course"
  - name: "Building effective agents"
    description: "Anthropics skille mellom arbeidsflyter og agenter, med komponerbare arkitekturmønstre."
    url: "https://www.anthropic.com/engineering/building-effective-agents"
  - name: "OWASP Top 10 for GenAI-applikasjoner"
    description: "Aktuelle risikoer og tiltak for utvikling, produksjonssetting og drift av LLM-applikasjoner."
    url: "https://genai.owasp.org/llm-top-10/"
  - name: "NIST Generative AI Profile"
    description: "Et tillegg om generativ AI til NISTs rammeverk for risikostyring av AI."
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
---

## Hva AI engineering egentlig er

AI engineering er disiplinen for å bygge pålitelig programvare rundt komponenter med usikre resultater. En vanlig funksjon bør gi samme svar for samme inndata. En språkmodell kan formulere seg annerledes, overse en instruksjon eller velge et uventet verktøy selv om inndataene ser uendret ut. Ingeniøroppgaven er derfor ikke å gjøre modellen ufeilbarlig. Den er å designe et system som fortsatt er nyttig når modellen ikke er perfekt.

Andrew Ngs AI Engineering Skills Map peker ut seks ferdigheter som henger tett sammen:

1. **LLM-grunnlag** — forstå hva modellen kan og ikke kan gjøre.
2. **Grounding med data** — gi modellen riktig faktagrunnlag til riktig tid.
3. **Bygging av agentiske systemer** — la modeller velge og utføre nyttige handlinger.
4. **Evalueringsdrevet utvikling** — gjøre vag kvalitet om til målbar tilbakemelding.
5. **Drift i produksjon** — kontrollere pålitelighet, risiko, kostnad og forsinkelse i virkelig bruk.
6. **Grunnlag i maskinlæring** — resonnere systematisk om data, usikkerhet og generalisering.

Dette er ikke seks isolerte fag. De utgjør ett system med tilbakekobling:

```text
brukerbehov → kontekst → modellbeslutning → handling → kontroll → observasjon
      ↑                                                               │
      └──────────────── evaluering og forbedring ──────────────────────┘
```

De sterkeste løsningene legger et **deterministisk skall rundt en probabilistisk kjerne**. Kode håndterer tilganger, skjemaer, beregninger, forretningsregler og irreversible handlinger. Modeller håndterer tolkning, generering, klassifisering og planlegging der fleksibilitet har verdi. Evaluering forteller om denne arbeidsdelingen fungerer.

### Spørsmålene en AI engineer stiller

| Lag | Kjernespørsmål | Bevis på et godt svar |
|---|---|---|
| Produkt | Hvilket brukerresultat skal bli bedre? | En oppgave og et målbart suksesskriterium |
| Modell | Hvilken kapasitet og feilprofil passer? | En modellsammenligning på representative eksempler |
| Kontekst | Hva må modellen vite akkurat nå? | Relevans, ferskhet og kildehenvisninger |
| Handling | Hva får systemet lov til å gjøre? | Typede verktøy, tilganger og godkjenningsgrenser |
| Evaluering | Hvordan oppdager vi forbedring eller forverring? | Versjonerte datasett, kontrollmekanismer og feilanalyse |
| Drift | Kan vi kjøre trygt i stor skala? | Traces, varsler, budsjetter, rollback og hendelsesplaner |

Les guiden én gang fra start til slutt for å se hele systemet. Gå deretter tilbake til ferdigheten som begrenser prosjektet ditt akkurat nå.

## 1. LLM-grunnlag

### En modell predikerer tokens, ikke sannhet

En stor språkmodell gjør inndata om til tokens og predikerer gjentatte ganger en sannsynlighetsfordeling for neste token. Det velformulerte svaret er det synlige resultatet av denne sekvensen. Det er ikke et databaseoppslag og beviser ikke at modellen har kontrollert et faktum.

Denne mentale modellen forklarer flere egenskaper:

- Små endringer i ordvalg kan endre hvilken fortsettelse som blir sannsynlig.
- Et troverdig svar kan være feil fordi språklig selvsikkerhet ikke er det samme som faktasikkerhet.
- Nøyaktig tegntelling, regning og identifikatorer kan være skjørt fordi modellen arbeider med tokens.
- Verktøy og autoritativ kontekst kan virke bedre enn å be modellen huske.
- Strukturert output begrenser svarformen, men garanterer ikke at verdiene er riktige.

### Kontroller for generering

**Temperature** endrer hvor sterkt utvalget favoriserer de mest sannsynlige tokenene. Lavere verdier gir vanligvis mer konsistente svar; høyere verdier kan gi mer variasjon. **Top-p** avgrenser utvalget til en samlet sannsynlighetsmasse. Disse kontrollene påvirker variasjon, ikke kunnskap. Lavere temperature gjør ikke en udokumentert påstand til et verifisert faktum.

Velg innstilling etter oppgaven. Ekstraksjon, ruting og verktøyargumenter har nytte av konsistens og avgrensede skjemaer. Idéarbeid kan ha nytte av variasjon. For beslutninger med høy risiko må du bruke validering og bevis, ikke stole på en bestemt samplingsverdi.

### Kontekst er en begrenset arbeidsflate

Kontekstvinduet kan inneholde systeminstruksjoner, samtale, hentede dokumenter, verktøybeskrivelser og verktøyresultater. Mer kontekst er ikke automatisk bedre. Irrelevant materiale konkurrerer om oppmerksomheten, bruker tokens og kan introdusere motstridende instruksjoner.

Behandle kontekst som en konstruert ressurs:

1. Legg varige regler for oppførsel i instruksjonene med høyest prioritet.
2. Ta eksplisitt med gjeldende oppgave og akseptansekriterier.
3. Hent bare materiale som kan påvirke svaret.
4. Bevar opphav slik at påstander kan spores til kildene.
5. Oppsummer eller flytt gammel tilstand ut av konteksten i stedet for å beholde en ubegrenset historikk.
6. Mål om ekstra kontekst faktisk gir bedre eval-resultater.

Prompt-caching kan redusere kostnad og ventetid når et stabilt prefiks gjenbrukes. Modellens kunnskapsgrense er viktig for informasjon som endrer seg; ferske data må komme fra retrieval eller verktøy. Høyere reasoning-nivå kan hjelpe på vanskelige oppgaver, men bruker mer tid og beregning, og bør derfor velges bevisst.

### Match modellen med jobben

Ikke spør bare: «Hvilken modell er best?» Spør: «Hvilken modell er tilstrekkelig for dette trinnet innenfor kravene våre til kvalitet, ventetid, kostnad, personvern og drift?»

| Krav | Hva du bør teste |
|---|---|
| Resonnering | Suksess på vanskelige, representative oppgaver |
| Instruksjonsfølging | Gyldige skjemaer og overholdelse av begrensninger |
| Verktøybruk | Riktig valg, riktige argumenter og gjenoppretting etter feil |
| Multimodalitet | Ytelse på de faktiske bilde-, lyd- eller dokumentformatene |
| Hastighet | Tid til første token og samlet oppgavetid |
| Økonomi | Kostnad per vellykket oppgave, ikke bare per token |
| Styring | Datahåndtering, lagringstid, region og revisjonskrav |

En kapabel modell kan håndtere kompleks planlegging, mens en mindre modell utfører ruting eller ekstraksjon. En slik modellkaskade er bare verdifull hvis evaluering viser at ruteren tar gode valg og at totalsystemet blir enklere eller rimeligere.

### Prompting, retrieval, verktøy eller finjustering?

Bruk **prompting** for å tydeliggjøre oppgaven, grensene, eksemplene og svarformatet. Bruk **retrieval** når kunnskap endrer seg eller må dokumenteres. Bruk **verktøy** når systemet må beregne, spørre etter levende tilstand eller utføre en handling. Bruk **finjustering** når du trenger gjentatt oppførsel, stil eller oppgavemønster som instruksjoner og eksempler ikke leverer effektivt nok.

Finjustering er ikke det naturlige førstesvaret på manglende, oppdaterte fakta. Det introduserer et treningsdatasett, versjonering, utrulling og et nytt evalueringsproblem. Etabler en baseline først; ellers vet du ikke om tiltaket hjalp.

### Øvelse i modellgrunnlag

Velg én virkelig oppgave og lag 20 representative inndata. Test minst to modeller med samme prompt. Registrer oppgavesuksess, gyldig format, ventetid, input/output-tokens og feilkategori. Endre deretter bare én variabel—prompt, modell, kontekst eller reasoning-nivå—og kjør samme sett på nytt. Dette er starten på evalueringsdrevet utvikling.

## 2. Grounding med data

Grounding kobler modellens svar til informasjon utenfor modellparameterne. Målet er ikke å gi mest mulig informasjon, men å gi det **minste tilstrekkelige settet med troverdige bevis** for den aktuelle beslutningen.

### Tre måter å tilføre kunnskap på

1. **Prompt-kontekst:** legg en kompakt policy, post eller et dokument direkte inn. Det er enkelt og forutsigbart for små, stabile inndata.
2. **Retrieval:** søk i et større korpus og legg de beste kandidatene i konteksten. Dette passer for kunnskapsbaser og dokumentsamlinger.
3. **Verktøy:** la modellen spørre en database, et API, en søketjeneste eller en beregning ved behov. Dette passer for levende eller strukturerte data og lar tilgang autoriseres per kall.

Mange gode løsninger kombinerer alle tre. En stabil regel kan ligge i prompten, relevante håndbøker hentes fra en søkeindeks, og kundens nåværende ordrestatus leses med et verktøy.

### En retrieval-pipeline

Retrieval-augmented generation, eller RAG, er en pipeline og ikke en avkrysningsboks:

```text
kilde → les → normaliser → del opp → berik → indekser
spørring → omskriv/filtrer → hent → rerank → sett sammen → svar → siter
```

Hver pil er et mulig feilsted. En perfekt modell kan ikke sitere et avsnitt som parseren fjernet. En sterk retriever kan ikke kompensere for foreldede tilganger. Når svarene er svake, må du undersøke pipelinen trinn for trinn i stedet for å omskrive sluttprompten tilfeldig.

### Velg representasjon som passer spørsmålet

| Representasjon | Sterk når | Typisk svakhet |
|---|---|---|
| Nøkkelordsøk | Eksakte begreper, koder, navn og sjeldne fraser betyr mye | Mister omformuleringer og konseptuell likhet |
| Vektorsøk | Brukerne uttrykker samme idé på mange måter | Kan returnere beslektet tekst som ikke besvarer spørsmålet |
| Hybridsøk | Både eksakt og semantisk relevans er viktig | Mer kompleks rangering og tuning |
| Kunnskapsgraf | Relasjoner og koblinger over flere ledd står sentralt | Kostbar modellering og forvaltning |
| Semantisk lag over strukturerte data | Spørsmål skal kobles til styrte forretningsmål og poster | Krever tydelige skjemaer og definisjoner |
| Direkte API- eller databaseverktøy | Data er ferske, avgrensede og naturlig strukturerte | Verktøydesign, tilgang og feilhåndtering blir kritisk |

Vektorsøk er ikke automatisk standardvalget. Et produktnummer, lovavsnitt eller en feilidentifikator kan kreve leksikalsk søk. Numerisk aggregering bør vanligvis skje i kode eller en spørringsmotor, ikke gjennom likhetssøk. Bruk reranking når første retrieval har høy recall, men dårlig rekkefølge.

### Klargjør dokumenter for bruk, ikke bare lagring

God innlesing bevarer overskrifter, tabeller, sidereferanser, datoer, eierskap og tilgangsmerking. Delingsgrensene bør følge meningen i teksten når det er mulig. Svært små biter mister sammenheng; svært store biter svekker relevansen. Ta vare på originaldokumentet og en stabil identifikator, slik at en kildehenvisning kan føre tilbake til beviset.

Ferskhet trenger en eksplisitt policy:

- Hvilken hendelse utløser ny indeksering?
- Hvor raskt skal slettet innhold forsvinne?
- Kan én bruker hente dokumenter fra en annen?
- Hvilken kilde vinner når to dokumenter motsier hverandre?
- Hvordan kan eieren rette en feil?
- Kan systemet forklare hvilken versjon det brukte?

Tilgangskontroll må skje før eller under retrieval, ikke etter at modellen har sett teksten. Innhold som hentes, er også upålitelige inndata: Et dokument kan inneholde instruksjoner laget for å manipulere modellen. Skill data fra instruksjoner, begrens verktøy uavhengig og valider alle handlinger videre i kjeden.

### Evaluer grounding uavhengig av generering

Mål minst to lag:

- **Retrieval-kvalitet:** Inneholdt kandidatsettet de nødvendige bevisene? Mål recall ved *k*, rangeringskvalitet, korrekte tilganger og ferskhet.
- **Svarkvalitet:** Brukte svaret bevisene trofast, besvarte det spørsmålet og viste det til riktig avsnitt?

Et svar kan være feil fordi retrieval ikke fant kilden, fordi kontekstbyggingen kuttet den bort, eller fordi genereringen ignorerte den. Disse årsakene krever forskjellige tiltak.

### Øvelse i grounding

Velg 30 spørsmål til en liten dokumentsamling. Finn avsnittet som er nødvendig for å svare på hvert spørsmål. Bygg en baseline med nøkkelordsøk før du legger til vektor- eller hybridsøk. Registrer om riktig avsnitt finnes blant toppresultatene, og test deretter om svaret er tro mot kilden. Studer hvert bomskudd og merk det som feil i parsing, metadata, spørring, retrieval, rangering, kontekst eller generering.

## 3. Bygging av agentiske systemer

Et agentisk system lar en modell delta i valget av neste steg. Det kan være alt fra en fast arbeidsflyt med flere modellkall til en agentløkke som gjentatte ganger observerer tilstand, velger verktøy og tilpasser planen.

### Bruk minst mulig autonomi som løser oppgaven

| Nivå | Kontrollflyt | Godt bruksområde |
|---|---|---|
| Ett modellkall | Applikasjonskode | Én avgrenset transformasjon eller klassifisering |
| Kjedet arbeidsflyt | Forhåndsbestemte trinn | Stabil prosess med forståelige stadier |
| Ruter og spesialister | Klassifisering og spesialiserte spor | Tydelige kategorier eller kostnadsnivåer |
| Evaluator–optimizer | Generer, kritiser, forbedre | Kriteriene er tydelige og iterasjon hjelper |
| Agentløkke | Modellen velger neste handling | Veien kan ikke bestemmes på forhånd |
| Multiagent-orkestrering | Koordinator og isolerte arbeidere | Virkelig uavhengige kontekster eller parallelle undersøkelser |

Hvert trinn gir ekstra ventetid, kostnad og et nytt sted der feil kan forplante seg. Kompleksiteten må fortjene plassen sin gjennom et målbart bedre resultat.

### Agentløkken

En robust løkke trenger mer enn en smart systemprompt:

1. **Mål:** definer suksess, begrensninger og stoppkriterier.
2. **Tilstand:** behold planen, observasjonene og artefaktene som betyr noe.
3. **Valg:** la modellen velge en tillatt handling.
4. **Utføring:** kjør handlingen i et kontrollert miljø.
5. **Observasjon:** returner strukturert suksess eller en feil som kan rettes.
6. **Validering:** kontroller fremdrift med kode, regler, en annen modell eller et menneske.
7. **Stopp:** fullfør, be om en vurdering eller avslutt ved budsjettgrensen.

Miljøet bør levere grunnsannheten. En kodeagent kjører tester; en supportagent leser saksstatus; en research-agent åpner kilden. Å spørre modellen om den lyktes er svakere enn å kontrollere systemet den endret.

### Verktøy er agentens brukergrensesnitt

Et verktøy bør ha ett tydelig formål, typede inndata, avgrensede utdata og feil som gjør gjenoppretting mulig. Skill leseverktøy fra skriveverktøy. Foretrekk semantiske operasjoner som `hent_ordrestatus` fremfor et generisk databaseskall. Gjør farlige parametere vanskelige å angi ved et uhell.

Definer dette for hvert verktøy:

- hva det gjør, og når det skal brukes
- obligatoriske og valgfrie argumenter med eksempler
- tilganger og dataomfang
- idempotens og oppførsel ved retry
- mulige feil og hjelp til gjenoppretting
- om et menneske må godkjenne kjøringen
- hva som logges for senere undersøkelser

Verktøyprotokoller som MCP kan standardisere oppdagelse og kall, men en protokoll gjør ikke en utrygg kapasitet trygg. Identitet, autorisering, validering og revisjon er fortsatt applikasjonens ansvar.

### Minne og langvarig kontekst

Samtalehistorikk er ikke det samme som minnearkitektur. Skill mellom:

- **Arbeidstilstand:** fakta som trengs i den aktive kjøringen.
- **Episodisk historikk:** det som skjedde i tidligere oppgaver eller samtaler.
- **Semantisk minne:** varige preferanser, entiteter eller beslutninger.
- **Kildekunnskap:** autoritative dokumenter og poster som hentes ved behov.

Alt varig minne trenger opphav, en eier, utløpstid og en vei for retting. Hvis alle modelloppsummeringer lagres for alltid, får du selvsikre og utdaterte antakelser. For lange oppgaver bør strukturert tilstand og artefakter bevares; fortellende historikk bør bare oppsummeres når den har videre verdi.

### Sikkerhet er arkitektur

Guardrails bør finnes både før og etter modellen. Valider inndata, men anta at noen fiendtlige instruksjoner kommer inn gjennom brukere, nettsider eller hentede dokumenter. Avgrens uavhengig hvilke verktøy som kan kjøre, hvilke poster de kan lese og hvilke handlinger som trenger godkjenning. Valider modellens output før den brukes i HTML, SQL, shell-kommandoer, pengetransaksjoner eller tilgangsendringer.

Bruk sandbox, minste privilegium, allowlister, tidsgrenser, iterasjonsgrenser og kostnadsbudsjett. Hold hemmeligheter utenfor konteksten modellen kan se når det er mulig. Logg beslutninger og verktøykall uten å gjøre sensitive data til en ny lekkasjeflate.

### Øvelse i agentiske systemer

Implementer en tretrinns arbeidsflyt for en oppgave du kjenner godt: klassifiser, utfør et spesialisert steg og valider resultatet. Etabler en eval-baseline. Først da erstatter du den faste kontrollflyten med en agentløkke. Sammenlign fullføringsgrad, ventetid, kostnad, antall verktøyfeil og menneskelige inngrep. Behold agenten bare hvis fleksibiliteten gir målbar verdi.

## 4. Evalueringsdrevet utvikling

AI-utvikling blir systematisk når hver endring behandles som et eksperiment mot et stabilt sett eksempler. Uten evals reagerer teamet på den siste imponerende demoen eller den siste pinlige feilen. Ingen av dem er et representativt utvalg.

### Start med produktbeslutningen

«Svarkvalitet» er for vagt. Definer hva en bruker faktisk skal få gjort, og hvilke feil som er uakseptable. En supportassistent kan måles på riktig løsning, kildeforankrede påstander, etterlevelse av policy, god eskalering og tid til løsning. En kodeagent kan måles på beståtte tester, bevart oppførsel, kvaliteten på diffen og sikkerhet.

Bruk både **kapasitetsmål** og **begrensningsmål**. Systemet er ikke bedre hvis oppgavesuksessen stiger samtidig som alvorlig dataeksponering øker.

### Bygg et versjonert evalueringssett

Startsettet bør inneholde:

- vanlige saker med høyt volum
- vanskelige, men gyldige saker
- grensetilfeller og tvetydige forespørsler
- fiendtlige eller policysensitive saker
- historiske produksjonsfeil
- saker der riktig handling er å avstå eller be om hjelp

Lagre inndata, referansefakta, forventede egenskaper, vurderingsmetode og grunnen til at eksemplet finnes. Del eksemplene i et utviklingssett som brukes under iterasjon, og et holdout-sett som estimerer generalisering. Legg produksjonsfeil til etter at de er rettet, men ikke optimaliser hele løsningen for én anekdote.

### Velg riktig kontrollør

| Kontrollør | Best egnet til | Pass på |
|---|---|---|
| Deterministisk kode | Skjema, eksakte verdier, beregning, verktøyspor og tester | Kan avvise semantisk gyldige alternativer |
| Statistisk mål | Klassifisering, rangering og retrieval i stor skala | Målet samsvarer kanskje ikke med brukerverdien |
| Modell som dommer | Rubrikker for relevans, fullstendighet, tone og kildebruk | Posisjonsbias, egenpreferanse og inkonsistent resonnering |
| Fagekspert | Nyanser, sikkerhet, produktverdi og omstridte saker | Kostnad, tempo og uenighet mellom kontrollører |
| Brukerresultat | Løsning, aksept, retting eller gjenbruk | Andre påvirkningsfaktorer og treg tilbakemelding |

Kombiner kontrollører. Bruk kode overalt der korrekthet kan formuleres presist. Spar modell- eller menneskevurdering til kvaliteter som faktisk krever tolkning.

### Evaluer evaluatoren

En modelldommer er enda en probabilistisk komponent. Kalibrer den mot eksempler merket av mennesker. Varier svarrekkefølgen i sammenligninger, skjul irrelevante metadata og undersøk uenighet. Mål både feilaktig godkjenning og feilaktig avvisning, spesielt rundt sikkerhetsgrenser. Hvis dommeren ikke pålitelig skiller en meningsfull forbedring fra støy, bør den ikke styre en release gate alene.

### Feilanalyse styrer neste endring

Etter hver kjøring undersøker du feilene og lager en taksonomi. For eksempel:

- misforstått intensjon
- manglende eller motstridende kontekst
- retrieval-bom
- påstand uten støtte
- feil verktøy eller argumenter
- brudd på tilgang eller policy
- gyldig svar i ugyldig format
- ufullstendig stopp eller gjenoppretting
- uakseptabel ventetid eller kostnad

Tell kategoriene og prioriter etter hyppighet, alvor og hvor mulig de er å rette. Les traces for et utvalg vellykkede saker også; et riktig sluttsvar kan skjule en skjør vei.

Endre én hovedvariabel om gangen når det er mulig. Versjoner prompter, modeller, verktøyskjemaer, retrieval-innstillinger og datasett. Skriv hypotesen før sammenligningen kjøres. Løkken er:

```text
observer → merk feil → velg viktigste årsak → endre → evaluer → vurder
```

### Øvelse i evaluering

Lag et datasett med 50 saker for én funksjon. Skriv deterministiske kontroller for alt som kan sjekkes eksakt, og en kort rubrikk for øvrige kvaliteter. La to personer merke ti saker uavhengig av hverandre for å avdekke tvetydighet i rubrikken. Kjør en baseline, klassifiser feilene og forbedre bare den største handlingsbare kategorien.

## 5. Drift av AI-systemer i produksjon

En prototype beviser at den gode veien kan fungere. Produksjonsutvikling beviser at systemet forblir nyttig på tvers av ekte brukere, skiftende data, leverandørfeil, fiendtlige inndata og økonomiske rammer.

### En referanseflyt for produksjon

```text
klient
  → autentisering, kvoter og policy
  → orkestrering og kontekstbygging
  → modellgateway og verktøyutføring
  → output-validering og svar
  → traces, tilbakemelding, eval-utvalg og hendelsessignaler
```

Modellgatewayen samler modellversjoner, retry-policy, tidsgrenser, budsjetter og leverandørruting. Verktøykjøring bruker avgrensede identiteter. Output-validering hindrer at modelltekst blir behandlet som pålitelig kode eller data bare fordi den ser strukturert ut.

### Observer hele oppgaven

Tradisjonelle infrastrukturmål er fortsatt viktige: tilgjengelighet, feilrate, CPU, minne og nettverk. AI-systemer legger til semantiske og økonomiske signaler:

- fullførings- og eskaleringsgrad
- retrieval- og kildekvalitet
- policybrudd og blokkerte handlinger
- valg av verktøy, feil og retries
- input-, output- og reasoning-tokens
- tid til første token og ende-til-ende oppgavetid
- kostnad per forespørsel og per vellykket resultat
- versjon for modell, prompt, indeks og verktøy
- brukerretting, aksept og avbrudd

Bruk distribuerte traces til å koble brukerforespørsel, hentet kontekst, modellkall, verktøykall, validering og sluttresultat. Masker eller minimer sensitivt innhold. Logger må støtte feilsøking uten å bli en ukontrollert kopi av alle private samtaler.

### Bruk statistiske regresjonsporter

Lås versjoner når leverandøren støtter det. Behandle endring av modell, prompt, retrieval eller verktøybeskrivelse som en release. Kjør offline-evals og bruk deretter shadow-trafikk, canary eller en avgrenset brukergruppe for vesentlige endringer. Definer rollback-kriteriene før lansering.

Fordi output varierer, er én bestått kjøring svakt bevis. Gjenta stokastiske saker ved behov og sammenlign fordelinger, konfidensintervaller eller feiltall. Tilpass grundigheten til skadepotensialet: En skriveassistent og en automatisert vedtaksprosess trenger forskjellig dokumentasjon og menneskelig kontroll.

### Konstruer ventetid og kostnad som budsjett

Del oppgaven i komponenter. Retrieval, serielle modellkall, verktøyrunder og svarlengde gir alle ventetid. Vanlige optimaliseringer er:

- reduser irrelevant kontekst og svarlengde
- parallelliser arbeid som faktisk er uavhengig
- cache stabile prompt-prefikser og trygge retrieval-resultater
- rut enkle saker til en mindre modell
- erstatt modellarbeid med kode for deterministiske operasjoner
- slå sammen trinn bare når evals viser at kvaliteten holder
- stream tidlig output når det forbedrer brukeropplevelsen
- bruk batch eller asynkron behandling utenfor den interaktive veien

Optimaliser **kostnad per vellykket resultat**, ikke prisen på ett enkelt kall. En billig modell som skaper retries og menneskelig etterarbeid, kan være det dyre valget.

### Robusthet, drift og endring

Modellleverandører kan begrense kapasitet, feile eller endre oppførsel. Verktøy får timeout. Indekser blir utdaterte. Bygg eksplisitt feilhåndtering: begrenset retry med backoff, idempotensnøkler for skriving, circuit breakers, køer der de passer og en degradert modus som fortsatt er ærlig.

Overvåk drift i inndata, retrieval-kilder, modelloutput og brukeratferd. Hold en oversikt over modell- og dataavhengigheter. Kjør evals på nytt når noe endres, også tilsynelatende harmløse verktøybeskrivelser.

### Sikkerhet og hendelseshåndtering

Prompt injection er et confused-deputy-problem: Upålitelig innhold forsøker å påvirke et system med større myndighet. Ikke stol på at modellen gjenkjenner alle angrep. Begrens myndigheten utenfor prompten.

Forbered deg på lekkasje av sensitiv informasjon, endringer i leverandørkjeden, forgiftede data, utrygg behandling av output, for stor handlekraft, svakheter i vektorlagre, feilinformasjon og ubegrenset ressursbruk. For hver vesentlig risiko definerer du forebygging, oppdagelse, begrensning og gjenoppretting.

En hendelsesplan for AI bør svare på:

1. Hvordan slår vi raskt av et verktøy, en modellrute eller en funksjon?
2. Hvilke traces identifiserer berørte brukere og handlinger?
3. Hvordan tilbakekalles legitimasjon og datatilgang begrenses?
4. Hvilken trygg fallback kan fortsatt betjene brukerne?
5. Hvordan blir feilen en regresjonstest eller eval-sak?

### Øvelse i produksjonsdrift

Tegn forespørselsveien gjennom systemet og merk alle eksterne avhengigheter, tillitsgrenser og irreversible handlinger. Legg til tidsgrense, eier, måling og fallback for hver. Beregn et token- og ventetidsbudsjett per oppgave. Kjør en øvelse der retrieval er utdatert, modellleverandøren er utilgjengelig eller et verktøy returnerer delvis feil.

## 6. Grunnlag i maskinlæring

LLM-er erstatter ikke grunnleggende maskinlæring. De gjør dette grunnlaget mer nyttig fordi teamet må resonnere om usikre resultater gjennom hele produktet.

### Det grunnleggende læringsproblemet

I **veiledet læring** kobler eksempler inndata med ønsket etikett eller verdi. Klassifisering predikerer en kategori; regresjon predikerer et tall. **Ikke-veiledet læring** finner struktur uten merkede mål, som klynger eller representasjoner. **Forsterkende læring** lærer oppførsel fra belønning over handlinger og resultater. Moderne grunnmodeller kombinerer selvveiledet læring i stor skala med forskjellige teknikker for tilpasning og alignment.

Du trenger ikke trene en frontier-modell for å ha nytte av disse konseptene. Du må forstå hva dataene representerer, hvordan ytelse estimeres, og hvorfor et system som passer historiske eksempler, kan feile på nye.

### Generalisering, bias og varians

Del data slik at evalueringen representerer usette eksempler. Treningsytelse viser tilpasning til kjente eksempler; validering støtter utviklingsvalg; en holdout-test estimerer endelig generalisering. Hindre at duplikater, nesten-duplikater, fremtidig informasjon eller poster fra samme entitet lekker mellom datasettene.

**Høy bias** betyr at tilnærmingen er for begrenset eller undertrent: Både trening og validering er svake. **Høy varians** betyr at modellen har lært detaljer fra treningssettet som ikke overføres: Treningen ser sterk ut mens valideringen henger etter. Mer modellkompleksitet løser ikke alle problemer. Bedre data, egenskaper, regularisering eller en enklere oppgavedefinisjon kan bety mer.

### Måltall uttrykker en beslutning

Accuracy kan skjule alvorlige feil når klassene er ubalanserte. **Precision** spør hvor mange predikerte positive som var riktige. **Recall** spør hvor mange av de virkelige positive som ble funnet. Terskelen balanserer de to. For rangering og retrieval måler du om relevante elementer finnes, og hvor høyt de ligger. For tallprediksjoner undersøker du feilens størrelse og fordeling, ikke bare ett gjennomsnitt.

Velg mål ut fra kostnaden ved feil. Et spamfilter, en kreftscreening og en svindelundersøkelse har forskjellige konsekvenser av falske positive og falske negative. Undersøk alltid utsnitt: språk, kundegruppe, dokumenttype, kompleksitet eller andre dimensjoner knyttet til produktrisiko.

### Datakvalitet er modellkvalitet

Etiketter kan være inkonsistente, proxyvariabler kan kode historisk urettferdighet, og produksjonsdata kan avvike fra treningssettet. Dokumenter hvor data kom fra, hvem som kan bruke dem, hvordan de ble merket, og hvilken populasjon de representerer. Se etter manglende verdier, uteliggere, duplikater, lekkasje og tidsmessig drift.

Feilanalyse slår ofte et blindt søk etter en større modell. Ta et utvalg av feilene, grupper dem etter årsak, og avgjør om du bør forbedre data, representasjon, mål, modell, terskel eller produktflyt.

### Når klassisk maskinlæring er riktig verktøy

Bruk en språkmodell når ustrukturert språk, bred kunnskap eller fleksibel generering står sentralt. Bruk klassiske modeller eller deterministisk kode når inndata er strukturerte, målet er stabilt, ventetiden må være lav, forklaringer kreves eller et stort merket datasett gjør en fokusert prediktor effektiv. Mange produksjonssystemer kombinerer dem: En LLM trekker ut strukturerte egenskaper, en regelmotor håndhever policy og en spesialisert modell estimerer risiko.

### Øvelse i maskinlæring

Ta et datasett for binær klassifisering. Lag trenings-, validerings- og testsett uten lekkasje mellom entiteter eller tid. Bygg en enkel baseline, undersøk forvirringsmatrisen, velg terskel ut fra den reelle kostnaden ved falske positive og falske negative, og se på ytelsen i minst tre meningsfulle utsnitt. Skriv ned hvilken feilkategori du ville arbeidet med videre, og hvorfor.

## Slik virker de seks ferdighetene sammen

Tenk deg en intern supportassistent som kan svare på policyspørsmål og opprette en sak.

1. **LLM-grunnlag:** Velg en modell som følger instruksjoner og bruker verktøy pålitelig.
2. **Grounding:** Hent oppdaterte policyavsnitt med tilgangsfiltre og kildehenvisninger.
3. **Agentisk system:** Bruk en fast svarflyt; tillat et saksverktøy bare når brukeren ber om handling.
4. **Evaluering:** Test svarets korrekthet, kildestøtte, ruting, argumenter og avvisningstilfeller.
5. **Produksjon:** Spor forespørsler, masker sensitive felt, sett kostnadsgrenser og rull ut med canary.
6. **Maskinlæring:** Analyser feil etter forespørselstype, forstå precision/recall for ruting og overvåk datadrift.

Legg merke til hva som ikke delegeres til modellen. Autentisering etablerer identitet. Retrieval håndhever dokumenttilganger. Kode validerer skjemaet for saken. Saks-API-et autoriserer skrivingen. Modellen tolker intensjon og formulerer nyttig språk innenfor disse grensene.

### En beslutningsrekkefølge for nye funksjoner

1. Definer brukerresultatet og kostnaden ved feil.
2. Bygg den enkleste baselinen med ett modellkall.
3. Lag representative eval-saker før du legger til kompleksitet.
4. Legg til grounding hvis oppgaven trenger ekstern eller skiftende kunnskap.
5. Legg til verktøy hvis den trenger levende tilstand, beregning eller handling.
6. Legg til en arbeidsflyt eller agent bare når veien ikke kan forbli enkel.
7. Design tilganger, observerbarhet og rollback før produksjonstilgang.
8. Bruk produksjonsbevis til å forbedre eval-settet og systemet.

## Et tolvukers læringsløp

| Uker | Fokus | Leveranse |
|---|---|---|
| 1–2 | Tokens, generering, kontekst, strukturert output og modellvalg | En modellsammenligning på 20 saker med feilmerking |
| 3–4 | Parsing, oppdeling, nøkkelord/vektor/hybridsøk og kildehenvisninger | Et lite forankret spørsmål–svar-system med retrieval-evals |
| 5–6 | Verktøy, arbeidsflyter, agentløkker, tilstand og tilganger | En avgrenset agent med typede lese- og skriveverktøy |
| 7–8 | Eval-datasett, kontrollører, rubrikker og feilanalyse | En repeterbar evalueringskommando og eksperimentlogg |
| 9–10 | Tracing, utrulling, ventetid, kostnad, sikkerhet og hendelser | En produksjonsgjennomgang og feiløvelse |
| 11 | Generalisering, måltall, bias/varians og datakvalitet | En klassisk ML-baseline med analyse av utsnitt |
| 12 | Integrasjon | En capstone-demo, evalueringsrapport og operativ håndbok |

Ikke bruk tolv uker bare på å konsumere materiale. Hver uke bør produsere en artefakt som kan feile og undersøkes. Før en læringslogg med hypotese, eksperiment, resultat, feilkategorier og neste beslutning.

## Capstone: bygg en pålitelig domeneassistent

Velg et avgrenset domene med dokumenter du har lov til å bruke—for eksempel produktmanualer, offentlige forskrifter eller din egen prosjektdokumentasjon. Bygg en assistent som besvarer spørsmål, siterer bevis og utfører én reversibel handling gjennom et verktøy.

Sluttleveransen bør inneholde:

- en énsides produktkontrakt og risikovurdering
- en dokumentert data- og innlesingspipeline
- en enkel baseline og forklaring på hver ekstra komponent
- minst 75 versjonerte evalueringssaker
- separate resultater for retrieval, svar og verktøybruk
- tilganger, godkjenningspunkter og trusselscenarioer
- traces med dokumentert håndtering av sensitive data
- ventetid og kostnad ved p50 og p95
- en håndbok for utrulling, rollback og hendelser
- en feilanalyse som navngir de tre neste forbedringene

En polert demo er valgfri. Bevis er det ikke.

## Sjekkliste før produksjon

### Formål og eierskap

- Brukerresultatet og det systemet ikke skal gjøre, er skrevet ned.
- En navngitt eier kan endre, deaktivere og rulle tilbake funksjonen.
- Beslutninger med stor konsekvens har passende menneskelig kontroll.

### Data og kontekst

- Kilder, ferskhet og tilganger er synlige.
- Retrieval testes uavhengig av sluttsvaret.
- Oppførsel for sletting, retting og motstridende kilder er definert.

### Modeller og handlinger

- Modellvalget støttes av representative evals.
- Verktøyinndata er typet, validert og avgrenset til minste privilegium.
- Irreversible handlinger har sterkere kontroll enn lesing.

### Kvalitet og sikkerhet

- Eval-saker dekker normale, vanskelige, fiendtlige og avstående scenarioer.
- Release gates omfatter både kapasitet og sikkerhetsbegrensninger.
- Modellbaserte kontrollører er kalibrert mot menneskelig vurdering.

### Drift

- Traces kobler kontekst, modellkall, verktøy og resultater.
- Budsjetter for kostnad, ventetid, feil og semantisk kvalitet har varsler.
- Leverandørfeil, prompt injection og verktøymisbruk har testede tiltak.
- Alle produksjonshendelser kan bli en regresjonssak.

## Kompakt ordliste

- **Agent:** et system der en modell dynamisk kan velge handlinger og verktøy.
- **Embedding:** en numerisk representasjon som brukes til å sammenligne eller modellere mening og likhet.
- **Eval:** en repeterbar måling av systemets oppførsel på bestemte saker.
- **Grounding:** å koble generering eller beslutninger til eksterne bevis eller tilstand.
- **Hallusinasjon:** generert innhold som ikke har tilstrekkelig støtte i sannhet eller fremlagte bevis.
- **Inferens:** å kjøre en trent modell for å produsere en prediksjon eller output.
- **LLM-as-a-judge:** å bruke en modell til å vurdere et annet systems output mot en rubrikk.
- **RAG:** å hente ekstern informasjon og legge den i konteksten for generering.
- **Reranker:** en modell eller algoritme som sorterer hentede kandidater på nytt etter relevans.
- **Semantisk lag:** styrte definisjoner som kobler forretningsbegreper til strukturerte data.
- **Tool calling:** modellen produserer strukturerte argumenter som ber om en ekstern operasjon.
- **Trace:** en sammenhengende logg over trinnene, kallene og observasjonene i én oppgave.

## Den varige lærdommen

Sentrum i AI engineering er verken prompten eller agentrammeverket. Det er læringsløkken rundt systemet. Bygg den minste nyttige versjonen, observer virkelige feil, klassifiser dem, endre komponenten som forårsaket dem, og bevis at resultatet ble bedre uten å bryte en begrensning. Den disiplinen er måten upålitelige komponenter blir en del av pålitelige produkter.

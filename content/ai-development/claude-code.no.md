---
title: "Anthropic Claude Code"
translationKey: ai-claude-code
eyebrow: "Coding agent"
summary: "En praktisk guide til Claude Code: CLAUDE.md, explore–plan–code, subagenter, hooks, MCP, tillatelser, sandbox og verifisering."
last_reviewed: "13. juli 2026"
weight: 30
official_sources:
  - name: "Claude Code"
    description: "Anthropics produkt- og dokumentasjonsinngang til Claude Code."
    url: "https://www.anthropic.com/product/claude-code"
  - name: "Claude Code best practices"
    description: "Anthropics mønstre for kontekst, planlegging, testing og git-arbeidsflyt."
    url: "https://www.anthropic.com/engineering/claude-code-best-practices"
  - name: "Claude Code documentation"
    description: "Teknisk dokumentasjon for oppsett, konfigurasjon og integrasjoner."
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
  - name: "Claude Code sandboxing"
    description: "Hvordan filsystem- og nettverksgrenser reduserer risiko og godkjenningstretthet."
    url: "https://www.anthropic.com/engineering/claude-code-sandboxing"
---

## Hva Claude Code er

Claude Code er Anthropics agentiske kodesystem. Det kan lese en kodebase, planlegge arbeid på tvers av filer, gjøre endringer, kjøre kommandoer og tester, tolke resultatene og iterere. Terminalen er en sentral arbeidsflate, men Claude Code finnes også i andre integrasjoner og kan brukes i webbaserte eller automatiserte arbeidsflyter.

Claude Code er bevisst fleksibelt. Det betyr at verktøyet ikke tvinger alle inn i én metode, men også at teamet må etablere egne regler for kontekst, tillatelser og kvalitet.

## CLAUDE.md som prosjektbrief

`CLAUDE.md` lastes inn som varig prosjektkontekst. Den bør hjelpe Claude med å ta riktige valg uten å måtte gjenoppdage det samme i hver samtale.

Nyttig innhold er:

- bygg-, test- og formatteringskommandoer
- oversikt over sentrale mapper og arkitekturgrenser
- kodekonvensjoner og forventet feilhåndtering
- regler for databaseendringer og API-kompatibilitet
- områder som er sensitive eller ikke skal endres
- krav til verifikasjon og hva «ferdig» betyr

Hold filen presis og rediger den når agenten gjentatte ganger misforstår samme del av prosjektet. Personlige, midlertidige preferanser bør ikke blandes inn i en felles prosjektfil.

## Explore → plan → code → verify

Anthropic anbefaler et mønster der agenten først undersøker, så planlegger og deretter implementerer.

### Explore

Be Claude lese relevante filer, søke etter tilsvarende implementasjoner og forklare dataflyten uten å skrive kode. Dette bygger en felles situasjonsforståelse og avslører tidlig om oppgaven er feil avgrenset.

### Plan

Planen skal være mer enn en todo-liste. Den bør beskrive hvilke komponenter som endres, viktige avveininger, risiko og hvordan hvert krav skal verifiseres. Bruk planmodus eller en eksplisitt planfase når endringen er omfattende.

### Code

La Claude gjennomføre planen i sammenhengende, små steg. Be den følge eksisterende mønstre og unngå refaktorering utenfor oppgaven. For godt testbare problemer er test-først effektivt: skriv en test som feiler, bekreft feilen, implementer uten å svekke testen, og iterer til den passerer.

### Verify

Kjør relevante tester, bygg og statiske kontroller. Gjennomgå diffen og kontroller observerbar oppførsel. En vellykket kommando er bare ett bevis; det sier ikke automatisk at alle krav er møtt.

## Skills, commands, hooks og plugins

Claude Code kan få gjenbrukbare arbeidsmåter og automatiske kontrollpunkter:

- **Skills** samler instrukser og ressurser for en bestemt type oppgave.
- **Commands** gjør ofte brukte operasjoner enkle å starte på samme måte.
- **Hooks** kjører deterministiske handlinger ved bestemte hendelser, for eksempel formattering eller policykontroll.
- **Plugins** kan pakke utvidelser og teamstandarder for distribusjon.
- **MCP** gir strukturerte koblinger til eksterne verktøy og datakilder.

Bruk modellinstruksjoner for vurderinger og hooks for regler som alltid skal håndheves. «Husk å formatere» er svakere enn en formatter som faktisk kjøres.

## Subagenter og agent teams

En subagent får en egen kontekst og en avgrenset oppgave. Det er nyttig for parallell research, sikkerhetsreview, testanalyse eller arbeid i uavhengige komponenter. Det kan også beskytte hovedkonteksten mot store mengder mellomresultater.

Gode subagent-oppgaver har:

- ett tydelig spørsmål eller leveranse
- eksplisitt avgrensning og relevante verktøy
- et avtalt format for funn
- ingen overlappende filskriving med andre agenter

Flere agenter øker koordinasjonskostnaden. Bruk dem når oppgavene faktisk kan løses uavhengig, ikke som standard for alt som virker komplisert.

## MCP og eksterne systemer

Model Context Protocol lar Claude bruke verktøy fra tjenester som GitHub, databaser, observability-plattformer og interne API-er. Et MCP-verktøy bør ha et smalt formål, tydelige parametere, lesbare feil og minst mulig tilgang.

Skill mellom read- og write-operasjoner. En agent som trenger å analysere produksjonslogger trenger sjelden tillatelse til å endre produksjonsmiljøet. Tenk også på data som returneres fra eksterne systemer som ubetrodd kontekst.

## Tillatelser, sandbox og autonomi

Claude Code bruker tillatelser for handlinger som kan endre systemet. Godkjenninger gir menneskelig kontroll, men mange dialoger kan skape godkjenningstretthet. Sandboxing gir sterkere, tekniske grenser ved å avgrense filsystem og nettverk.

Et praktisk oppsett er:

1. Gi fri lesing og skriving i det aktuelle repoet.
2. Tillat trygge, reversible utviklerkommandoer.
3. Begrens nettverk til nødvendige domener.
4. Hold hemmeligheter og andre arbeidsområder utenfor rekkevidde.
5. Krev godkjenning for produksjon, publisering, sletting og tilgangsendringer.

Flagg eller innstillinger som hopper over alle tillatelser fjerner et viktig sikkerhetslag. De bør ikke være en snarvei i et vanlig utviklingsmiljø.

## Kontekststyring

Lange økter samler både nyttig og utdatert informasjon. Oppsummer beslutninger, rydd kontekst når oppgaven skifter, og del store problemer i tydelige faser. Bevar varig kunnskap i repoet, ikke bare i samtalen.

Når Claude går i feil retning, er det ofte bedre å stoppe, forklare avviket og gi oppdatert kontekst enn å bygge stadig flere korrigerende prompts på toppen av en feil antagelse.

## Claude Code og Codex

Begge er agenter som kan undersøke kode, redigere filer og bruke verktøy. Begge blir bedre av klare mål, repo-instruksjoner, korte feedback-løkker og streng verifisering. Forskjellene ligger blant annet i arbeidsflater, modeller, konfigurasjon og utvidelsesmekanismer.

Ikke kopier konfigurasjonsnavn blindt mellom dem: `CLAUDE.md` og `AGENTS.md` har beslektede formål, men tilhører ulike verktøy. Et modent repo kan støtte begge ved å holde de viktigste sannhetene i ordinær dokumentasjon, tester og automatisering, og bruke agentfilene som korte innganger.

## Hva mennesket fortsatt eier

Claude kan foreslå arkitektur og gjennomføre store deler av implementasjonen, men mennesket eier problemdefinisjon, risikovurdering, tilgangsmodell, produktavveininger og beslutningen om å sette noe i produksjon. Høy agentaktivitet er ikke det samme som høy verdi; mål resultat, kvalitet og redusert gjennomløpstid.

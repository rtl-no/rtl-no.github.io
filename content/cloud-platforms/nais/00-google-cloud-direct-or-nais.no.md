---
title: "Google Cloud direkte eller gjennom NAIS?"
translationKey: nais-vs-google-cloud
module: "Guide"
weight: 5
track: "Beslutningsguide"
duration: "35 min"
level: "Grunnleggende → arkitektur"
summary: "Sammenlign utvikleropplevelse, ansvar, support, fleksibilitet og feiloppførsel når et produktteam bruker Google Cloud direkte eller gjennom NAIS."
topics: ["Gevinster og kompromisser", "Ansvar og support", "Feilscenarier for PostgreSQL"]
last_reviewed: "22. august 2026"
outcomes:
  - "Forklare hva NAIS tilfører oppå Google Cloud"
  - "Velge mellom en støttet NAIS-kapabilitet og direkte bruk av Google Cloud"
  - "Fordele ansvar mellom produktteam, plattform og leverandør"
  - "Beskrive hva som skjer ved vanlige feil i Cloud SQL for PostgreSQL"
next: { url: "/cloud-platforms/nais/01-platform-model/", label: "Neste: plattformmodell og arkitektur" }
---

## Kort svar

NAIS er ikke en konkurrerende sky ved siden av Google Cloud. Det er en **applikasjonsplattform på et høyere abstraksjonsnivå** som bruker Google Kubernetes Engine og utvalgte administrerte tjenester under. Valget er derfor vanligvis ikke «NAIS eller Google». Det er:

- Skal produktteamet sette sammen og drifte Google Cloud-oppsettet gjennom skyens egne API-er og verktøy?
- Eller skal teamet bruke en støttet NAIS-kontrakt mens plattformteamet håndterer vanlig sky- og Kubernetes-engineering?

NAIS gir teamet en paved road: sikker runtime, deklarativ deployment, identitetsintegrasjoner, trafikkontroll, secrets, observability og selvbetjente datatjenester. Til gjengjeld bruker teamet kapabilitetene, konvensjonene og konfigurasjonsflaten som plattformen støtter.

Abstraksjonen flytter driftsarbeid til plattformlaget. Den **flytter ikke eierskapet til produktet, brukerne eller dataene** bort fra produktteamet.

## Hva de to alternativene betyr

### Google Cloud direkte

«Direkte» betyr at teamet eller skyorganisasjonen primært arbeider med Google Cloud-prosjekter, IAM, VPC, GKE eller en annen runtime, Cloud SQL og andre tjenester gjennom Terraform, Google Cloud-API-er, `gcloud` eller Cloud Console. Organisasjonen kan fortsatt tilby landing zones, policy og en sentral supportavtale, men teamet må utforme en større del av applikasjonsplattformen selv.

### Google Cloud gjennom NAIS

Teamet arbeider primært med et NAIS-team, applikasjonsmanifest, NAIS Console, støttede leveringsactions og plattform-API-er. NAIS-operators oversetter ønsket tilstand til Kubernetes- og skyressurser og reconciler støttede innstillinger kontinuerlig.

Hvert NAIS-skymiljø kjører på GKE. Et team har et namespace i hvert miljø og et dedikert Google Cloud-prosjekt for hvert miljø. Utvalgte ressurser, som Cloud SQL-databaser og Cloud Storage-buckets, provisioneres i teamprosjektet for det tilsvarende miljøet. Google Cloud-ressursene finnes fortsatt; NAIS endrer det normale grensesnittet og ansvarsgrensen.

Bruk av NAIS utelukker ikke all direkte bruk av Google Cloud. Et team kan få direkte tilgang til en begrunnet kapabilitet, men ressursen må da få en eksplisitt eier og driftsmodell. Ikke anta at NAIS-teamet støtter en skyressurs bare fordi den deler prosjekt med ressurser provisionert av NAIS.

## Sammenligning side ved side

| Tema | Google Cloud direkte | Google Cloud gjennom NAIS |
|---|---|---|
| Primært grensesnitt | Google-API-er, Terraform, `gcloud` og Cloud Console | NAIS-manifester, Console, CLI, API-er og støttede GitHub Actions |
| Runtime | Teamet velger og konfigurerer GKE, Cloud Run, Compute Engine eller en annen tjeneste | Applications og jobs kjører gjennom støttede NAIS-kontrakter, normalt på GKE |
| Kubernetes | Organisasjonen må utforme clusters, oppgraderinger, controllers, namespaces, policy og integrasjoner | Plattformteamet drifter clusters, controllers og den støttede workload-abstraksjonen |
| Identitet | Teamet setter sammen cloud IAM og applikasjonens identitetsflyter | NAIS integrerer workload identity og vanlige norske identitetstilbydere som ID-porten, TokenX og Maskinporten, samt Entra ID |
| Nettverkstilgang | Teamet utformer VPC, firewall policy, load balancing, DNS og tjenestekoblinger | Vanlig ingress og eksplisitte access policies eksponeres gjennom NAIS-kontrakten |
| Deployment | Teamet bygger sin egen vei for artifacts, rollout, policy og deployment | Støttede actions og NAIS-deployment gir en standardisert vei til runtime |
| Secrets | Teamet velger og integrerer Secret Manager eller et annet secret-system | Plattformleverte credentials injiseres automatisk; teamet håndterer egne applikasjonssecrets gjennom støttede grensesnitt |
| Datatjenester | Teamet oppretter og forvalter enhver godkjent Google Cloud-datatjeneste | NAIS gir selvbetjening for et utvalg, blant annet Cloud SQL, buckets og BigQuery |
| Observability | Teamet velger, kobler sammen og drifter logging, metrics, tracing, dashboards og varsler | NAIS tilbyr felles logging, metrics, traces og plattformintegrerte observability-verktøy |
| Sikkerhetsgrunnlag | Skyorganisasjonen og teamet må implementere og verifisere det | NAIS leverer støttede defaults og guardrails; teamet eier fortsatt applikasjons- og datasikkerhet |
| Fleksibilitet | Bred Google Cloud-katalog og detaljert konfigurasjon | Raskere vanlig vei, men mindre støttet katalog og konfigurasjonsflate |
| Support | Organisasjonen må definere plattformeierskap og veien til Google-support | NAIS støtter plattformkontrakten; produktteamet støtter produktet; leverandørene drifter sine administrerte tjenester |
| Portabilitet | Bruker Google-spesifikke API-er og arkitektur direkte | Legger til en NAIS-spesifikk applikasjonskontrakt, men avhenger fortsatt av Kubernetes og leverandørtjenester under |
| Kostnad | Skyforbruk pluss engineering for å bygge og drifte plattformen | Skyforbruket består; vanlig plattformarbeid deles, mens noen robuste valg koster mer |

## Hva et produktteam får fra NAIS

### Mindre udifferensiert plattformarbeid

Teamet trenger ikke bygge en Kubernetes-applikasjonsplattform før det kan levere applikasjonen. Cluster-controllers, felles policy, workload identity, ingress-integrasjon, credentials og telemetriveier leveres som ett sammenhengende produkt.

### Konsistente og gjennomgåtte defaults

Den samme plattformkontrakten kan brukes på tvers av team og miljøer. Vanlige mønstre for sikkerhet, personvern og drift kan vurderes sentralt og forbedres uten at hvert team lager sin egen implementasjon.

### Raskere selvbetjening

En workload og støttede ressurser bestilles deklarativt. Deklarasjonen kan versjoneres, gjennomgås og reconciles. Teamet bruker mindre tid på manuelle infrastruktursaker eller på å koble sammen skytjenester.

### Integrert identitet for norsk offentlig sektor

NAIS har dokumenterte mønstre for ansatt-, innbygger- og maskinidentitet gjennom Entra ID, ID-porten, TokenX og Maskinporten. Applikasjonen må fortsatt gjøre riktige faglige autorisasjonsvalg, men protokollen og plattformintegrasjonen standardiseres.

### En grense for plattformsupport

NAIS-teamet eier delt runtime, plattform-operators, støttede integrasjoner, dokumentasjon og plattformsupport. Produktteam kan eskalere dokumenterte plattformfeil uten at hvert team blir ekspert på alle underliggende komponenter.

## Hva NAIS ikke gir teamet

NAIS er ikke utkontraktert produktdrift. Plattformen avgjør ikke:

- om tjenesten virker riktig for brukerne;
- applikasjonsarkitektur, kodekvalitet eller faglig autorisasjon;
- hvilke data som kan lagres, hvor lenge de beholdes eller om behandlingen er lovlig;
- skjemadesign, query-oppførsel, størrelse på connection pools eller trygge migreringer;
- produktets mål for tilgjengelighet, latency, RPO og RTO;
- om en backup kan gjenopprette hele fagtjenesten i tide;
- hvordan produktet kommuniserer med brukere under en hendelse; eller
- om en ikke-støttet skykapabilitet er trygg, lovlig og mulig å drifte.

NAIS fjerner heller ikke feilmønstre i Google Cloud. En Cloud SQL-database provisionert gjennom NAIS er fortsatt Cloud SQL. Regioner, soner, vedlikehold, kvoter, connection limits, tjenestetilgjengelighet og leverandørhendelser påvirker fortsatt produktet.

## Ansvar og support

| Område | Produktteam | NAIS-plattformteam | Google eller annen leverandør |
|---|---|---|---|
| Applikasjonsoppførsel | Eier kode, konfigurasjon, SLO-er, varsler og brukerkonsekvens | Leverer workload-kontrakt og plattformsignaler | — |
| Delt runtime | Bruker den riktig og rapporterer evidens | Drifter clusters, operators og støttede plattformkomponenter | Drifter underliggende skyinfrastruktur der det gjelder |
| Data | Eier formål, klassifisering, skjema, livssyklus, tilgang og recovery-krav | Provisionerer støttede tjenester etter deklarasjonen og gir verktøy/dokumentasjon | Drifter den administrerte lagringstjenesten |
| Hendelseshåndtering | Førstelinje ved produktpåvirkning; reduserer konsekvens og kommuniserer | Responderer når evidens peker mot NAIS og koordinerer egne komponenter | Responderer gjennom organisasjonens supportavtale med leverandøren |
| Disaster recovery | Definerer RPO/RTO, velger konfigurasjon og verifiserer gjenopprettet produkt | Leverer støttede grensesnitt og plattformprosedyrer | Leverer tjenestens recovery-mekanismer og infrastruktur |
| Kostnad | Eier produktets etterspørsel, bestilte størrelser og ineffektiv bruk | Drifter delt plattformkapasitet og eksponerer støttede kontroller | Fakturerer for brukte tjenester |

Den konkrete supportkanalen, vaktordningen og veien for leverandøreeskalering er tenant- og organisasjonsspesifikk. Offentlig NAIS-dokumentasjon etablerer ansvarsgrensen, men lover ikke én universell Slack-kanal eller responstid. En produksjonstjeneste må ha en lokal runbook som navngir:

1. produktteamets vakt- eller supportkanal;
2. NAIS-kanalen for support og hendelser i den aktuelle tenanten;
3. hvem som kan opprette en sak hos leverandøren;
4. alvorlighetsgrader og forventede responstider; og
5. hvem som eier brukerkommunikasjon og recovery-beslutningen.

### Praktisk eskaleringsflyt

1. **Produktteamet oppdager brukerpåvirkning.** Sjekk applikasjonsendringer, logger, metrics, database connections, kvoter og avhengigheter.
2. **Klassifiser sannsynlig feilområde.** En ugyldig migrering eller oppbrukt connection pool er noe annet enn en NAIS-operator som ikke kan reconcile eller en bekreftet Cloud SQL-hendelse.
3. **Reduser produktpåvirkningen.** Rull tilbake, reduser last, skru av en funksjon eller degrader trygt der det er mulig. Ikke vent på endelig skyldplassering før brukerne beskyttes.
4. **Eskaler med evidens.** Ta med tenant, team, miljø, applikasjon, ressurs, tidspunkt, endringshistorikk, symptomer, dashboards og correlation IDs.
5. **Behold produkteierskapet.** Selv når NAIS eller Google reparerer infrastruktur, verifiserer produktteamet korrekthet, avstemmer tapt arbeid og avslutter brukerkommunikasjonen.

## PostgreSQL: Hva skjer når databasen er nede?

Denne delen beskriver **Cloud SQL for PostgreSQL bestilt gjennom `spec.gcp.sqlInstances`**, som NAIS for tiden anbefaler for en ny PostgreSQL-database. En separat NAIS-driftet PostgreSQL-ressurs har egen konfigurasjon og livssyklus; ikke bland de to feilmodellene i samme runbook.

### Først: «nede» er et symptom, ikke en diagnose

En applikasjon kan få feil mot databasen på grunn av:

- feil i instans, sone, region eller nettverksvei;
- planlagt vedlikehold eller restart av instansen;
- oppbrukte database connections, CPU, minne eller lagring;
- ugyldige credentials eller tilgangskonfigurasjon;
- locks, trege queries eller en utrygg skjemamigrering; eller
- slettede eller logisk korrupte data.

Responsen er forskjellig i hvert tilfelle. Start med applikasjons- og databasesignaler i stedet for å anta en leverandørhendelse.

### Scenario 1: Feil i instans eller sone med high availability

NAIS eksponerer Cloud SQL high availability gjennom `highAvailability: true`. Cloud SQL holder da en primary og standby i ulike soner i samme region, med synkron diskreplikering.

Hvis primary-instansen eller sonen slutter å svare:

1. Cloud SQL oppdager manglende health heartbeats.
2. Standby blir automatisk ny primary.
3. Eksisterende database connections lukkes.
4. Applikasjonen kobler til igjen med samme connection string eller IP-adresse.
5. Cloud SQL bygger opp ny standby-kapasitet etter at instansen eller sonen er tilbake.

Google oppgir at instansen vanligvis er utilgjengelig i omtrent 60 sekunder under failover, men tiden varierer. Applikasjonen må bruke avgrenset connection timeout, prøve midlertidige tilkoblingsfeil igjen med backoff og gjøre operasjoner idempotente når retry kan gi duplikater. Readiness og trygg degradering bør hindre at enhver utilgjengelig databaseforbindelse blir en ukontrollert restart-storm.

HA reduserer nedetid ved feil i instans eller sone. Det betyr ikke null nedetid.

### Scenario 2: Uten high availability

`highAvailability` er valgfritt i NAIS-spesifikasjonen. Et team må ikke anta at provisionering av Cloud SQL automatisk gir en standby i en annen sone.

For en standalone-instans gjenoppretter ikke Cloud SQL databasen automatisk i en frisk sone etter en sonefeil. Recovery kan kreve point-in-time recovery til en ny instans eller promotion av en separat konfigurert replica. Klienter kan deretter trenge ny adresse eller nytt connection name. Oppnåelig RTO og RPO avhenger av konfigurasjon som ble valgt **før** hendelsen.

### Scenario 3: Hele regionen er utilgjengelig

Vanlig Cloud SQL HA er regional: primary og standby ligger i ulike soner i samme region. Det holder ikke databasen tilgjengelig når hele regionen er utilgjengelig.

Et strengere kontinuitetskrav trenger et design på tvers av regioner, for eksempel en utpekt disaster-recovery-replica, samt en eksplisitt beslutnings- og promotion-prosedyre. Replikering på tvers av regioner er asynkron, så nylig committede transaksjoner kan mangle i recovery-regionen. Produktteamet må avgjøre om kostnaden, driftskompleksiteten og mulig RPO over null er berettiget.

### Scenario 4: Utilsiktet sletting eller dårlig migrering

Failover reparerer ikke en logisk feil. En destruktiv statement eller dårlig migrering kan replikeres til standby. Recovery avhenger da av backups, point-in-time recovery, replay og faglig avstemming.

For Cloud SQL provisionert av NAIS:

- kjører automatiske backups hver natt som standard, og sju backups beholdes som standard;
- kan point-in-time recovery aktiveres, men det blir ikke aktivert bare ved å bestille en database; og
- beskriver NAIS-dokumentasjonen en ekstra daglig on-premises disaster backup for katastrofal feil i GCP.

En backup viser at recovery-materiale kan finnes – ikke at produktet møter RTO. Teamet må teste restore, database-credentials, applikasjonsutrulling, event replay og verifikasjon av fagdata.

### Scenario 5: Metning ser ut som nedetid

Anta at seks applikasjonsreplikaer tillater en pool med 30 database connections hver. De kan kreve 180 connections før vedlikeholdsverktøy og operasjonell margin er regnet med. En rolling deployment legger midlertidig til replikaer og kan gjøre toppen høyere.

NAIS kan deploye og skalere workloaden, men kan ikke utlede et trygt samlet connection budget. Produktteamet må samordne:

- grenser for antall applikasjonsreplikaer;
- pool-størrelse og acquisition timeout per replika;
- Cloud SQL-tier og maksimalt antall connections;
- query latency, locks og transaksjonsvarighet; og
- oppførsel ved overlast når kapasiteten er brukt opp.

Dette er vanligvis en kapasitetsfeil i produktet, selv om brukerne opplever at «databasen er nede».

## Én tjeneste, implementert på to måter

Tenk deg et API som autentiserer innbyggere, lagrer saksstatus i PostgreSQL og eksponerer signaler for tilgjengelighet og latency.

### Direkte Google Cloud-design

Organisasjonen velger og konfigurerer runtime, project IAM, workload identity, VPC-koblinger, ingress, sertifikater, DNS, secrets, Cloud SQL, HA, backups, observability, deployment, policy og veien til leverandørsupport. Det gir bred kontroll, men produktet trenger plattformkompetanse eller en separat intern plattform.

### NAIS-design

Teamet deklarerer en Application, ingress og access policies, velger støttet identitetsflyt, bestiller Cloud SQL-innstillinger og deployer gjennom den støttede veien. NAIS oppretter og reconciler Kubernetes-ressursene og støttede skyintegrasjoner. Teamet konsentrerer seg om applikasjonsoppførsel, autorisasjon, skjema, databasekonfigurasjon, SLO-er, varsler og recovery-testing.

Det andre designet har færre plattformkomponenter eid av teamet. Det har **ikke** færre produktansvar.

## Slik velger du

Foretrekk den støttede NAIS-veien når:

- workloaden og tjenestene passer plattformkontrakten;
- vanlige mønstre for sikkerhet, identitet, levering og observability dekker behovet;
- rask og konsistent selvbetjening er viktigere enn detaljert skreddersøm; og
- teamet ønsker delt plattformkompetanse samtidig som det beholder produkteierskapet.

Vurder direkte Google Cloud-tilgang når:

- en nødvendig kapabilitet eller topologi ikke støttes av NAIS;
- teamet trenger en leverandørfunksjon eller kontroll som NAIS-kontrakten bevisst skjuler;
- workloaden selv er plattforminfrastruktur og ikke en vanlig applikasjon; eller
- organisasjonen eksplisitt har akseptert ekstra ansvar for sikkerhet, etterlevelse, kostnad, livssyklus og support.

Direkte tilgang bør være en arkitekturbeslutning, ikke en nødutgang som brukes før støttede plattformkapabiliteter er undersøkt.

## Sjekkliste før produksjonsvalg

Svar på dette før du velger vei:

1. Hvilken runtime og hvilke administrerte tjenester trenger produktet?
2. Støtter NAIS den nødvendige konfigurasjonen og miljøene?
3. Hvilke komponenter skal produktteamet drifte direkte?
4. Hvem eier applikasjons-, plattform- og leverandørhendelser?
5. Hvor er lokale supportkanaler og forventninger til eskalering dokumentert?
6. Hva er produktets availability SLO, RPO og RTO?
7. Er Cloud SQL HA eksplisitt aktivert der det kreves?
8. Er point-in-time recovery aktivert der det kreves, og er restore testet?
9. Hvordan oppfører applikasjonen seg i 60 sekunder – eller lenger – uten database?
10. Hvordan håndteres regionfeil, tapte hendelser og dataavstemming?
11. Hva er forventet skykostnad, inkludert HA, replicas, logger og andel av fellesplattformen?
12. Hvilke antakelser er testet i stedet for å bli utledet fra et funksjonsnavn?

## Offisielle kilder

- [Hva er NAIS?](https://docs.nais.io/explanations/nais/)
- [NAIS under the hood](https://docs.nais.io/explanations/under-the-hood/)
- [Dataansvar i NAIS](https://docs.nais.io/persistence/explanations/responsibilities/)
- [Autentisering og autorisasjon i NAIS](https://docs.nais.io/auth/)
- [NAIS-referanse for Cloud SQL](https://docs.nais.io/persistence/cloudsql/reference/)
- [NAIS Application-spesifikasjon](https://docs.nais.io/workloads/application/reference/application-spec/)
- [High availability i Google Cloud SQL](https://docs.cloud.google.com/sql/docs/postgres/high-availability)
- [Disaster recovery i Google Cloud SQL](https://docs.cloud.google.com/sql/docs/postgres/intro-to-cloud-sql-disaster-recovery)
- [Connection management i Google Cloud SQL](https://docs.cloud.google.com/sql/docs/postgres/manage-connections)

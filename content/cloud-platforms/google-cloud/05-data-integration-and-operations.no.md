---
title: "Data, integrasjon og produksjonsdrift"
translationKey: gcp-data-operations
module: "05"
weight: 50
track: "Arkitektur"
duration: "35 min"
level: "Viderekommen"
summary: "Match lagring og meldinger med dataenes egenskaper, og drift hele systemet med SLO-er, telemetri, robusthet, kostnadskontroll og Well-Architected Framework."
topics: ["Datatjenester", "Observability og SLO-er", "Pålitelighet og kostnad"]
last_reviewed: "22. august 2026"
outcomes:
  - "Velge lagring ut fra tilgangs-, konsistens- og gjenopprettingsbehov"
  - "Skille operasjonelle meldinger fra analytisk dataflyt"
  - "Gjøre logger, metrics og traces til SLO-drevet drift"
  - "Gjennomgå en arkitektur mot alle seks Well-Architected-pilarene"
next: { url: "/cloud-platforms/google-cloud/06-knowledge-check/", label: "Neste: kunnskapstest" }
---

## Velg datatjenester ut fra egenskaper

Start med workload-egenskapene, ikke en favorittdatabase:

- Er dataene relasjonelle, dokumentformede, objekter/filer, analytiske eller strømmende?
- Hvilke operasjoner må være transaksjonelle?
- Hvilken konsistens krever hver lesing?
- Hva er lese-/skrivemønster, volum og vekst?
- Hvilke RPO og RTO må gjenopprettingen møte?
- Hvor kan data ligge, og når må de slettes?
- Hvem eier skjemautvikling og tilgangsgjennomgang?

| Behov | Utgangspunkt i Google Cloud | Sentralt kompromiss |
| --- | --- | --- |
| Relasjonelle applikasjonsdata | Cloud SQL | Kjente motorer og administrert drift; regionalt design og connection limits betyr mye |
| Globalt skalerbare relasjonelle transaksjoner | Spanner | Sterk konsistens og horisontal skalering med en egen skjema-/kostnadsmodell |
| Dokument-/mobilapplikasjonsdata | Firestore | Fleksible dokumenter og klientintegrasjon; query-/indeksmodell former designet |
| Objekter, filer og arkiv | Cloud Storage | Varig objektlagring; ikke et montert transaksjonelt filsystem |
| Analytisk datavarehus | BigQuery | Serverless kolonneanalyse; scan patterns, partitioning og governance driver kostnad |
| Cache i minnet | Memorystore | Lav latency; tap og eviction må ikke ødelegge source of truth |

En administrert database fjerner maskinvare og mye rutinevedlikehold, ikke dataeierskap. Teamet eier fortsatt skjema, migreringer, query-oppførsel, dataminimering, autorisasjon, retention, gjenopprettingskrav og restore-verifisering.

## Cloud Storage er objektlagring

En bucket inneholder immutable object generations adressert med navn. Applikasjoner må ikke anta filesystem-semantikk for rename, append eller locking. Storage class og lifecycle rules kan flytte eller slette objekter med alderen. Versioning eller soft-delete kan hjelpe ved utilsiktede endringer, men retention og recovery må konfigureres og testes bevisst.

Uniform bucket-level access forenkler autorisasjon ved å bruke IAM konsekvent i stedet for å blande inn object ACLs. Public access prevention, signed URLs, krypteringskrav og audit logs avhenger av use case.

## Cloud SQL og connection management

Cloud SQL tilbyr administrert PostgreSQL, MySQL og SQL Server. High availability kan gi en standby på tvers av soner i én region; read replicas løser leseskalering, ikke alle katastrofegjenopprettingsbehov. Automatiske backups og point-in-time recovery er bare nyttige når retention og restore-prosedyrer møter produktets RPO/RTO.

Serverless og høyt skalerte applikasjoner kan bruke opp database connections lenge før CPU. Bruk connection pooling, begrens applikasjonsskalering, mål saturation og planlegg migreringer. En databaseskjemaendring må være kompatibel med rullerende applikasjonsversjoner.

## BigQuery er en analysemotor

BigQuery er laget for analytiske scans, aggregeringer og datapipelines, ikke som en direkte erstatning for en transaksjonsdatabase. Partitioning, clustering og valg av bare nødvendige kolonner kan redusere skannet datamengde og kostnad. Skill raw, curated og serving layers der det forbedrer eierskap og kvalitet, men ikke kopier persondata uten en livssyklus.

IAM, row-level security, column-level policy tags og authorized views gir ulike tilgangsmønstre. Data governance må angi hvem som eier datasett, kvalitet, lineage, klassifisering og sletting – ikke bare hvem som kan kjøre en query.

## Meldinger og integrasjon

Pub/Sub leverer asynkrone meldinger mellom uavhengige publishers og subscribers. Utform for duplikatlevering, retries, poison messages, rekkefølgekrav og observability. En vellykket publish betyr at plattformen tok imot meldingen; det betyr ikke at forretningsprosessen er fullført.

Bruk:

- Pub/Sub for frikoblet hendelsesdistribusjon og streaming ingestion;
- Cloud Tasks for eksplisitt, hastighetsstyrt levering av tasks til en handler;
- Eventarc for routing av støttede plattformhendelser;
- Workflows for synlig orkestrering av tjenestekall;
- Dataflow for Apache Beam-batch- og streamingpipelines.

En hendelse bør ha tydelig eier, kontrakt, versjoneringsstrategi, sensitivitetsklassifisering og retention. Ikke gjør en message broker til eneste autoritative kilde med mindre dette er et bevisst event sourcing-design der recovery er forstått.

## Observability er et feedbacksystem

Google Cloud Observability kombinerer Cloud Monitoring, Cloud Logging, Error Reporting, Trace og Profiler. Instrumenter applikasjoner med OpenTelemetry der det er praktisk, slik at signalene er portable og korrelerte.

Den nyttige modellen starter med brukerne:

1. Definer en **service-level indicator**, som vellykkede requests som ikke er brukerfeil innen 500 ms.
2. Sett et **service-level objective** over et tidsvindu basert på bruker- og forretningsbehov.
3. Varsle på meningsfull error-budget burn i stedet for enhver midlertidig ressurstopp.
4. Koble varselet til runbook, eier og eskaleringsvei.

Metrics viser trender og aggregater, logger forklarer enkelthendelser, og traces viser request paths gjennom avhengigheter. Ingen av dem er alene «observability». Correlation IDs og konsistente tjenestemetadata gjør dem til et system.

## Pålitelighet, levering og kostnad

Pålitelighet er en ende-til-ende-egenskap. Identifiser avhengigheter, feildomener og kapasitetsgrenser; gjør timeouts endelige; retry bare midlertidige feil med backoff og jitter; gjør side effects idempotente; og test restore og regional failover i stedet for å stole på konfigurasjonen.

Infrastructure as Code gjør miljøer gjennomgåbare og repeterbare. CI/CD bør skille build identity fra runtime identity, produsere immutable artefakter, verifisere policy, støtte progressiv utrulling og gjøre rollback eller roll-forward eksplisitt.

Kostnad er også et arkitektursignal. Plasser kostnad, sett budsjetter, følg enhetskostnad, right-size requests, kontroller data transfer og retention, og behandle overraskende kostnad som et driftsavvik. Optimalisering som ødelegger pålitelighet eller utviklertid, er ikke automatisk økonomisk.

Gjennomgå design mot de seks pilarene i Googles [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework): drift, sikkerhet/personvern/compliance, pålitelighet, kostnad, ytelse og bærekraft. En styrke i én pilar kan gi et kompromiss i en annen.

## Arkitekturkontroll

Utform en ordretjeneste med relasjonelle transaksjoner, PDF-kvitteringer, domenehendelser og analytisk rapportering. Et godt utgangspunkt kan bruke Cloud SQL for ordre, Cloud Storage for kvitteringer, Pub/Sub for integrasjonshendelser og BigQuery for analyse. Det må i tillegg beskrive konsistens mellom transaksjon og hendelse, idempotens, skjemaeierskap, PII-livssyklus, backup- og restore-tester, connection limits, SLO-er, varsler og kostnadsplassering.

## Offisielle studielenker

- [Cloud Storage-oversikt](https://docs.cloud.google.com/storage/docs/introduction)
- [Cloud SQL-oversikt](https://docs.cloud.google.com/sql/docs/introduction)
- [Introduksjon til BigQuery](https://docs.cloud.google.com/bigquery/docs/introduction)
- [Google Cloud Observability](https://docs.cloud.google.com/stackdriver/docs)
- [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework)

### NAIS-bro

NAIS eksponerer flere av kapabilitetene som selvbetjening: Cloud SQL, Cloud Storage og BigQuery på GCP, i tillegg til Kafka, OpenSearch og Valkey. Plattformen standardiserer også logger, metrics, traces og varsling. Plattformen provisionerer og drifter delt infrastruktur; produktteamet eier fortsatt dataene, valget, konfigurasjonen, migreringer, personvern, gjenopprettingskrav, SLO-er, hendelser og kostnad.

---
title: "Datatjenester og observability"
translationKey: nais-data-observability
module: "04"
weight: 40
track: "Plattformkapabiliteter"
duration: "35 min"
level: "Viderekommen"
summary: "Velg NAIS-datakapabiliteter ut fra egenskaper og eierskap, og kombiner logger, metrics og traces til nyttig tjenestedrift."
topics: ["Cloud SQL og buckets", "Kafka og BigQuery", "OpenTelemetry og Grafana"]
last_reviewed: "22. august 2026"
outcomes:
  - "Velge lagringskapabilitet fra dataproblemet"
  - "Forklare teamansvaret for provisionerte dataressurser"
  - "Bruke logger, metrics og traces til ulike spørsmål"
  - "Definere varsler fra SLO-er og håndterbare feiltilstander"
next: { url: "/cloud-platforms/nais/05-production-readiness/", label: "Neste: produksjonsberedskap" }
---

## Selvbetjening velger ikke for deg

NAIS eksponerer flere persistence-kapabiliteter fordi dataproblemer er forskjellige. En deklarasjon eller handling i Console kan provisionere infrastruktur og credentials; den kan ikke avgjøre riktig konsistensmodell, behandlingsgrunnlag, retention, skjema eller recovery-strategi.

| Behov | NAIS-kapabilitet | Viktige designspørsmål |
| --- | --- | --- |
| Relasjonelle transaksjoner | Cloud SQL / PostgreSQL | Skjema, connections, migreringer, HA, RPO/RTO og restore |
| Objekter og filer | Cloud Storage-bucket | Objektnavn, livssyklus, versioning/soft delete, retention og tilgang |
| Analytiske workloads | BigQuery | Datasetteierskap, partitioning, scan-kostnad, PII og sletting |
| Hendelsesstrømmer | Kafka gjennom Aiven | Partitions, keys, rekkefølge, skjemaer, offsets, replay og source of truth |
| Søk og dokumenter | OpenSearch | Indeksdesign, reindexing, tilgang og autoritativ kilde |
| Rask key/value og cache | Valkey | Eviction, tapsoppførsel, TTL, konsistens og om den bare er cache |

Tilgjengelighet varierer mellom miljøer. Den oppdaterte [persistence-oversikten](https://docs.nais.io/persistence/) er den autoritative sammenligningen.

## Dataansvaret blir hos teamet

NAIS provisionerer og vedlikeholder infrastruktur og integrasjoner etter teamets spesifikasjon. Underliggende lagring kan driftes av Google, Aiven eller en annen infrastrukturleverandør. Produktteamet er fortsatt ansvarlig for dataene og lovlig, sikker bruk.

Før provisionering svarer dere på:

1. Hva er dataenes formål og klassifisering?
2. Hvor kan de behandles og lagres?
3. Hvem kan få tilgang, og hvordan gjennomgås den?
4. Hvor lenge beholdes de, og hvordan verifiseres sletting?
5. Hva er RPO og RTO?
6. Hvilken backup- eller durability-funksjon finnes, og beskytter den mot utilsiktet sletting?
7. Er restore testet på applikasjonsnivå?
8. Hvem eier skjema, migrering, kostnad og hendelser?

«Highly available» og «backed up» er ikke synonymer. NAIS' lagringssammenligning sier eksplisitt at enkelte robuste tjenester ikke har en separat backup mot feilaktig sletting. Les [dataansvaret](https://docs.nais.io/persistence/explanations/responsibilities/).

## Relasjonelle data

For Cloud SQL planlegger du connection pooling og maksimal applikasjonsskalering sammen. Rolling deployments legger midlertidig til replikaer, og hver kan åpne en pool. Databasen kan bli mettet mens CPU ser frisk ut.

Bruk bakoverkompatible skjemaendringer på tvers av rullerende versjoner: utvid først, migrer, og trekk sammen senere. Behandle major version-oppgraderinger og instansendringer som produktendringer med testing, observability og rollback/recovery-planer. Plattformautomasjon vet ikke om en migrering bevarer faglig mening.

## Kafka og hendelseseierskap

NAIS tilbyr Kafka som administrert tjeneste gjennom Aiven. Topics har partitioning og tilgangskontroller; klientene bestemmer fortsatt keys, producer acknowledgement, consumer groups, offset commits og feiloppførsel.

Consumers bør håndtere redelivery og være idempotente ved den faglige grensen. Definer skjemakompatibilitet, eierskap og replay før produksjon. Kafkas durability er ikke en grunn til å gjøre tjenesten til eneste master for forretningsdata ved et uhell; NAIS-dokumentasjonen anbefaler at data kan gjenopprettes fra et annet system.

## Observability: still spørsmål med signaler

NAIS standardiserer de tre viktigste signaltypene:

- logger skrevet til `stdout`/`stderr` samles inn; strukturerte logger er enklere å søke og aggregere;
- metrics følger OpenMetrics/Prometheus-konvensjoner og spørres/visualiseres i Grafana;
- traces bruker OpenTelemetry og lagres i Tempo, med NAIS APM for tjeneste- og RED-visninger;
- varsler kan evalueres fra metrics eller logger og rutes gjennom støttede kanaler.

Automatisk OpenTelemetry-instrumentering kan skape nyttig basistelemetri uten kodeendringer. Den kjenner ikke viktige forretningshendelser, riktige correlation IDs eller hva «god tjeneste» betyr for brukerne.

Bruk hvert signal bevisst:

| Spørsmål | Beste startsignal |
| --- | --- |
| Stiger feilraten på tvers av alle instanser? | Metric |
| Hva skjedde med ordre `abc-123`? | Strukturert logg med trygg correlation ID |
| Hvilket nedstrøms kall dominerer latency? | Distribuert trace |
| Får brukerne vellykkede svar innen mål-tiden? | SLI-metric og SLO |

Plasser aldri tokens, secrets eller unødvendige persondata i logger, span attributes eller metric labels. Identifikatorer med høy cardinality kan gjøre metrics dyre og lite effektive; legg request-spesifikke identifikatorer i logger/traces.

## Varsle på tilstander mennesker kan håndtere

Et varsel trenger:

- en bruker- eller systempåvirkning verdt å avbryte noen for;
- terskel og varighet som unngår midlertidig støy;
- eier og leveringskanal;
- kontekst, dashboard og runbook;
- trygg første handling og eskaleringsvei;
- periodisk vurdering av om det var nyttig.

Start med SLO-er for tilgjengelighet, latency og korrekthet. Ressursvarsler som memory pressure er nyttige når de varsler brukerpåvirkning eller nært forestående feil. Ikke page på hver pod-restart; Kubernetes-restarts er normale, mens restart loop og tap av frisk kapasitet ikke er det.

Studer den oppdaterte [NAIS-oversikten for observability](https://docs.nais.io/observability/) og [observability-tutorialen](https://docs.nais.io/observability/tutorials/getting-started/).

## Arkitekturkontroll

En applikasjon lagrer saksstatus i Cloud SQL, publiserer sakshendelser til Kafka, indekserer søkbar tekst i OpenSearch og sender hvert saksnummer som Prometheus-label.

Arkitekturen trenger en erklæring om autoritativ kilde, konsistens mellom transaksjon og hendelse, replay- og reindex-strategi, dataklassifisering i hver kopi, recovery-testing og eierskap. Saksnummer må ikke være metric label med høy cardinality; bruk avgrensede metrics for trender og trygg korrelasjon i logger/traces for enkeltsaker.

## Offisielle studielenker

- [Oversikt over persistent data](https://docs.nais.io/persistence/)
- [Dataansvar](https://docs.nais.io/persistence/explanations/responsibilities/)
- [Kafka](https://docs.nais.io/persistence/kafka/)
- [Observability](https://docs.nais.io/observability/)
- [Automatisk instrumentering](https://docs.nais.io/observability/how-to/auto-instrumentation/)

### Google Cloud-bro

Cloud SQL, Cloud Storage og BigQuery beholder Google Cloud-egenskapene når de provisioneres gjennom NAIS. [Data- og driftsmodulen for Google Cloud]({{< relref "/cloud-platforms/google-cloud/05-data-integration-and-operations.no.md" >}}) forklarer underliggende tjenesteavveininger og Well-Architected-perspektivet.

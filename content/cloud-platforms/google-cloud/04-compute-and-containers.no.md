---
title: "Compute, containere og valg av workload"
translationKey: gcp-compute
module: "04"
weight: 40
track: "Applikasjonsplattform"
duration: "30 min"
level: "Viderekommen"
summary: "Velg bevisst mellom Cloud Run, GKE og Compute Engine, og utform deretter stateless tjenester, jobber og hendelsesdrevne workloads for skalering og feil."
topics: ["Cloud Run", "GKE", "Compute Engine"]
last_reviewed: "22. august 2026"
outcomes:
  - "Velge runtime ut fra workload-behov fremfor vane"
  - "Forklare driftsgrensen til Cloud Run, GKE og Compute Engine"
  - "Utforme en container for helsesjekker, skalering og terminering"
  - "Skille tjeneste-, jobb- og hendelsesprosesseringsmønstre"
next: { url: "/cloud-platforms/google-cloud/05-data-integration-and-operations/", label: "Neste: data, integrasjon og drift" }
---

## Velg høyeste nyttige abstraksjon

Det første compute-spørsmålet er ikke «hvilken VM-størrelse?», men «hvor mye infrastrukturkontroll trenger workloaden egentlig?». En runtime på høyere nivå reduserer generisk driftsarbeid, men bare når begrensningene passer applikasjonen.

| Runtime | Passer godt til | Teamet eier fortsatt |
| --- | --- | --- |
| Cloud Run | Stateless HTTP/gRPC-tjenester, event handlers, funksjoner, jobber og worker pools | Kode, container/runtime-kontrakt, skaleringsgrenser, identitet, data og tjenestepålitelighet |
| Google Kubernetes Engine | Kubernetes-workloads som trenger API-et, økosystemet, scheduling eller plattformutvidelser | Workload-design og det valgte clusteransvaret |
| Compute Engine | Eldre programvare, tilpasset OS/runtime, appliances eller kontroll administrerte runtimes ikke gir | Gjeste-OS, patchingmodell, instanslivssyklus og langt mer infrastruktur |

Dette er ikke en modenhetsstige. Et lite HTTP-API blir ikke mer profesjonelt av å flytte fra Cloud Run til Kubernetes. GKE er verdifullt når Kubernetes-kapabilitetene forsvarer den større kontrollflaten.

## Cloud Run: administrert containerkjøring

Cloud Run kjører containere uten at teamet oppretter en cluster. En **service** eksponerer et stabilt HTTPS-endepunkt og skalerer stateless instanser etter trafikk og konfigurerte metrics. En **job** kjører arbeid til det er ferdig, eventuelt som parallelle tasks. En **worker pool** støtter kontinuerlige workloads uten requests, som pull consumers.

Runtime-kontrakten er viktig:

- tjenesteprosessen lytter på oppgitt port;
- skrivbart filsystem er midlertidig;
- instanser kan starte og stoppe når som helst;
- lokalt minne og filer er ikke delt varig state;
- concurrency, minimum/maksimum instances og CPU allocation påvirker oppførsel og kostnad;
- tilknyttet service account er runtime-identiteten.

Scale to zero kan redusere tomgangskostnad, men gir cold starts. Minimum instances kan redusere forsinkelse mot en kostnad. Maximum instances beskytter nedstrøms systemer bare når grensen bygger på målte databaseforbindelser, API-kvoter og back-pressure.

Les [What is Cloud Run?](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run).

## GKE: Kubernetes med administrert kontrollplan

Google Kubernetes Engine leverer administrert Kubernetes. I **Autopilot** administrerer Google noder og håndhever en mer meningsbærende driftsmodell. I **Standard** styrer kunden node pools og mer clusterkonfigurasjon. Begge eksponerer fortsatt Kubernetes-begreper som namespaces, Deployments, Services, Pods, ConfigMaps, Secrets og service accounts.

Kubernetes avstemmer ønsket tilstand. En Deployment sier hvor mange replikaer og hvilken pod-template som skal finnes; den gjør ikke applikasjonen stateless eller pålitelig i seg selv. Workloaden må:

- eksponere meningsfulle startup-, readiness- og liveness-probes;
- be om realistisk CPU og minne;
- tåle rescheduling og flere replikaer;
- håndtere termineringssignaler og fullføre pågående arbeid;
- lagre varig state utenfor containeren;
- sende nyttige logger, metrics og traces;
- bruke en smalt avgrenset workload-identitet.

Bruk GKE når du trenger Kubernetes-API-er, custom controllers, spesialisert scheduling, portabilitet rundt Kubernetes-kontrakter eller en delt intern plattform. Sammenlign [GKE og Cloud Run](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/gke-and-cloud-run) før du velger alternativet med større driftskrav.

## Compute Engine: infrastrukturkontroll

Compute Engine leverer virtuelle maskiner, disker, images, instance templates, managed instance groups og autoskalering. Managed instance groups kan gjenskape usunne VM-er og distribuere identiske instanser, men gjeste-OS og applikasjonsstack er fortsatt ditt ansvar.

VM-er passer programvare som krever kernel- eller OS-kontroll, ustøttede agenter, spesialisert nettverk, tradisjonell stateful installasjon eller migrering med minst mulig endring først. Også da bør du avgjøre om destinasjonen skal forbli en VM etter migreringen eller flyttes til en administrert tjeneste senere.

Unngå pets: Foretrekk immutable images, instance templates, automatisert oppstart og eksternalisert konfigurasjon. En manuelt reparert produksjons-VM er vanskelig å gjenskape og revidere.

## Hendelser og asynkront arbeid

Pub/Sub frikobler publishers fra subscribers. Levering er generelt at-least-once, så consumers må være idempotente eller deduplisere ved den faglige grensen. Acknowledgement deadlines, retries, krav til rekkefølge, dead-letter-håndtering og back-pressure inngår i designet.

Eventarc ruter støttede hendelser til mål som Cloud Run. Cloud Tasks er nyttig når en applikasjon trenger eksplisitt planlagt levering, hastighetskontroll og retry per task mot en HTTP-handler. Workflows orkestrerer kall når prosessen naturlig er en sekvens av steg i administrerte tjenester.

Spør om workloaden er:

- request/response eller asynkron;
- kontinuerlig eller endelig;
- latency-sensitiv eller batchorientert;
- stateless eller stateful;
- horisontalt skalerbar;
- tolerant for duplikatlevering;
- avhengig av Kubernetes-spesifikke kapabiliteter.

Disse egenskapene avgrenser runtime langt bedre enn en popularitetsliste over produkter.

## Arkitekturkontroll

Et team har et offentlig stateless API, en rapportgenerator hver time, en Kafka-consumer som kjører kontinuerlig og en lisensiert dokumentkonverterer som krever en spesiell OS-pakke.

En rimelig startportefølje er Cloud Run service for API-et, Cloud Run job for rapportgenerering, worker pool eller GKE-workload for den kontinuerlige consumeren avhengig av kontrollbehov, og Compute Engine for konvertereren hvis den ikke kan containeriseres til en administrert runtime. Svaret bør også dekke skaleringsgrenser, identitet, retries ved feil, datalagring, patchingansvar og observability.

## Offisielle studielenker

- [Cloud Run-oversikt](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run)
- [GKE-oversikt](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview)
- [Sammenligning av GKE og Cloud Run](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/gke-and-cloud-run)
- [Compute Engine-oversikt](https://docs.cloud.google.com/compute/docs/overview)
- [Pub/Sub-oversikt](https://docs.cloud.google.com/pubsub/docs/overview)

### NAIS-bro

NAIS tilbyr primært langlevde **Application**-workloads og endelige eller planlagte **Naisjob**-workloads på GKE. Produktteam leverer en container og en kort custom resource; Naiserator oppretter underliggende Kubernetes-ressurser og integrasjoner. Dette reduserer clusterarbeidet kraftig, men alt containeransvar – health, shutdown, resources, horisontal skalering, statelessness og observability – gjelder fortsatt.

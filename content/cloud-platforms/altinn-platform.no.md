---
title: "Altinn-plattformen"
summary: "En arkitektonisk gjennomgang av Altinn Studio, Altinn Apps og de delte plattformtjenestene som offentlige digitale tjenester bygger på."
description: "Hva Altinn 3 er, hvordan plattformen er bygget, og hvordan apper, identitet, autorisasjon, data, hendelser og drift henger sammen."
translationKey: altinn-platform
category: "Skyplattformer · Norsk digital infrastruktur"
toc: true
last_reviewed: "13. juli 2026"
---

Altinn er ikke én applikasjon eller bare et sted å fylle ut skjemaer. [Altinn 3](https://docs.altinn.studio/en/community/about/) er tredje generasjon av en plattform for å utvikle og kjøre offentlige digitale tjenester. Den eies av Digitaliseringsdirektoratet, utvikles åpent og kombinerer et utviklingsmiljø, en runtime for tjenesteeiernes apper og felles nasjonale kapabiliteter.

Det viktigste arkitekturvalget er skillet mellom **det som er spesifikt for én tjeneste**, og **det som bør løses én gang og gjenbrukes på tvers**. En etat kan eie sin datamodell, arbeidsflyt, brukeropplevelse og faglogikk, mens plattformen leverer blant annet identitet, autorisasjon, lagring, hendelser og varsling.

## Tre deler som må skilles fra hverandre

| Del | Rolle | Det utvikleren møter |
| --- | --- | --- |
| **Altinn Studio** | Utviklings- og konfigurasjonsmiljø | Datamodeller, skjermbilder, tekster, prosess, tilgangsregler, kildekode, bygg og utrulling |
| **Altinn Apps** | Runtime for tjenesteeiernes applikasjoner | Containeriserte apper i isolerte miljøer, Kubernetes, ingress, skalering og kobling til plattform-API-er |
| **Altinn Platform** | Delte tjenester og API-er | Autentisering, autorisasjon, lagring, register- og profildata, hendelser, varsling, PDF og kvitteringer |

[Altinns arkitekturdokumentasjon](https://docs.altinn.studio/en/technology/architecture/components/) beskriver i tillegg applikasjons-, data-, plattform- og infrastrukturkomponenter. «Altinn-plattformen» kan derfor bety hele økosystemet i dagligtale, mens **Altinn Platform** er den mer presise betegnelsen på de delte runtime-komponentene.

## Fra tjenestemodell til kjørende app

En Altinn-app er en selvstendig digital tjeneste. App-repositoriet samler normalt datamodeller, UI-layout, tekster, prosesskonfigurasjon, autorisasjonspolicy, deploy-konfigurasjon og eventuell egendefinert kode.

Den typiske kjeden er:

1. Tjenesteeieren modellerer data, brukerreise, prosess og tilgangsregler.
2. Appen utvikles i Altinn Studio og/eller vanlige kodeverktøy, med Git som versjonshistorikk.
3. Bygget kombinerer appens innhold med Altinns applikasjonsruntime og lager et container-image.
4. Imaget lagres i et privat containerregister og publiseres med Helm til tjenesteeierens Kubernetes-miljø.
5. Den kjørende appen bruker Altinn Platform for felles kapabiliteter og lagrer data gjennom plattformens API-er.

Ifølge [dokumentasjonen for bygg og utrulling](https://docs.altinn.studio/en/technology/architecture/capabilities/runtime/appdeploy/) kjører hver app som containere orkestrert av Kubernetes, og hver organisasjon har egne appmiljøer. [Deploy-konfigurasjonen](https://docs.altinn.studio/en/altinn-studio/v8/reference/configuration/deployment/) er basert på et sentralt Helm-chart med mulighet for appspesifikke overstyringer og autoskalering.

Dette gir en viktig egenskap: tjenesten kan utvikles og versjoneres uavhengig, samtidig som den følger plattformens kontrakter for data, sikkerhet og drift.

## De sentrale plattformtjenestene

Den offisielle [oversikten over Altinn Platform](https://docs.altinn.studio/en/technology/solutions/altinn-platform/) viser komponenter som tilbyr sentral funksjonalitet til Altinn Apps og eksterne konsumenter.

### Autentisering

Altinn er ikke selv identitetsleverandøren. Plattformen etablerer sesjoner og tokens basert på eksterne leverandører som ID-porten, Maskinporten og Feide. [Autentiseringskomponenten](https://docs.altinn.studio/en/authorization/getting-started/authentication/) kan blant annet veksle eksterne tokens til Altinn-tokens og gi apper et konsistent identitetsgrunnlag.

Det er nyttig å skille mellom:

- **mennesket eller systemet som autentiseres**;
- **appen eller komponenten som gjør et kall**;
- **parten personen eller systemet representerer**, for eksempel en virksomhet.

### Autorisasjon og delegering

Altinns autorisasjon er attributtbasert og bruker XACML 3.0. En beslutning kan avhenge av subjekt, ressurs, handling, part, rolle, delegering og kontekst. [Referansearkitekturen](https://docs.altinn.studio/en/authorization/reference/architecture/) bygger på klassiske XACML-roller:

- **PAP** administrerer policyer. Altinn Studio, Access Management og Resource Registry er sentrale kilder.
- **PDP** evaluerer en forespørsel mot policy og tilgjengelige attributter.
- **PIP/context handler** henter og beriker beslutningsgrunnlaget.
- **PEP** håndhever avgjørelsen ved å slippe gjennom eller stoppe operasjonen.

Dette er mer enn enkel rollebasert tilgang. Altinn må håndtere at personer og systemer handler på vegne av andre, og at rettigheter kan delegeres mellom borgere, virksomheter, ansatte, leverandører og systembrukere. Tjenesteeieren eier likevel meningen i policyen: feil regel kan gi feil person tilgang til beskyttede data.

### Lagring og instanser

En tjenesteinstans representerer en konkret kjøring av en app for en bestemt part. Instansen binder sammen metadata, prosesshistorikk og ett eller flere dataelementer som skjemadata eller vedlegg.

[Lagringsarkitekturen](https://docs.altinn.studio/en/technology/architecture/components/infrastructure/storage/) bruker flere teknologier til forskjellige formål. Metadata for apper og instanser lagres i Cosmos DB, binære data og skjemadata i Azure Blob Storage, mens PostgreSQL blant annet brukes av Events og Repository. Data og metadata eksponeres gjennom plattform-API-er, slik at appen ikke trenger å koble seg direkte til den underliggende lagringsteknologien.

### Hendelser og varsling

Altinn Events lar apper og andre produsenter publisere hendelser, mens konsumenter kan abonnere. Det kobler tjenesten til fagsystemer uten at alle prosesser må bli synkrone punkt-til-punkt-kall. Notifications håndterer varsling til personer, blant annet via e-post og SMS.

En god løsning behandler disse som forskjellige kapabiliteter:

- En **hendelse** forteller et system at noe har skjedd.
- Et **varsel** forsøker å gjøre et menneske oppmerksom på noe.
- Selve **sannheten og tilstanden** ligger fortsatt i tjenestens autoritative data.

### Register, profil, PDF og kvittering

Register- og profiltjenester gir komponentene et felles grunnlag for informasjon om personer, virksomheter og parter. PDF-komponenten kan lage en utskriftsrepresentasjon av innsendte data, og kvitteringskomponenten presenterer resultatet av en innsending. Disse tjenestene er støttekapabiliteter; de erstatter ikke tjenesteeierens fagmodell eller arkivvurderinger.

## Sky- og driftsarkitektur

Altinn 3 kjører i offentlig sky. [Infrastrukturdokumentasjonen](https://docs.altinn.studio/en/technology/architecture/capabilities/devops/platformoperations/infrastructuremgmt/) beskriver Azure, Kubernetes, Terraform, containerregistre, Key Vault, lagring, nettverk og API management som sentrale byggesteiner.

Arkitekturen har flere isolasjonsnivåer:

- tjenesteeiere har egne Altinn Apps-miljøer for test og produksjon;
- apper pakkes og deployes separat;
- felles plattformkomponenter kjører i egne plattformmiljøer;
- data, secrets og nettverk konfigureres som administrerte ressurser.

Plattformteamet automatiserer infrastrukturen og den felles runtime-flaten. Tjenesteeieren er fortsatt ansvarlig for tjenestens formål, databehandling, tilgangsmodell, faglogikk, test og relevante krav til tilgjengelighet og arkivering. En plattform reduserer operasjonell friksjon, men flytter ikke produkteierskapet.

## Når Altinn er et godt plattformvalg

Altinn er særlig relevant når en offentlig digital tjeneste trenger flere av disse egenskapene samtidig:

- samhandling med borgere og virksomheter gjennom etablerte norske identiteter;
- representasjon og delegering på vegne av en annen part;
- strukturerte innsendinger, vedlegg og en styrt arbeidsflyt;
- tilgangsregler som må forstå norske roller, parter og systembrukere;
- hendelser, varsling og integrasjon med tjenesteeierens fagsystemer;
- en separat, versjonert app som kan deployes og skaleres innenfor en forvaltet runtime.

Altinn er ikke automatisk riktig sted for enhver API-tjeneste eller intern mikrotjeneste. Dersom behovet hovedsakelig er en generell container-runtime, og løsningen ikke bruker Altinns domene- og samhandlingskapabiliteter, kan en generell applikasjonsplattform som [NAIS]({{< relref "nais.no.md" >}}) eller en direkte skytjeneste være et mer naturlig nivå.

## Spørsmål en arkitekt bør stille

1. Hvem er bruker, hvilken part handler brukeren for, og hvilken identitet er autoritativ?
2. Hvilke handlinger finnes på hvilke ressurser, og hvordan kan rettighetene delegeres?
3. Hva er tjenestens autoritative data, og hva er bare en presentasjon, hendelse eller kvittering?
4. Hvilke operasjoner er synkrone, og hvilke bør kobles gjennom Events?
5. Hvilket ansvar ligger hos Digdir, tjenesteeieren og eventuelle fagsystemteam?
6. Hvordan testes policy, prosess, migrering, skala, feilmodi og gjenoppretting før produksjon?

## Offisielle innganger

- [Altinn-dokumentasjonen](https://docs.altinn.studio/)
- [Altinn Platform – komponentoversikt](https://docs.altinn.studio/en/technology/solutions/altinn-platform/)
- [Teknisk arkitektur](https://docs.altinn.studio/en/technology/architecture/components/)
- [Altinn Authorization](https://docs.altinn.studio/en/authorization/)
- [Altinn på GitHub](https://github.com/Altinn)

*Sist faglig gjennomgått 13. juli 2026. Plattformen utvikles løpende; offisiell dokumentasjon er fasit for gjeldende API-er og konfigurasjon.*

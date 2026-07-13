---
title: "NAIS-plattformen"
summary: "Hvordan NAIS gjør Kubernetes, identitet, data, observability og sikker utrulling tilgjengelig som selvbetjente byggeklosser for autonome produktteam."
description: "En arkitektonisk gjennomgang av NAIS: runtime, deklarative manifester, Naiserator, identitet, zero trust, data, observability og ansvar."
translationKey: nais-platform
category: "Skyplattformer · Applikasjonsplattform"
toc: true
last_reviewed: "13. juli 2026"
---

[NAIS](https://docs.nais.io/explanations/nais/) er en applikasjonsplattform som skal gi team de tekniske kapabilitetene de trenger for å utvikle og kjøre programvare sikkert, uten at hvert team må bygge sin egen Kubernetes- og skyplattform. Navnet sto opprinnelig for *NAVs Application Infrastructure Services*; NAIS-miljøet arbeider med å la N-en stå for *Norwegian*.

NAIS er altså ikke en ny skyleverandør. Det er et **plattformlag over Kubernetes og administrerte tjenester** som tilbyr en tydelig, deklarativ utvikleropplevelse. Plattformteamet bygger standardiserte «paved roads», mens produktteamet beholder ansvaret for applikasjonen og dataene.

## Plattformideen

NAIS bygger på at et tverrfaglig team som kan utvikle, deploye og drifte sitt eget produkt, kan levere raskere og lære mer direkte fra produksjon. Plattformen forsøker å fjerne unødvendig operasjonell kompleksitet, men beholder innsikten teamet trenger for å ta ansvar.

Det gir fire sentrale prinsipper:

1. **Selvbetjening:** teamet beskriver ønsket tilstand i versjonskontrollerte manifester.
2. **Gode standardvalg:** sikkerhet, runtime, nettverk og telemetri får fornuftige standarder.
3. **Produkteierskap:** teamet eier kode, kvalitet, kostnad, data og oppførsel i produksjon.
4. **Plattform som produkt:** NAIS tilbyr dokumentasjon, konsoll, API-er og støtte – ikke bare en Kubernetes-installasjon.

## Hva som skjer under panseret

En NAIS-applikasjon er ett eller flere kjørende eksemplarer av et container-image. Utvikleren beskriver applikasjonen med en Kubernetes Custom Resource, vanligvis i `nais.yaml`:

```yaml
apiVersion: nais.io/v1alpha1
kind: Application
metadata:
  name: ordre-api
  namespace: mitt-team
spec:
  image: europe-north1-docker.pkg.dev/prosjekt/app/ordre-api:1.4.0
  ingresses:
    - https://ordre-api.example.no
  replicas:
    min: 2
    max: 6
  resources:
    requests:
      cpu: 50m
      memory: 256Mi
  accessPolicy:
    inbound:
      rules:
        - application: ordre-frontend
```

[Applikasjonsspesifikasjonen](https://docs.nais.io/workloads/application/reference/application-spec/) kan også beskrive prober, autoskalering, miljøvariabler, secrets, innganger, utgående trafikk, identitetsintegrasjoner og datatjenester.

Den sentrale operatoren [Naiserator](https://github.com/nais/naiserator) oversetter den korte NAIS-spesifikasjonen til Kubernetes-ressursene og integrasjonene som faktisk trengs. Dermed uttrykker teamet **intensjon** – «kjør denne workloaden med denne identiteten og disse avhengighetene» – mens plattformen håndterer mye av implementasjonsdetaljen.

Hvert skybasert NAIS-miljø er et Kubernetes-cluster på Google Kubernetes Engine. Kubernetes er likevel først og fremst implementasjonslaget; utviklerkontrakten er NAIS-manifestene, Nais Console og plattformens API-er.

## Fra commit til produksjon

Den grunnleggende leveransekjeden er enkel og sporbar:

1. Teamet bygger applikasjonen som et container-image.
2. Kode, Dockerfile, NAIS-manifest og workflow ligger i GitHub.
3. GitHub Actions bygger, tester og publiserer imaget.
4. NAIS deploy action sender manifest og image-referanse til riktig miljø.
5. Plattformoperatorene oppretter eller endrer workload, nettverk, identitet og valgte ressurser.
6. Teamet følger utrullingen og driften i GitHub, Nais Console og observability-verktøyene.

Den offisielle [Hello Nais-guiden](https://docs.nais.io/tutorials/hello-nais/) viser hele flyten. NAIS støtter både langlevde **Applications** og **Jobs** som skal avslutte, kjøre én gang eller følge en tidsplan.

## Runtime og trafikk

En Application gir blant annet:

- Kubernetes Deployment og Service;
- HTTPS-ingress mot ønsket målgruppe;
- ressursforespørsler for CPU og minne;
- minimums- og maksimumsreplikaer med automatisk skalering;
- startup-, readiness- og liveness-prober;
- kontrollert rolling update og avslutning;
- miljøspesifikk konfigurasjon og kobling til secrets.

Plattformen kan automatisere dette, men applikasjonen må være designet for det. Den bør tåle flere samtidige replikaer, håndtere avslutningssignaler, rapportere korrekt helse og holde flyktig tilstand utenfor containeren.

## Identitet og zero trust

NAIS behandler identitet som en plattformkapabilitet, ikke som et bibliotek hvert team skal sette opp fra bunnen av.

### Workload identity

Alle workloader har sin egen identitet, i praksis knyttet til en Kubernetes Service Account. Plattformen kan injisere kortlivede OIDC-tokens. Kort levetid og automatisk rotasjon reduserer behovet for varige klienthemmeligheter og gjør det mulig å gi en workload presise rettigheter.

### Brukere og systemer

[Autentiseringsområdet](https://docs.nais.io/auth/) omfatter flere ulike behov:

- **ID-porten** for innlogging av borgere;
- **TokenX** for token exchange når en intern tjenestekjede må handle på vegne av en innlogget bruker;
- **Maskinporten** for maskin-til-maskin-integrasjoner mellom virksomheter;
- **Microsoft Entra ID** for organisasjonsidentiteter og interne brukere;
- workload identity for tjenestens egen maskinidentitet.

Tilgjengelighet og nøyaktig konfigurasjon varierer mellom miljøer. Arkitekten må skille mellom sluttbrukeridentitet, workload-identitet og den delegerte konteksten et API-kall eventuelt bærer videre.

### Access policies

NAIS følger et zero-trust-prinsipp: trafikk mellom applikasjoner er ikke automatisk tillatt. `accessPolicy` beskriver eksplisitt hvilke apper, namespaces, clustere eller eksterne hosts en workload kan kommunisere med. For støttede tokenmekanismer brukes de samme relasjonene også til validering av innkommende klienter.

En nettverksregel er likevel ikke hele autorisasjonsmodellen. At frontend A får nå backend B, betyr ikke nødvendigvis at sluttbrukeren har lov til å lese en bestemt ressurs. Applikasjonen må fortsatt håndheve faglig autorisasjon på riktig nivå.

## Data som selvbetjente ressurser

[NAIS' dataoversikt](https://docs.nais.io/persistence/) tilbyr flere lagringstyper fordi én database ikke passer alle problemer:

| Behov | Plattformtjeneste | Viktig arkitekturspørsmål |
| --- | --- | --- |
| Relasjonelle transaksjoner | PostgreSQL / Cloud SQL | Konsistens, forbindelser, migrering, HA og gjenoppretting |
| Objekt- og fillagring | Google Cloud Storage | Livssyklus, versjonering, retention og tilgang |
| Hendelsesstrømmer | Kafka levert gjennom Aiven | Partisjonering, eierskap, skjema, replay og at Kafka ikke bør være eneste master |
| Analyse | BigQuery | Dataminimering, kostnad, tilgang og livssyklus |
| Søk og dokumenter | OpenSearch | Indeksering, reindeksering og autoritativ datakilde |
| Hurtig nøkkel/verdi og cache | Valkey | Hva som skjer ved tap, eviction og feil |

En deklarasjon kan opprette infrastrukturen og gi applikasjonen credentials, men den velger ikke riktig datamodell eller backupstrategi for teamet. [Ansvarsbeskrivelsen](https://docs.nais.io/persistence/explanations/responsibilities/) er tydelig: plattformen etablerer og vedlikeholder infrastrukturen, mens teamet er ansvarlig for egne data, personvern, konfigurasjon, gjenoppretting og daglig bruk.

## Observability som standardkapabilitet

[Observability i NAIS](https://docs.nais.io/observability/) dekker de tre signaltypene logger, metrics og traces:

- tekst skrevet til `stdout` og `stderr` samles automatisk og kan søkes i Loki;
- metrics følger OpenMetrics/Prometheus-modellen og kan vises og varsles fra Grafana;
- traces følger OpenTelemetry og lagres i Tempo;
- alarmer kan rutes via Alertmanager;
- Nais APM samler helse, RED-signaler, feil, endepunkter, databaseinnsikt, traces og logger.

NAIS kan auto-instrumentere støttede runtimes med OpenTelemetry-agent. Det gir en rask start, men god observability krever fortsatt at teamet definerer meningsfulle tjenestenivåer, alarmer, korrelasjons-ID-er og faglige signaler.

## Sikker programvareforsyning

Plattformen kan gi en sammenhengende kjede fra autorisert GitHub-repository til kjørende workload. Byggeflyten kan produsere SBOM, og NAIS tilbyr innsikt og metrics for sårbarheter i images. Sammen med kortlivede identities, eksplisitte access policies og versjonskontrollert konfigurasjon gir dette et bedre revisjonsspor.

Det fjerner ikke teamets ansvar for avhengighetsoppdateringer, sikre base-images, kodegjennomgang, hemmelighetshåndtering og respons på sårbarheter. Plattformen gjør kontrollene tilgjengelige og synlige; teamet må bruke dem.

## Ansvarsmodellen

| Plattformteamet | Produktteamet |
| --- | --- |
| Kubernetes-clustere og felles plattformkomponenter | Applikasjonskode, tester og faglig korrekthet |
| Operatører, CRD-er, automatisering og standarder | Manifester, ressursvalg og miljøkonfigurasjon |
| Integrasjon mot identitet, data og observability | Faglig autorisasjon og riktig bruk av identiteter |
| Dokumentasjon, konsoll, API-er og støtte | Dataansvar, personvern, backupbehov og gjenoppretting |
| Plattformens tilgjengelighet og oppgraderingsløp | Produktets SLO-er, alarmer, hendelser og kostnad |

Dette er kjernen i god plattformutvikling: sentraliser den udifferensierte kompleksiteten, men ikke sentraliser alle beslutninger eller alt operativt eierskap.

## Når NAIS er et godt valg

NAIS passer godt for organisasjoner og team som:

- leverer containeriserte webapplikasjoner, API-er, bakgrunnsjobber og hendelsesdrevne tjenester;
- ønsker en standardisert vei fra GitHub til Kubernetes uten at alle må bli clusteradministratorer;
- trenger norsk offentlig identitetsintegrasjon sammen med workload identity;
- vil ha data, secrets, nettverk og observability som selvbetjente plattformkapabiliteter;
- organiserer seg i autonome team som kan eie hele produktets livsløp.

NAIS og [Altinn]({{< relref "altinn-platform.no.md" >}}) konkurrerer ikke nødvendigvis. Altinn tilbyr domene- og samhandlingskapabiliteter for offentlige digitale tjenester. NAIS tilbyr en generell runtime og utviklerplattform. En løsning kan kjøre egne API-er og støttekomponenter på NAIS og samtidig integrere med Altinn, dersom tjenestens behov og tilgangsavtaler tilsier det.

## Spørsmål en arkitekt bør stille

1. Hvilken del av Kubernetes- og skykompleksiteten eier plattformen, og hva må teamet forstå selv?
2. Hvilken identitet representerer brukeren, workloaden og en eventuell delegering i hvert kall?
3. Er `accessPolicy` i samsvar med faktisk tjenestegraf, minste privilegium og faglig autorisasjon?
4. Hvilken datatjeneste passer konsistens-, søke-, analyse- og gjenopprettingsbehovet?
5. Kan appen skaleres horisontalt og rulles ut uten å miste trafikk eller tilstand?
6. Hvilke signaler viser at brukerne får en fungerende tjeneste – ikke bare at podene kjører?
7. Hvem reagerer på sikkerhetsfunn, kostnadsavvik og produksjonshendelser?

## Offisielle innganger

- [NAIS developer documentation](https://docs.nais.io/)
- [Hva er NAIS?](https://docs.nais.io/explanations/nais/)
- [Application-spesifikasjonen](https://docs.nais.io/workloads/application/reference/application-spec/)
- [Observability](https://docs.nais.io/observability/)
- [Persistent data](https://docs.nais.io/persistence/)
- [NAIS på GitHub](https://github.com/nais)

*Sist faglig gjennomgått 13. juli 2026. NAIS utvikles løpende, og enkelte kapabiliteter er miljøspesifikke eller i preview. Bruk offisiell dokumentasjon som fasit for gjeldende støtte.*

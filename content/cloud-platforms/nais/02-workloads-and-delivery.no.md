---
title: "Workloads, manifester og levering"
translationKey: nais-workloads-delivery
module: "02"
weight: 20
track: "Utviklerløp"
duration: "35 min"
level: "Grunnleggende"
summary: "Gå fra container-image til NAIS Application eller Naisjob, forstå manifestkontrakten og utform en sporbar leveringsflyt fra GitHub til produksjon."
topics: ["Application og Naisjob", "nais.yaml", "GitHub Actions"]
last_reviewed: "22. august 2026"
outcomes:
  - "Velge Application eller Naisjob ut fra kjøringsmønster"
  - "Lese de viktigste feltene i et NAIS workload-manifest"
  - "Utforme probes, ressurser, replikaer og shutdown riktig"
  - "Spore en autorisert deployment fra commit til cluster"
next: { url: "/cloud-platforms/nais/03-identity-and-networking/", label: "Neste: identitet og nettverk" }
---

## Application eller Naisjob?

En NAIS **Application** kjører én eller flere instanser av et container-image som en langlivet tjeneste. Den passer API-er, webapplikasjoner, kontinuerlige consumers og workers. En **Naisjob** representerer endelig arbeid som skal fullføres, enten ved behov eller etter tidsplan.

Velg ut fra kjøringsmønster, ikke programmeringsspråk:

| Spørsmål | Application | Naisjob |
| --- | --- | --- |
| Skal den forbli tilgjengelig? | Ja | Nei |
| Betyr suksess at prosessen fortsetter å betjene? | Vanligvis | Nei, suksess er fullføring |
| Typisk trigger | Trafikk eller kontinuerlig tilgjengelig arbeid | Manuell, planlagt eller eksplisitt kjøring |
| Feilmodell | Restart og gjenopprett friske replikaer | Retry/feil på kjøringen i henhold til jobbpolicy |

Ikke simuler en planlagt jobb med et API-endepunkt på en permanent tjeneste med mindre request/response-semantikken faktisk trengs.

## Manifestet uttrykker intensjon

Et minimalt Application-manifest kan se slik ut:

```yaml
apiVersion: nais.io/v1alpha1
kind: Application
metadata:
  name: order-api
  namespace: my-team
spec:
  image: europe-north1-docker.pkg.dev/project/apps/order-api:1.4.0
  ingresses:
    - https://order-api.example.no
  replicas:
    min: 2
    max: 6
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      memory: 512Mi
  startup:
    path: /internal/health/startup
  readiness:
    path: /internal/health/ready
  liveness:
    path: /internal/health/live
```

[Application-spesifikasjonen](https://docs.nais.io/workloads/application/reference/application-spec/) er den autoritative kontrakten. Den dekker også service-protokoll/port, autoskaleringsstrategier, miljøvariabler, ingress, access policy, identitetsintegrasjoner og tilgang til utvalgte ressurser. Støtte kan variere mellom miljøer; valider mot miljøoversikten i stedet for å kopiere et manifest blindt.

Manifestet er ikke en generert deployment-fil som kan ignoreres. Det er produksjonsarkitektur i source control og fortjener gjennomgang av eksponering, permissions, ressurser, skalering, identitet og avhengigheter.

## Utform containeren for orkestrering

### Image og prosess

Bruk et minimalt vedlikeholdt base image, kjør som non-root, lås avhengigheter og produser en immutable versjon. Lagre konfigurasjon utenfor imaget. Hovedprosessen skal kjøre i forgrunnen og avslutte ved uopprettelig feil slik at Kubernetes kan starte den på nytt.

### Resource requests og limits

Requests påvirker Kubernetes-scheduling og ressursreservasjon. Sett dem fra observert normalbruk og vurder på nytt etter lasttest og produksjonsmåling. For høye requests sløser delt kapasitet; for lave øker risikoen for resource starvation. En minnegrense kan begrense en lekkasje, men gir OOM-terminering hvis den ligger under normale topper.

### Probes har ulike betydninger

- **startup** gir en treg applikasjon tid før andre probes avgjør at den er usunn;
- **readiness** svarer på om denne instansen skal motta trafikk nå;
- **liveness** svarer på om prosessen sitter fast og bør restartes.

En liveness-probe som avhenger av alle eksterne avhengigheter, kan gjøre ett avbrudd til en restart-storm. Readiness kan inkludere kritiske serving-avhengigheter, men liveness bør normalt være smalere.

### Replikaer, skalering og state

To eller flere replikaer reduserer unødvendig nedetid ved rescheduling og rolling deployment. Horisontale replikaer krever varig state utenfor containeren og koordinering av singleton-arbeid. Hvis bare én instans skal utføre en oppgave, bruker du jobb, distribuert koordinering eller plattformens leader election fremfor tilfeldigheter.

Autoskalering kan reagere på CPU og støttede workload-signaler. Et maksimum skal beskytte nedstrøms kapasitet. Seks replikaer som åpner 30 database connections hver, krever plass til 180 forbindelser pluss driftsmargin.

### Graceful termination

Kubernetes kan terminere en pod ved rollout, nodevedlikehold eller skalering. Applikasjonen må håndtere `SIGTERM`, slutte å ta imot nytt arbeid, fullføre eller trygt avbryte pågående operasjoner, lukke forbindelser og avslutte innen grace period. Les offisiell [god praksis](https://docs.nais.io/workloads/explanations/good-practices/).

## Fra repository til runtime

Den vanlige leveringskjeden er:

1. Registrer et autorisert GitHub-repository for NAIS-teamet.
2. Bygg og test applikasjonen.
3. Bygg, signer og push container-imaget gjennom støttede actions.
4. Deploy manifestet og nøyaktig workload-image med NAIS deploy action.
5. Deployment-tjenesten validerer autorisasjon og ønsket tilstand.
6. Operators avstemmer Application, Kubernetes-ressurser og integrasjoner.
7. Teamet observerer rollout-health og produksjonssignaler.

Repository-autorisasjon begrenser hvilken kilde som kan deploye for teamet. Pipeline-identiteten er ikke applikasjonens runtime-identitet. Hold oppgavene separate og unngå langlivede credentials.

At en deployment er akseptert, er ikke det samme som en frisk produktrelease. Progressiv rollout, kompatibilitet med tidligere skjema- og API-versjoner, startup-oppførsel, smoke tests og rollback/roll-forward hører fortsatt til leveringsdesignet. Følg den offisielle [build og deploy-guiden](https://docs.nais.io/build/how-to/build-and-deploy/).

## Rekkefølge ved feilsøking

Når deployment feiler, går du fra deklarert tilstand til runtime-evidens:

1. inspiser resultat og valideringsfeil fra deploy action;
2. inspiser Application-status;
3. list og beskriv pods for scheduling-, image- eller probe-feil;
4. les applikasjons- og sidecar-logger;
5. sjekk events, resource pressure og tilgjengeligheten til avhengigheter;
6. sammenlign deployet image og manifest med forventet commit.

NAIS Console håndterer de fleste administrasjonsoppgaver; `kubectl` er fortsatt nyttig for avansert diagnose. Ikke «reparer» en operatorstyrt ressurs manuelt og forvent at endringen varer.

## Arkitekturkontroll

Et API har én replika, lagrer opplastede filer i `/tmp`, har en liveness-probe som spør tre nedstrøms API-er og åpner 40 databaseforbindelser per instans. Forklar feilmodusene før `max` replikaer økes fra 2 til 20.

Designet risikerer nedetid ved restart, filtap, kaskaderende restart-stormer og 800 mulige databaseforbindelser. Rett state, probe-semantikk, replika-tilgjengelighet, connection pools og nedstrøms kapasitet før autoskalering behandles som løsningen.

## Offisielle studielenker

- [Hello Nais-tutorial](https://docs.nais.io/tutorials/hello-nais/)
- [Application-eksempel](https://docs.nais.io/workloads/application/reference/application-example/)
- [Application-spesifikasjon](https://docs.nais.io/workloads/application/reference/application-spec/)
- [Naisjob](https://docs.nais.io/workloads/job/)
- [Build og deploy](https://docs.nais.io/build/how-to/build-and-deploy/)

### Google Cloud-bro

NAIS Applications blir til slutt Kubernetes-workloads på GKE. [Compute-modulen for Google Cloud]({{< relref "/cloud-platforms/google-cloud/04-compute-and-containers.no.md" >}}) forklarer reconciliation-, container- og feilbegrepene som fortsatt gjelder under det korte manifestet.

---
title: "Plattformmodell og arkitektur"
translationKey: nais-platform-model
module: "01"
weight: 10
track: "Grunnlag"
duration: "25 min"
level: "Grunnleggende"
summary: "Forstå NAIS som et produkt for autonome team, modellen for team/miljø/workload og hvordan kontrakten kobles til Kubernetes og Google Cloud."
topics: ["Team og miljøer", "Paved roads", "Naiserator og GKE"]
last_reviewed: "22. august 2026"
outcomes:
  - "Forklare hva NAIS er – og ikke er"
  - "Koble team-, miljø- og workload-begreper til Kubernetes"
  - "Skille plattformansvar fra produktansvar"
  - "Beskrive hvordan en NAIS-deklarasjon blir til skyressurser"
next: { url: "/cloud-platforms/nais/02-workloads-and-delivery/", label: "Neste: workloads og levering" }
---

## NAIS er et plattformprodukt

NAIS skal gi team de tekniske kapabilitetene de trenger for å utvikle og kjøre programvare sikkert, uten at hvert team blir et Kubernetes-plattformteam. Plattformen tilbyr byggeklosser for runtime, identitet, trafikk, data, observability, secrets, levering og drift.

Driftsidéen er viktig: Et uhindret tverrfaglig team som kan ta ansvar for det det bygger, lærer raskere enn et team som sender enhver produksjonsendring til en separat driftskø. NAIS fjerner derfor repeterbar plattformkompleksitet samtidig som produktteamet beholder innsikten og kontrollene det trenger.

Fire prinsipper følger:

1. **Selvbetjening:** ønsket tilstand deklareres gjennom versjonerte manifester, Console eller plattform-API-er.
2. **Paved roads:** trygge standarder og integrerte kapabiliteter gjør den vanlige veien enklere.
3. **Teameierskap:** produktteamet eier kode, data, brukerutfall og produksjonsoppførsel.
4. **Plattform som produkt:** NAIS har brukere, dokumentasjon, API-er, konsoll, støtte og en kontrakt i utvikling – ikke bare clustere.

Les [Hva er NAIS?](https://docs.nais.io/explanations/nais/) og [Hva er et team?](https://docs.nais.io/explanations/team/).

## Kjernebegrepene

| NAIS-begrep | Praktisk betydning | Underliggende idé |
| --- | --- | --- |
| Team | Personer med ansvar for relaterte workloads og ressurser | Eierskaps- og tilgangsgrense |
| Tenant | En organisasjon eller plattforminstallasjon som bruker NAIS | Overordnet organisasjonskontekst |
| Miljø / cluster | Et runtime-mål som utvikling eller produksjon | Kubernetes-cluster; skymiljøer bruker GKE |
| Namespace | Teamets scope inne i en cluster | Kubernetes Namespace |
| Workload | Kode som kjører som Application eller Naisjob | Kubernetes-ressurser og plattformintegrasjoner |
| Ressurs | Data- eller plattformkapabilitet teamet ber om | Custom resource og/eller administrert tjeneste |

Et team er ikke bare en tilgangsgruppe. Det bør speile personene som kan utvikle og drifte workloadene. Hvis eierskapet er uklart, kan ikke manifester og dashboards kompensere.

Miljøgrenser er viktige. Utvikling og produksjon skiller seg i identiteter, data, eksponering, pålitelighet og endringskontroll. «Det virket i dev» beviser byggeveien, ikke produksjonsberedskap.

I dagens skyarkitektur har hvert team også et dedikert Google Cloud-prosjekt for hvert miljø. En forespurt bucket blir for eksempel provisionert i teamets prosjekt for det tilsvarende miljøet. Kubernetes-namespace og Google Cloud-prosjekt uttrykker dermed beslektede team-/miljøgrenser i ulike lag.

## Lagene under utviklerkontrakten

I et skymiljø kan stacken forenkles slik:

```text
Produktteam
  └─ NAIS-manifest / Console / API
      └─ Naiserator og operators for kapabiliteter
          └─ Kubernetes-ressurser og plattformkomponenter
              └─ GKE-, Google Cloud- og Aiven-tjenester
```

En **NAIS Application** er en Kubernetes Custom Resource. Kjerneoperatoren [Naiserator](https://github.com/nais/naiserator) observerer ønsket tilstand og produserer Kubernetes-ressursene og integrasjonene spesifikasjonen krever. Andre operators håndterer kapabiliteter som identitet eller data.

Dette er en reconciliation-modell, ikke et engangsscript. Hvis noen endrer en generert ressurs eller leverandørinnstilling manuelt, kan en operator gjenopprette deklarert tilstand. Varige endringer hører hjemme i den støttede deklarasjonen eller administrasjonsflaten.

## Abstraksjon uten illusjon

NAIS lar en utvikler si «kjør dette imaget med to replikaer, eksponer denne ingressen, tillat denne caller-en og koble til denne databasen». Plattformen kan oversette intensjonen til Deployments, Services, ingress-ressurser, identiteter, policies og konfigurasjon av administrerte tjenester.

Abstraksjonen får ikke de underliggende egenskapene til å forsvinne:

- GKE-plassering definerer fortsatt feildomener og kapasitet;
- Google Cloud IAM styrer fortsatt tilgang til skyressurser;
- VPC- og Kubernetes-nettverk frakter fortsatt trafikken;
- Cloud SQL har fortsatt egenskaper for connections, tilgjengelighet og recovery;
- Aiven Kafka har fortsatt partitions, offsets og skjemahensyn;
- Kubernetes starter og flytter fortsatt containere på nytt.

Produktteam trenger ikke drifte hvert lag, men arkitekter bør vite hvilket lag som eier en oppførsel når risiko eller feil skal analyseres.

## Delt ansvar

| Plattformansvar | Produktteamets ansvar |
| --- | --- |
| Clustere og delte plattformkomponenter | Applikasjonskode og faglig korrekthet |
| Operators, CRD-er, automasjon og støttede standarder | Workload-manifester og ressursvalg |
| Integrasjoner for identitet, data og telemetri | Riktig identitetsbruk og faglig autorisasjon |
| Plattformdokumentasjon, Console, API-er og støtte | Dataformål, personvern, livssyklus og recovery-krav |
| Plattformtilgjengelighet og oppgraderingsvei | Produkt-SLO-er, varsler, hendelser, avhengigheter og kostnad |

Den nøyaktige grensen varierer med kapabiliteten. En administrert database kan ha automatisert infrastrukturbackup, mens teamet fortsatt må vite om forretningstjenesten kan gjenopprettes innen påkrevd RPO og RTO.

## Arkitekturkontroll

Et team ber plattformgruppen «eie produksjon» fordi NAIS eier Kubernetes. Skriv om utsagnet som en eksplisitt ansvarsmodell.

Et godt svar sier at plattformteamet eier delt runtime, operators, støttede integrasjoner og plattformtilgjengelighet. Produktteamet eier om tjenesten virker for brukerne, kvalitet på kode og avhengigheter, manifester, faglig tilgang, data, SLO-er, respons på varsler, recovery-krav og produkthendelser. Begge sider trenger en eskaleringskontrakt ved plattformfeil.

## Offisielle studielenker

- [Hva er NAIS?](https://docs.nais.io/explanations/nais/)
- [Under the hood](https://docs.nais.io/explanations/under-the-hood/)
- [Runtime-miljøet](https://docs.nais.io/workloads/explanations/environment/)
- [Naiserator-kildekode](https://github.com/nais/naiserator)

### Google Cloud-bro

Se [grunnlagsmodulen for Google Cloud]({{< relref "/cloud-platforms/google-cloud/01-foundations.no.md" >}}) for å forstå prosjektene, lokasjonene og faktureringsmodellen under NAIS. NAIS endrer grensesnittet produktteamet bruker, mens skyens ressurshierarki fortsatt inngår i plattformteamets kontrollplan.

---
title: "Nettverk og tilkobling"
translationKey: gcp-networking
module: "03"
weight: 30
track: "Infrastruktur"
duration: "25 min"
level: "Viderekommen"
summary: "Bygg en mental modell av globale VPC-nettverk, regionale subnett, routes, brannmurer, lastbalansering, DNS og privat tjenestetilgang."
topics: ["VPC og subnett", "Ingress og egress", "Hybrid tilkobling"]
last_reviewed: "22. august 2026"
outcomes:
  - "Forklare hvorfor en VPC er global mens subnettene er regionale"
  - "Spore ingress, east-west-trafikk og egress separat"
  - "Velge mellom peering, Shared VPC, VPN og Interconnect"
  - "Finne hvor DNS, brannmur og privat API-tilgang påvirker et kall"
next: { url: "/cloud-platforms/google-cloud/04-compute-and-containers/", label: "Neste: compute og containere" }
---

## Start med pakkens vei

Skynettverk blir håndterbart når du følger et kall fra kilde til mål og stiller de samme spørsmålene ved hvert hopp:

1. Hvordan finner kilden mål-navnet i DNS?
2. Hvilken IP og route velges?
3. Hvilken brannmur-, identitets- eller tjenestepolicy tillater trafikken?
4. Hvilken lastbalanserer eller proxy terminerer forbindelsen?
5. Hvordan går svaret tilbake, og hvor kan det observeres?

Hold tre veier fra hverandre: **ingress** inn til en workload, **east-west** mellom workloads og **egress** mot API-er eller internett. De bruker ofte ulike kontroller.

## VPC-nettverk er globale; subnett er regionale

Et Google Cloud Virtual Private Cloud-nettverk er en **global ressurs**. Det kan inneholde **regionale subnett**, routes og firewall policies som kobler ressurser på tvers av regioner. Dette skiller seg fra skyer der det virtuelle nettverket i seg selv er regionalt.

IP-planlegging er fortsatt viktig. Velg ikke-overlappende adresseområder med plass til miljøer, clustere, tjenester og hybridnettverk. Overlapp gjør peering og hybrid routing vanskelig senere. Foretrekk custom-mode VPC-er for bevisste produksjonsdesign. Det automatisk opprettede default-nettverket er praktisk for utforsking, men vanligvis for permissivt og implisitt for en styrt landing zone.

VPC firewall rules er stateful og gjelder instanser eller nettverksgrensesnitt basert på retning, prioritet, mål og kilde. Hierarchical firewall policies kan håndheve regler høyere i organisasjonen. En brannmur tillater nettverkskontakt; den autoriserer ikke en faglig handling.

Les [VPC-oversikten](https://docs.cloud.google.com/vpc/docs/vpc) og [oversikten over firewall policies](https://docs.cloud.google.com/firewall/docs/firewall-policies-overview).

## Shared VPC og peering løser ulike eierskapsproblemer

**Shared VPC** lar et host project eie nettverk og eksponere utvalgte subnett til service projects. Det er nyttig når et nettverks- eller plattformteam styrer tilkobling, mens produktteam eier workloads i separate prosjekter. IAM styrer hvem som kan bruke hvert subnett.

**VPC Network Peering** kobler to uavhengig administrerte VPC-nettverk med private IP-ruter. Nettverkene forblir separate, og peering er ikke transitiv: Hvis A peerer med B og B med C, når ikke A automatisk C gjennom B.

**Private Service Connect** publiserer eller konsumerer administrerte tjenester og produsenttjenester gjennom private endepunkter. Dette er ofte en bedre abstraksjon enn bred nettverkspeering når kontrakten er «bruk denne tjenesten», ikke «slå sammen disse nettverkene».

Velg ut fra eierskap og eksponering:

| Behov | Typisk mekanisme |
| --- | --- |
| Sentralt nettverk, mange workload-prosjekter | Shared VPC |
| Privat routing mellom uavhengige VPC-er | VPC Peering |
| Privat tjenesteendepunkt med begrenset eksponering | Private Service Connect |
| Kryptert forbindelse over internett | Cloud VPN |
| Dedikert privat virksomhetstilkobling | Cloud Interconnect |

## Ingress, lastbalansering og DNS

Google Cloud tilbyr globale og regionale lastbalanseringsmodeller for ulike protokoller og backends. For en internettilgjengelig HTTP-applikasjon kan en global external Application Load Balancer gi én anycast-IP, TLS-terminering, routing, health checks og integrasjon med Cloud Armor. En regional internal Application Load Balancer er et annet valg for private regionale konsumenter.

Cloud DNS leverer autoritative offentlige og private soner. Private soner og forwarding policies påvirker hvordan workloads slår opp interne navn. DNS-feil kan ligne nettverks- eller applikasjonsfeil, så oppløsning må inngå i observability og feilsøking.

Cloud Armor legger til web application firewall- og DDoS-relaterte kontroller for støttede lastbalanserte applikasjoner. Tjenesten reparerer ikke svak applikasjonsautorisasjon eller utrygg inputhåndtering.

## Egress og tilgang til Google API-er

En workload uten ekstern IP kan bruke Cloud NAT for utgående internettforbindelser. NAT tar ikke imot uoppfordrede innkommende sesjoner og begrenser ikke i seg selv hvilke eksterne verter en workload kan kontakte. Egress firewall policy, proxyer eller plattformspesifikke kontroller kan fortsatt være nødvendig.

Tilgang til Google API-er har flere private routing-mønstre. Riktig valg avhenger av om workloaden har ekstern IP, om den må bli innenfor en service perimeter, hvilke API-endepunkter som støttes og hvordan DNS er satt opp. «Bare privat IP» er en tiltenkt egenskap som må verifiseres ende til ende, ikke en avkryssing på én ressurs.

## Arkitekturkontroll

Et offentlig API kjører i to regioner. Databasen er privat, administratorer kobler til fra et lokalt datasenter, og produktprosjektene skal ikke administrere delte routes.

Et plausibelt design bruker sentralt administrert Shared VPC, service projects for workloads, privat databasetilkobling, global HTTP(S)-lastbalansering med helsesjekkede backends, Cloud Armor og Cloud VPN eller Interconnect for hybrid tilgang. Det detaljerte svaret må også beskrive DNS-eierskap, egress, firewall targets, route exchange, regional feiloppførsel og hvilket team som drifter hver komponent.

## Offisielle studielenker

- [VPC-nettverk](https://docs.cloud.google.com/vpc/docs/vpc)
- [Shared VPC](https://docs.cloud.google.com/vpc/docs/shared-vpc)
- [Cloud Load Balancing-oversikt](https://docs.cloud.google.com/load-balancing/docs/load-balancing-overview)
- [Private Service Connect](https://docs.cloud.google.com/vpc/docs/private-service-connect)
- [Hybrid tilkobling](https://docs.cloud.google.com/network-connectivity/docs/concepts/hybrid-connectivity)

### NAIS-bro

NAIS presenterer nettverk primært gjennom ingresses og `accessPolicy`. Plattformen oversetter deklarerte tjenesterelasjoner til routing og nettverkskontroller i underliggende Kubernetes og skynettverk. Teamene må fortsatt forstå navn, TLS, ingress-eksponering, utgående avhengigheter og timeouts. En access policy etablerer tillatt tilkobling; tokenvalidering og faglig autorisasjon er egne lag.

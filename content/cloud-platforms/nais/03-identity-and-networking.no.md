---
title: "Identitet, autentisering og zero-trust-trafikk"
translationKey: nais-identity-networking
module: "03"
weight: 30
track: "Sikkerhet"
duration: "35 min"
level: "Viderekommen"
summary: "Skill bruker-, delegasjons-, maskin- og workload-identiteter; utform eksplisitte access policies; og eksponer tjenester bare til tiltenkt målgruppe."
topics: ["ID-porten og TokenX", "Maskinporten og Entra ID", "accessPolicy"]
last_reviewed: "22. august 2026"
outcomes:
  - "Velge identitetsmekanisme fra aktør og tillitsgrense"
  - "Skille workload-identitet fra bruker- eller delegert identitet"
  - "Utforme inbound og outbound access policies med minste privilegium"
  - "Velge service discovery eller ingress fra tiltenkt målgruppe"
next: { url: "/cloud-platforms/nais/04-data-and-observability/", label: "Neste: data og observability" }
---

## Start med aktøren

Identitetsdesign feiler når hvert token behandles som «den innloggede brukeren». For hvert kall navngir du aktør og kontekst:

- Bruker en norsk innbygger tjenesten?
- Er en ansatt logget inn i en intern applikasjon?
- Kaller én intern workload en annen som seg selv?
- Må et nedstrøms kall bevare delegert brukerkontekst?
- Kaller en ekstern organisasjon maskin-til-maskin?
- Aksesserer applikasjonen selv en skyressurs?

Dette er forskjellige tillitsrelasjoner. NAIS integrerer flere mekanismer slik at team ikke bygger alle protokollflyter fra grunnen, men teamet må velge og validere den riktige.

## Identitetsmekanismene

| Behov | Typisk mekanisme | Representert identitet |
| --- | --- | --- |
| Innlogging for innbygger | ID-porten | Sluttbruker / norsk innbygger |
| Internt kall på vegne av innbygger | TokenX | Delegert innbyggerkontekst i en intern tjenestekjede |
| Ansattinnlogging eller intern organisasjonsidentitet | Microsoft Entra ID | Ansatt eller intern workload, avhengig av flyt |
| Maskinintegrasjon på tvers av organisasjoner | Maskinporten | Den eksterne organisasjonens klient |
| Workload mot plattform-/skyressurs | Workload Identity | Den kjørende workloaden selv |

Tilgjengelighet og nøyaktig konfigurasjon varierer mellom tenants og miljøer. Bruk [NAIS-oversikten for autentisering](https://docs.nais.io/auth/) og miljøspesifikk dokumentasjon som fasit.

### Workload Identity

Hver NAIS-workload har egen identitet, implementert gjennom en Kubernetes Service Account. Plattformen injiserer en kortlivet OIDC-identitet som støttede tjenester kan veksle eller stole på. Kortlivet identitet reduserer distribusjonen av statiske secrets og gir et mer presist audit trail.

Ikke forveksle dette med sluttbrukerens identitet. Hvis `order-api` kaller Cloud Storage med sin workload-identitet, autoriserer Google Cloud applikasjonen. Hvis forretningsregelen sier at innlogget innbygger bare kan hente egen kvittering, må `order-api` håndheve regelen separat med betrodd bruker-/delegasjonskontekst.

### TokenX og delegasjon

TokenX støtter interne applikasjoner som handler på vegne av en innbygger autentisert gjennom ID-porten. Delegasjon bør bare bevares der nedstrømstjenesten trenger den. Valider issuer, audience og nødvendige claims, og autoriser den faglige handlingen – ikke bare tokenets gyldighet.

### Maskinporten og Entra ID

Maskinporten passer maskin-til-maskin-integrasjon på tvers av organisasjoner og scopes gitt til klienten. Entra ID dekker ansattinnlogging og interne applikasjonsscenarier i støttede NAIS-miljøer. Et «maskintoken» identifiserer ikke mennesket bak en handling; legg til faglig audit-kontekst der dette kreves.

## Access policy er tjenestegrafen

NAIS starter med zero trust: Trafikk mellom workloads er ikke automatisk tillatt. `accessPolicy` deklarerer tillatte relasjoner.

```yaml
spec:
  accessPolicy:
    inbound:
      rules:
        - application: order-frontend
    outbound:
      rules:
        - application: inventory-api
          namespace: stock-team
      external:
        - host: api.external-provider.no
```

En inbound rule ligger hos mottakende applikasjon og identifiserer callers. En outbound rule ligger hos caller og identifiserer mål. Avhengig av støttet identitetsintegrasjon kan relasjonen også konfigurere hvilke klientidentiteter som aksepteres.

Gjennomgå access policies som en graf:

1. Tilsvarer hver kant en virkelig runtime-avhengighet?
2. Er scope for application, namespace, cluster og external host så smalt som mulig?
3. Er wildcard begrunnet og tidsavgrenset?
4. Hvilket token eller hvilken applikasjonsautorisasjon kreves etter nettverkstilgang?
5. Hva skjer hvis avhengigheten er treg eller utilgjengelig?

Nettverkstilgang, tokenautorisasjon og **faglig autorisasjon** er separate lag. Bestått lag betyr aldri automatisk bestått neste lag.

## Service discovery eller ingress

For workloads i samme miljø bruker du Kubernetes service discovery: `http://<application>` i samme namespace eller `http://<application>.<namespace>` på tvers av namespaces. Dette unngår ekstern eksponering og unødvendige nettverkshopp; access policy begrenser relasjonen.

Bruk **ingress** når målgruppen er utenfor miljøet – mennesker, nettlesere eller tjenester i et annet miljø/nettverk. Valgt domene kommuniserer tiltenkt eksponering. TLS-terminering og routing er plattformkapabiliteter, men applikasjonen må fortsatt autentisere målgruppen.

Ikke bruk ekstern ingress bare fordi det er enkelt å kopiere en URL. Start med målgruppen og velg så eksponering. Se [Eksponering av applikasjon](https://docs.nais.io/workloads/application/explanations/expose/).

## Secrets og konfigurasjon

Foretrekk identitet fremfor delt secret når målet støtter det. For gjenværende secrets bruker du støttet NAIS-kapabilitet og eksponerer dem for workloaden som dokumentert. Commit aldri secret-verdier i manifest eller repository.

Behandle secrets som livssyklusobjekter: identifiser eier, konsument, kilde, rotasjon, tilbakekalling og audit trail. Miljøvariabler er praktiske, men kan lekke gjennom diagnostikk eller prosessinspeksjon; applikasjoner må unngå ukritisk logging av konfigurasjon.

Også ikke-hemmelig konfigurasjon trenger eierskap og utrullingsdisiplin. En konfigurasjonsendring kan ødelegge produksjon like effektivt som en kodeendring.

## Arkitekturkontroll

En innbyggerrettet frontend kaller et internt saks-API, som kaller et eksternt kommune-API. Skill kontrollene.

Et plausibelt design bruker ID-porten for innbyggerinnlogging, TokenX der saks-API-et trenger delegert innbyggerkontekst, eksplisitte inbound/outbound access policies for den interne tjenestekanten, Maskinporten for maskinkallet på tvers av organisasjoner hvis det eksterne API-et krever det, og faglig autorisasjon i hver tjeneste. Det må også beskrive ingress-målgruppe, token audiences/scopes, timeouts, audit-kontekst og feiloppførsel.

## Offisielle studielenker

- [Autentisering og autorisasjon](https://docs.nais.io/auth/)
- [Workload Identity](https://docs.nais.io/auth/workload-identity/)
- [Access policy-referanse](https://docs.nais.io/workloads/reference/access-policies/)
- [Eksponering av applikasjon](https://docs.nais.io/workloads/application/explanations/expose/)
- [Secrets](https://docs.nais.io/services/secrets/)

### Google Cloud-bro

[Identitetsmodulen for Google Cloud]({{< relref "/cloud-platforms/google-cloud/02-identity-and-security.no.md" >}}) forklarer prinsippene for service accounts og kortlivede credentials under workload-tilgang til Google-tjenester. [Nettverksmodulen]({{< relref "/cloud-platforms/google-cloud/03-networking-and-connectivity.no.md" >}}) gir VPC- og ingress/egress-modellen under NAIS access policies.

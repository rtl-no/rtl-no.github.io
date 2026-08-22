---
title: "Identitet, IAM og sikkerhetskontroller"
translationKey: gcp-identity-security
module: "02"
weight: 20
track: "Sikkerhet"
duration: "30 min"
level: "Grunnleggende"
summary: "Skill autentisering fra autorisasjon, forstå principals, roller og policies, og gi workloads kortlivede identiteter uten nedlastede nøkler."
topics: ["IAM policies", "Service accounts", "Workload identity"]
last_reviewed: "22. august 2026"
outcomes:
  - "Lese en IAM-avgjørelse som principal + rolle + ressurs"
  - "Skille bruker-, gruppe-, service account- og fødererte identiteter"
  - "Unngå langlivede service account-nøkler i normale design"
  - "Plassere preventive, detektive og data perimeter-kontroller riktig"
next: { url: "/cloud-platforms/google-cloud/03-networking-and-connectivity/", label: "Neste: nettverk og tilkobling" }
---

## Autentisering og autorisasjon er ulike spørsmål

**Autentisering** fastslår hvem eller hva en caller er. **Autorisasjon** avgjør hvilke handlinger denne principalen kan utføre på hvilke ressurser. Google Cloud IAM er primært autorisasjonssystemet; Cloud Identity, Google Workspace eller en ekstern identity provider kan levere workforce-identiteter.

En binding i en IAM allow policy kobler tre ting:

```text
principal  +  rolle (permissions)  +  ressurs-scope
```

En gruppe kan for eksempel få `roles/viewer` på ett prosjekt, mens en service account for Cloud Run får en smal database-klientrolle på en bestemt ressurs. Policyen skal kunne forklares med et arbeids- eller workload-behov, ikke bekvemmelighet.

## Principals og roller

Vanlige principal-typer er:

- brukere for enkeltpersoner;
- grupper for håndterbar workforce-tilgang;
- service accounts for workloads og automatisering;
- Google-grupper, domener eller workforce pools for identitetssett;
- fødererte workload-identiteter fra systemer som GitHub eller en annen sky.

Foretrekk grupper fremfor direkte tildeling til brukere. En persons tilgang kan da følge en reviderbar prosess for inn-, rolle- og utmelding. Bruk midlertidig heving for privilegerte operasjoner i stedet for permanent eierlignende tilgang.

En **permission** er én tillatt API-operasjon. En **rolle** er en navngitt samling permissions. Basisrollene Owner, Editor og Viewer er brede; forhåndsdefinerte tjenesteroller er vanligvis et bedre utgangspunkt. Custom roles er nyttige når forhåndsdefinerte roller fortsatt er for brede, men skaper et vedlikeholdsansvar når API-er utvikles.

Effektiv allow-tilgang er unionen av relevante bindinger på ressursen og dens foreldre. Conditions kan gjøre en binding kontekstavhengig. Deny policies kan forby valgte permissions selv om en allow-binding finnes. Inspiser alltid effektiv policy, ikke bare bindingen nærmest ressursen.

Studer [IAM-oversikten](https://docs.cloud.google.com/iam/docs/overview) og [arv av policy](https://docs.cloud.google.com/iam/docs/resource-hierarchy-access-control).

## Service accounts har en dobbel natur

En service account er både:

1. en **principal** som kan få roller og kalle API-er; og
2. en **ressurs** som en annen principal kan få lov til å bruke eller impersonate.

Dette skillet viser en vanlig vei for privilegieeskalering. En bruker har kanskje ikke direkte tilgang til en lagringsbøtte, men hvis brukeren kan impersonate en overprivilegert service account, når den effektive stien likevel bøtten.

Bruk en dedikert service account for hver workload eller tillitsgrense. Gi den bare nødvendige permissions, og kontroller hvem som kan feste eller impersonate den. Ikke bruk en default service account bare fordi den allerede finnes.

### Foretrekk credentials som roterer seg selv

Nedlastede service account-nøkler er langlivede bearer credentials. De kan lekke gjennom kildekode, logger, byggeartefakter eller utviklermaskiner, og plattformen kjenner ikke alle kopiene. Google anbefaler å unngå nøkler der en tryggere mekanisme finnes.

Foretrukne mønstre er:

- fest en service account til Compute Engine eller Cloud Run og bruk Application Default Credentials;
- bruk Workload Identity Federation for GKE slik at Kubernetes-workloads får kortlivet tilgang;
- bruk Workload Identity Federation for eksterne workloads og utrullingssystemer som GitHub Actions;
- la utviklere bruke egen innlogging og ved behov kontrollert service account-impersonering.

Klientbiblioteker henter og fornyer tokens gjennom miljøet. Applikasjonskoden skal normalt ikke laste en privat JSON-nøkkel. Les Googles [sikkerhetspraksis for service accounts](https://docs.cloud.google.com/iam/docs/best-practices-service-accounts) og [oversikt over workload-identiteter](https://docs.cloud.google.com/iam/docs/workload-identities).

## Kontrollene rundt IAM

IAM svarer på «kan denne principalen utføre denne API-handlingen her?». En komplett sikkerhetsarkitektur trenger mer:

| Kontroll | Formål |
| --- | --- |
| Organization Policy Service | Begrense hvordan ressurser kan konfigureres, for eksempel tillatte lokasjoner eller eksterne IP-adresser |
| Secret Manager | Lagre, versjonere, revidere og rotere hemmeligheter som ikke kan erstattes av identitet |
| Cloud KMS | Administrere krypteringsnøkler og policy for nøkkelbruk når kundestyrte nøkler kreves |
| VPC Service Controls | Redusere mulige dataeksfiltreringsveier rundt støttede administrerte tjenester |
| Cloud Audit Logs | Registrere administrativ aktivitet, datatilgang der den er aktivert, systemhendelser og policy-avslag |
| Security Command Center | Samle sikkerhetsstatus, funn og trusselsignaler |

Kryptering i ro og transitt er en basis, ikke hele datasikkerhetsmodellen. Klassifisering, minimering, tilgang, retention, sletting, nøkkelbehov, logging og hendelseshåndtering må fortsatt utformes.

## En praktisk tilgangsgjennomgang

For hver sensitiv sti skriver du ned:

1. den opprinnelige aktøren – person, workload eller eksternt system;
2. hvert impersonerings- eller token exchange-steg;
3. målressursen og nøyaktig operasjon;
4. allow-bindingen og hvor den arves fra;
5. relevante conditions, deny policies eller organization constraints;
6. audit trail som viser handlingen.

Hvis du ikke kan rekonstruere denne kjeden, kan designet ennå ikke gjennomgås ordentlig.

## Arkitekturkontroll

En GitHub Actions-workflow deployer en Cloud Run-tjeneste som leser én bøtte og publiserer til ett Pub/Sub-topic. Utform identitetskjeden uten en nedlastet nøkkel.

Et godt svar bruker GitHubs OIDC-identitet med Workload Identity Federation, begrenser provideren til godkjent repository og branch eller environment, lar pipelinen impersonate en egen service account for utrulling, og gir runtime en annen service account med bare object-read og topic-publish. Utrullingsidentitet og runtime-identitet er forskjellige fordi de utfører ulike oppgaver.

## Offisielle studielenker

- [IAM-oversikt](https://docs.cloud.google.com/iam/docs/overview)
- [Beste praksis for service accounts](https://docs.cloud.google.com/iam/docs/best-practices-service-accounts)
- [Workload Identity Federation](https://docs.cloud.google.com/iam/docs/workload-identity-federation)
- [Organization Policy-oversikt](https://docs.cloud.google.com/resource-manager/docs/organization-policy/overview)
- [Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit)

### NAIS-bro

NAIS gir hver workload en Kubernetes-identitet og kan koble den til sky- og tokenkapabiliteter uten en applikasjonsstyrt nøkkel. `accessPolicy` beskriver tillatte tjenesterelasjoner, mens ID-porten, TokenX, Maskinporten og Entra ID dekker ulike bruker- og systemscenarier. Mekanismene fjerner ikke faglig autorisasjon: Applikasjonen avgjør fortsatt om den autentiserte aktøren kan utføre forretningshandlingen.

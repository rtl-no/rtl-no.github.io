---
title: "Ressursmodell, lokasjoner og kostnad"
translationKey: gcp-foundations
module: "01"
weight: 10
track: "Grunnlag"
duration: "25 min"
level: "Grunnleggende"
summary: "Lær hvordan organisasjoner, mapper, prosjekter, ressurser, API-er, regioner, soner og fakturering henger sammen før du deployer noe."
topics: ["Ressurshierarki", "Regioner og soner", "Fakturering og kvoter"]
last_reviewed: "22. august 2026"
outcomes:
  - "Forklare hierarkiet organisasjon → mappe → prosjekt → ressurs"
  - "Velge en passende regional, sonal eller global ressurs"
  - "Skille tillit, livssyklus og fakturering med prosjekter"
  - "Skille mellom budsjetter, kvoter og labels som styringsmekanismer"
next: { url: "/cloud-platforms/google-cloud/02-identity-and-security/", label: "Neste: identitet og sikkerhet" }
---

## Ressurshierarkiet er kontrollstrukturen

De fleste Google Cloud-ressurser tilhører et **prosjekt**. Prosjekter kan ligge direkte under en **organisasjon** eller grupperes i **mapper**, som også kan være nøstet. Tjenesteressurser – som en Cloud Run-tjeneste, en GKE-cluster eller en lagringsbøtte – ligger under et prosjekt.

```text
Organisasjon
├── Mappe: felles-plattform
│   ├── Prosjekt: network-host-prod
│   └── Prosjekt: security-logging
└── Mappe: produktområde
    ├── Prosjekt: orders-dev
    └── Prosjekt: orders-prod
```

Hierarkiet har tre oppgaver samtidig:

1. **Eierskap og livssyklus:** ressurser tilhører en organisasjon og et prosjekt, ikke personen som opprettet dem.
2. **Arv av policy:** IAM allow policies og organization policies kan festes høyt i treet og påvirke etterkommere.
3. **Grenser:** prosjekter gir praktiske grenser for tilgang, aktiverte API-er, kvoter, kostnadsanalyse og ressursenes livssyklus.

En arvet IAM allow policy er additiv: en tildeling på organisasjons- eller mappenivå gjelder fortsatt under dette nivået. En smalere policy på et barn opphever ikke bare tildelingen. Deny policies, principal access boundary policies og organization policy constraints løser ulike kontrollproblemer. «IAM policy» er derfor ikke én universell mekanisme.

Les de offisielle guidene til [ressurshierarkiet](https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy) og [tilgang gjennom hierarkiet](https://docs.cloud.google.com/iam/docs/resource-hierarchy-access-control).

## Utform prosjekter rundt grenser

Et prosjekt bør inneholde ressurser som deler en fornuftig tillits- og livssyklusgrense. Utvikling og produksjon skilles ofte fordi miljøene ikke bør dele bred operatørtilgang, kvoter eller risiko for utilsiktet sletting. Egne prosjekter for felles nettverk og sentral logging kan være nyttige når et plattformteam eier disse kapabilitetene.

Unngå begge ytterpunktene:

- ett enormt prosjekt gjør tilganger, kvoter, feilradius og kostnadsplassering vanskelige å forstå;
- ett prosjekt for hver lille ressurs skaper administrasjon og komplisert IAM på tvers av prosjekter.

Et godt spørsmål er: **Hvilke ressurser bør få tilgang, endres, faktureres og avvikles sammen?** Svaret peker ofte mot en passende prosjektgrense.

Prosjekt-ID-er er globalt unike og i praksis permanente etter opprettelse. Prosjektnavn er lesbare og kan endres; prosjektnummer er genererte numeriske identifikatorer som brukes av flere API-er og principal-formater i IAM. Du må vite hvilken variant en kommando eller policy forventer.

## Tjenester og API-er må aktiveres

Google Cloud-kapabiliteter eksponeres gjennom tjeneste-API-er. Når Cloud Run API aktiveres, blir tjenesten tilgjengelig i prosjektet; IAM bestemmer fortsatt hvem som kan opprette eller kalle ressurser. Aktivering av en tjeneste gir derfor ikke tilgang.

De vanligste grensesnittene er:

- Google Cloud-konsollen for utforsking og visuell administrasjon;
- `gcloud` CLI for repeterbare kommandoer;
- Cloud Shell som administrert kommandomiljø;
- REST-API-er og klientbiblioteker for applikasjoner;
- Infrastructure as Code som Terraform for gjennomgåtte, reproduserbare miljøer.

Foretrekk automatisering for varige miljøer, men lær hvordan resultatet ser ut i konsollen. Automatisering uten operasjonell innsikt er ikke nok.

## Globale, regionale og sonale ressurser

En **region** er et uavhengig geografisk område. En **sone** er et utrullingsområde i en region og utgjør ett feildomene. Google Cloud har også multi-regionale og globale tjenester. Den nøyaktige lokasjonsmodellen tilhører hvert produkt; den kan ikke utledes fra produktkategorien alene.

Lokasjon påvirker:

- forsinkelse til brukere og avhengigheter;
- robusthet mot feil i sone eller region;
- datalokalitet og regulatoriske forpliktelser;
- tilgjengelige tjenester og maskintyper;
- kostnad for nettverkstrafikk og replikert lagring;
- katastrofegjenoppretting.

For en regional tjeneste med høy tilgjengelighet fordeler du sonale ressurser over minst to soner og sikrer at alle avhengigheter støtter den tiltenkte feilmodellen. To applikasjonsinstanser i ulike soner hjelper ikke hvis begge avhenger av én sonal database.

`europe-north1` er Google Clouds region i Finland. En norsk workload kan bruke den, men «nær Norge» betyr ikke «data lagres i Norge». Arkitekten må verifisere lokasjon, replikering og databehandlervilkår for hver tjeneste og dataklasse. Bruk den oppdaterte [lokasjonsdokumentasjonen](https://cloud.google.com/about/locations) som fasit.

## Fakturering, budsjetter og kvoter

En **Cloud Billing account** betaler for tilknyttede prosjekter. Tilgang til fakturering og tilgang til ressurser er separate forhold. Et FinOps-vennlig oppsett synliggjør produkteierskap gjennom prosjektstruktur, labels eller tags, billing export og avtalte fordelingsregler.

Hold fire mekanismer fra hverandre:

| Mekanisme | Hva den gjør | Hva den ikke gjør |
| --- | --- | --- |
| Budsjett | Følger prognose eller faktisk kostnad og sender varsler | Stanser automatisk all bruk som standard |
| Kvote | Begrenser forbruk av en tjeneste eller ressurs | Uttrykker et økonomisk mål |
| Label | Legger til metadata for filtrering og kostnadsanalyse | Håndhever en sikkerhetsregel i hele hierarkiet |
| Tag | Fester styrte metadata som policies kan referere til | Erstatter navngivning og eierskapsmodell |

Eksporter detaljerte faktureringsdata til BigQuery når du trenger bedre fordelings- og trendanalyse enn konsollen gir. Varsler trenger en eier og en handling: En budsjett-e-post ingen følger opp, er bare en rapport.

## Arkitekturkontroll

Du utformer en organisasjon med tre produktteam, separate utviklings- og produksjonsmiljøer og et sentralt nettverksteam. Skisser et hierarki som støtter arvede basisregler, sentralt nettverkseierskap og teamautonomi. Svar deretter på:

1. Hvilken tilgang arves fra organisasjonen eller mappen?
2. Hvilke ressurser deler prosjekt, og hvorfor?
3. Hvilke feil tåler den valgte region- og sonemodellen?
4. Hvem mottar budsjett- og kvotevarsler, og hva gjør de?

Målet er ikke ett perfekt tre, men et hierarki der grensene for eierskap, tillit og livssyklus kan forklares.

## Offisielle studielenker

- [Oversikt over Google Cloud](https://docs.cloud.google.com/docs/overview)
- [Ressurshierarkiet](https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy)
- [Geografi og regioner](https://cloud.google.com/about/locations)
- [Cloud Billing-dokumentasjon](https://docs.cloud.google.com/billing/docs)
- [Oversikt over kvoter](https://docs.cloud.google.com/docs/quotas/overview)

### NAIS-bro

Produktteam på NAIS arbeider normalt med **team, tenants, clustere og namespaces** i stedet for å utforme Google Cloud-organisasjonen og prosjektene selv. Skygrensene finnes fortsatt under. Plattformteamet eier mye av strukturen og policyene; applikasjonsteamet må fortsatt forstå miljøseparasjon, datalokasjon, kostnadseierskap og livssyklusen til ressursene det ber om.

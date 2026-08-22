---
title: "Google Cloud"
headline: "Forstå skyen under plattformen."
description: "Et praktisk læringsløp gjennom Google Clouds ressursmodell, identitet, nettverk, compute, data og drift – med en direkte bro til NAIS."
translationKey: google-cloud
type: cloud-learning
platform: "Google Cloud"
platform_key: gcp
level: "Grunnlag → arkitektur"
last_reviewed: "22. august 2026"
path_note: "Følg modulene i rekkefølge hvis Google Cloud er nytt for deg. Erfarne skyarkitekter kan starte med valg av runtime og bruke NAIS-broen i hver modul."
layers: ["ORGANISASJON · MAPPER · PROSJEKTER", "IAM · SERVICE ACCOUNTS · POLICY", "VPC · REGIONER · SONER", "RUN · GKE · COMPUTE ENGINE", "DATA · HENDELSER · DRIFT"]
bridge:
  label: "Plattformlaget"
  title: "Fortsett fra Google Cloud til NAIS"
  text: "NAIS kjører applikasjons-workloads på GKE og gjør utvalgte Google Cloud-tjenester tilgjengelige gjennom tryggere selvbetjeningskontrakter. NAIS-løpet viser hvilke detaljer teamet fortsatt ser, og hva plattformteamet eier."
  url: "/cloud-platforms/nais/"
  cta: "Start NAIS-løpet"
cascade:
  type: cloud-learning
  platform: "Google Cloud"
  platform_key: gcp
---

Google Cloud er enklere å lære når plattformen behandles som et system av **ressurser, identiteter, nettverk, lokasjoner og administrerte kapabiliteter**, ikke som en katalog med hundrevis av produktnavn. Løpet starter med dette systemet og beveger seg mot valgene en applikasjonsarkitekt eller plattformbruker faktisk må ta.

Læringsløpet er bevisst koblet til [NAIS]({{< relref "/cloud-platforms/nais/_index.no.md" >}}). NAIS fjerner mye av den daglige Kubernetes- og skykonfigurasjonen fra produktteamene, men begreper som prosjekter, IAM, service accounts, regioner, GKE, Cloud SQL, Cloud Storage og BigQuery forklarer fortsatt hva som skjer under abstraksjonen.

Bruk [Google Cloud direkte eller gjennom NAIS?]({{< relref "/cloud-platforms/nais/00-google-cloud-direct-or-nais.no.md" >}}) når du trenger den operative sammenligningen: hva NAIS gir deg, hvordan fleksibiliteten endres, hvem som gir support, og hva som skjer når PostgreSQL blir utilgjengelig.

Eksemplene er konseptuelle og kan studeres uten en skykonto. Når du øver i et virkelig prosjekt, bør du først opprette et budsjett, bruke et sandbox-prosjekt, foretrekke kortlivede credentials og fjerne fakturerbare ressurser når øvelsen er ferdig.

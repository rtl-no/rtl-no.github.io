---
title: "NAIS-plattformen"
headline: "Lær plattformkontrakten – og skyen under."
description: "Et praktisk løp fra valget mellom Google Cloud og NAIS til team, workloads, identitet, data, observability og produksjonsansvar."
translationKey: nais-platform
type: cloud-learning
platform: "NAIS"
platform_key: nais
level: "Grunnlag → produksjon"
last_reviewed: "22. august 2026"
path_note: "Start med den direkte sammenligningen, og følg deretter livssyklusen til en tjeneste: forstå plattformen, deploy en workload, koble den trygt, legg til data og telemetri, og gjør den klar for produksjon."
layers: ["PRODUKTTEAM · REPOSITORY", "NAIS-MANIFEST · CONSOLE · API", "NAISERATORER · PLATTFORMTJENESTER", "KUBERNETES · GKE", "GOOGLE CLOUD · AIVEN"]
bridge:
  label: "Se under abstraksjonen"
  title: "Besøk Google Cloud-grunnlaget igjen"
  text: "NAIS skjuler bevisst mye av Google Cloud og Kubernetes, men prosjekter, IAM, workload identity, VPC, GKE og administrerte datatjenester former fortsatt sikkerhet, lokasjon, robusthet og kostnad."
  url: "/cloud-platforms/google-cloud/"
  cta: "Åpne Google Cloud"
cascade:
  type: cloud-learning
  platform: "NAIS"
  platform_key: nais
---

[NAIS](https://docs.nais.io/explanations/nais/) er en applikasjonsplattform bygget rundt autonome team som utvikler, deployer og drifter egne produkter. Den leverer en sikker runtime og selvbetjente byggeklosser, slik at hvert team ikke må sette sammen sin egen Kubernetes- og skyplattform. Navnet betydde opprinnelig *NAVs Application Infrastructure Services*; NAIS-miljøet arbeider mot at N-en skal bety *Norwegian*.

NAIS er ikke en egen skyleverandør. Hvert skymiljø er en Kubernetes-cluster på Google Kubernetes Engine, mens utvalgte kapabiliteter kommer fra Google Cloud, Aiven og plattformdriftede komponenter. Den utviklerrettede kontrakten ligger bevisst høyere: Team bruker primært NAIS-manifester, NAIS Console, GitHub Actions og plattform-API-er.

Abstraksjonen endrer **hvem som håndterer kompleksiteten**, ikke om produksjonsansvaret finnes. Dette læringsløpet fokuserer på begge sider av kontrakten: hva plattformen automatiserer, og hva produktteamet fortsatt må forstå, velge og drifte.

Skal du velge driftsmodell, kan du begynne med [Google Cloud direkte eller gjennom NAIS?]({{< relref "/cloud-platforms/nais/00-google-cloud-direct-or-nais.no.md" >}}). Guiden sammenligner gevinster, begrensninger, supportansvar og PostgreSQL-hendelser før de tekniske modulene.

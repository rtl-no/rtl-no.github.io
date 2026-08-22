---
title: "Kunnskapstest for NAIS i produksjon"
translationKey: nais-knowledge-check
module: "06"
weight: 60
track: "Kunnskapstest"
duration: "20 min"
level: "Grunnleggende → viderekommen"
summary: "Femten scenarier om NAIS-modellen, workloads, levering, identitet, tilgang, data, observability og produksjonseierskap."
topics: ["15 scenarier", "Forklaringer", "Offisielle NAIS-kilder"]
questions_label: "oppgaver"
answered_label: "besvart"
submit_label: "Sjekk svarene"
reset_label: "Prøv igjen"
result_label: "Resultat"
correct_label: "Riktig"
wrong_label: "Se nærmere på denne"
unanswered_label: "Ikke besvart"
pass_percent: 73
pass_message: "God plattformforståelse. Les begrunnelsene før resultatet brukes som støtte i produksjonsarbeid."
review_message: "Bruk områdeoversikten til å velge en modul du bør lese på nytt, og prøv igjen."
result_note: "Denne uavhengige kunnskapstesten er ikke offisiell NAIS-opplæring, sertifisering eller produksjonsgodkjenning. Oppdatert tenant- og miljødokumentasjon er fortsatt autoritativ."
questions:
  - domain: "Plattformmodell"
    question: "Hvilket utsagn beskriver NAIS best?"
    options: ["En separat offentlig skyleverandør", "En applikasjonsplattform over Kubernetes og administrerte tjenester med selvbetjente utviklerkontrakter", "En erstatning for produktteamets eierskap", "Bare et webgrensesnitt for rå virtuelle maskiner"]
    correct: 1
    explanation: "NAIS leverer runtime og integrerte byggeklosser gjennom kontrakter på høyere nivå. Skymiljøer bruker Kubernetes på GKE og administrerte tjenester under."
    reference: "https://docs.nais.io/explanations/nais/"
    reference_label: "Hva er NAIS?"
  - domain: "Plattformmodell"
    question: "Et produktteam antar at NAIS eier om saksbehandlingslogikken er riktig i produksjon. Hva er galt?"
    options: ["Ingenting; plattformeierskap inkluderer all forretningslogikk", "Plattformen eier delte kapabiliteter, mens produktteamet eier kode, domeneoppførsel og brukerutfall", "Bare Google eier korrekthet", "GitHub eier produksjon etter deployment"]
    correct: 1
    explanation: "Plattformbygging sentraliserer felles kompleksitet uten å flytte produkt- og domeneansvaret fra teamet."
    reference: "https://docs.nais.io/explanations/nais/"
    reference_label: "NAIS' plattformidé"
  - domain: "Workloads"
    question: "En endelig rapportoppgave skal kjøre hver natt og avslutte. Hvilken NAIS-workload er naturlig?"
    options: ["En Naisjob med tidsplan", "En permanent offentlig ingress", "Et ekstra team-namespace", "En liveness-probe"]
    correct: 0
    explanation: "Naisjob representerer endelig arbeid og støtter planlagt kjøring; Application representerer en langlivet workload."
    reference: "https://docs.nais.io/workloads/job/"
    reference_label: "Naisjob"
  - domain: "Workloads"
    question: "Hvilken probe skal svare på om en instans bør motta trafikk akkurat nå?"
    options: ["Readiness", "Liveness", "Image-signatur", "Budsjettvarsel"]
    correct: 0
    explanation: "Readiness styrer om instansen er et tilgjengelig trafikkendepunkt. Liveness spør om den bør restartes."
    reference: "https://docs.nais.io/workloads/explanations/good-practices/"
    reference_label: "God workload-praksis"
  - domain: "Workloads"
    question: "Seks replikaer kan åpne 30 database connections hver. Hva må vurderes før max replicas settes til 20?"
    options: ["Bare fargen på dashboardet", "Samlet behov for connection pools og nedstrøms kapasitet", "Om repository er offentlig", "Antall teammedlemmer"]
    correct: 1
    explanation: "Autoskalering multipliserer nedstrøms bruk. Connection pools, overlapp ved rolling deployment og databasekapasitet må planlegges sammen."
    reference: "https://docs.nais.io/workloads/application/reference/automatic-scaling"
    reference_label: "Automatisk skalering"
  - domain: "Levering"
    question: "Hvorfor må et GitHub-repository autoriseres for et NAIS-team?"
    options: ["For å la enhver fork deploye", "For å begrense hvilket kilde-repository som kan deploye på vegne av teamet", "For å gjøre alle images offentlige", "For å erstatte code review"]
    correct: 1
    explanation: "Repository-autorisasjon inngår i den betrodde deployment-veien og begrenser hvilken GitHub-kilde som kan deploye for teamet."
    reference: "https://docs.nais.io/build/how-to/build-and-deploy/"
    reference_label: "Build og deploy"
  - domain: "Identitet"
    question: "Et internt API må handle på vegne av en innbygger som allerede er autentisert med ID-porten. Hvilken mekanisme er laget for den delegerte interne kjeden?"
    options: ["TokenX", "Cloud NAT", "Prometheus", "En offentlig bucket"]
    correct: 0
    explanation: "TokenX støtter interne applikasjoner som handler på vegne av innbyggere autentisert gjennom ID-porten."
    reference: "https://docs.nais.io/auth/"
    reference_label: "NAIS-oversikt for autentisering"
  - domain: "Identitet"
    question: "En NAIS-workload aksesserer en skyressurs med workload identity. Hva beviser det om sluttbrukeren?"
    options: ["Sluttbrukeren er automatisk autorisert for alle objekter", "Ingenting alene; workload- og sluttbrukeridentitet er forskjellige", "Brukeren er clusteradministrator", "Kallet kom gjennom Maskinporten"]
    correct: 1
    explanation: "Workload identity representerer den kjørende applikasjonen. Bruker-/delegert kontekst og faglig autorisasjon må håndteres separat."
    reference: "https://docs.nais.io/auth/workload-identity/"
    reference_label: "Workload Identity"
  - domain: "Nettverk"
    question: "To applikasjoner i samme NAIS-miljø må kommunisere privat. Hva er foretrukket utgangspunkt?"
    options: ["Service discovery og eksplisitte access policies", "En offentlig ingress for begge", "Delte administratorcredentials", "Skrive requests til lokal disk"]
    correct: 0
    explanation: "Service discovery unngår ekstern eksponering og unødvendige hopp; access policies deklarerer den tillatte tjenestekanten."
    reference: "https://docs.nais.io/workloads/application/explanations/expose/"
    reference_label: "Eksponering av applikasjon"
  - domain: "Nettverk"
    question: "En accessPolicy lar frontend A nå API B. Hva kreves fortsatt?"
    options: ["Ingenting; nettverkstilgang autoriserer alle faglige handlinger", "Tokenvalidering der det gjelder og faglig autorisasjon i API B", "Gjør API B offentlig", "Deaktiver audit logging"]
    correct: 1
    explanation: "Tilkobling, tokenautorisasjon og faglig autorisasjon er separate kontroller. En tillatt nettverkskant er ikke generell forretningsrettighet."
    reference: "https://docs.nais.io/workloads/reference/access-policies/"
    reference_label: "Access policy"
  - domain: "Data"
    question: "En Cloud Storage-kapabilitet er highly available. Hva bør teamet konkludere om utilsiktet sletting?"
    options: ["Sletting kan alltid gjenopprettes automatisk", "Tilgjengelighet er ikke det samme som separat backup; livssyklus og recovery må verifiseres", "Plattformen eier alle datavalg", "Retention er unødvendig"]
    correct: 1
    explanation: "NAIS skiller durability/availability fra backupbeskyttelse mot feilaktig sletting. Teamet eier recovery-krav og konfigurasjon."
    reference: "https://docs.nais.io/persistence/"
    reference_label: "Oversikt over persistent data"
  - domain: "Data"
    question: "Hva er den tryggeste generelle antakelsen om Kafka i en produktarkitektur?"
    options: ["Den bør ved et uhell bli eneste master for alle data", "Teamet bør forstå replay og beholde en gjenopprettbar autoritativ kilde med mindre event sourcing er bevisst", "Consumers ser aldri duplikater", "Skjemaer endres aldri"]
    correct: 1
    explanation: "Kafka er robust, men NAIS anbefaler at data kan gjenopprettes fra et annet system. Replay, skjemaer og duplikathåndtering trenger design."
    reference: "https://docs.nais.io/persistence/kafka/"
    reference_label: "NAIS Kafka"
  - domain: "Observability"
    question: "Hvor bør et unikt saksnummer normalt plasseres for undersøkelse av ett request?"
    options: ["Som ubegrenset Prometheus-label på hver metric", "Som trygg korrelasjonskontekst i strukturerte logger og traces", "I en container image tag", "I stien til liveness-endepunktet"]
    correct: 1
    explanation: "Identifikatorer med høy cardinality skader metricsystemer. Bruk avgrensede labels for aggregering og trygg request-spesifikk kontekst i logger eller traces."
    reference: "https://docs.nais.io/observability/"
    reference_label: "NAIS observability"
  - domain: "Drift"
    question: "En pod er frisk, men ingen saker fullføres fordi en nedstrøms kø har stoppet. Hvilken læring er viktigst?"
    options: ["Pod-health er tilstrekkelig", "Produksjonssignaler må inkludere bruker- eller forretningsutfall og avhengigheter", "Fjern alle varsler", "Kjør bare én replika"]
    correct: 1
    explanation: "Infrastruktur-health beviser ikke produktkorrekthet. SLO-er og faglige signaler må representere tjenesteutfallet."
    reference: "https://docs.nais.io/observability/"
    reference_label: "Observability"
  - domain: "Drift"
    question: "Hvilket utsagn er evidens for produksjonsberedskap?"
    options: ["Manifestet besto validering én gang", "Teamet har målte grenser, SLO-er, eide varsler/runbooks, kompatibel rollout og testet recovery", "NAIS har en Console", "Applikasjonen skriver noen logger"]
    correct: 1
    explanation: "Produksjonsberedskap kombinerer workload-design, sikkerhet, data, observability, endring, recovery og eksplisitt eierskap. Funksjoner alene er ikke evidens."
    reference: "https://docs.nais.io/workloads/explanations/good-practices/"
    reference_label: "God workload-praksis"
---

Svar ut fra plattform- og ansvarsmodellen, ikke memorert YAML. Hvert innsendte svar gir en kort begrunnelse og en offisiell NAIS-kilde.

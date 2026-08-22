---
title: "Arkitekturtest for Google Cloud"
translationKey: gcp-knowledge-check
module: "06"
weight: 60
track: "Kunnskapstest"
duration: "20 min"
level: "Grunnleggende → viderekommen"
summary: "Femten scenario-baserte spørsmål om ressursdesign, IAM, nettverk, valg av runtime, data og drift."
topics: ["15 scenarier", "Forklaringer", "Offisielle kilder"]
questions_label: "oppgaver"
answered_label: "besvart"
submit_label: "Sjekk svarene"
reset_label: "Prøv igjen"
result_label: "Resultat"
correct_label: "Riktig"
wrong_label: "Se nærmere på denne"
unanswered_label: "Ikke besvart"
pass_percent: 73
pass_message: "Godt grunnlag. Les alle forklaringene, særlig der det riktige svaret var usikkert."
review_message: "Bruk områdeoversikten til å velge hvilken modul du bør lese på nytt, og prøv igjen."
result_note: "Dette er en uavhengig kunnskapstest, ikke en offisiell Google Cloud-sertifiseringseksamen eller garanti for eksamensberedskap."
questions:
  - domain: "Ressursmodell"
    question: "Produksjon og utvikling skal ha separate tilganger, kvoter og livssykluser, mens basispolicy arves av begge. Hva er det beste utgangspunktet?"
    options: ["Ett prosjekt med labels for prod og dev", "Separate prod- og dev-prosjekter under en felles mappe", "En mappe for hver enkelt ressurs", "Separate brukerkontoer uten organisasjon"]
    correct: 1
    explanation: "Prosjekter gir nyttige grenser for tillit, kvoter og livssyklus. En felles overordnet mappe kan bære felles IAM- eller organization policies."
    reference: "https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy"
    reference_label: "Google Cloud-ressurshierarki"
  - domain: "Ressursmodell"
    question: "Et budsjett når 100 prosent. Hva skal du anta skjer som standard?"
    options: ["Alle prosjektressurser stopper umiddelbart", "Fakturering deaktiveres permanent", "Konfigurerte varsler eller automasjon kan kjøre, men budsjettet er ikke en hard forbruksgrense", "Prosjektkvotene dobles"]
    correct: 2
    explanation: "Budsjetter gir primært overvåking og varsler. De stanser ikke automatisk all kostnad med mindre du bygger bevisst automasjon, som har egne risikoer."
    reference: "https://docs.cloud.google.com/billing/docs/how-to/budgets"
    reference_label: "Cloud Billing-budsjetter"
  - domain: "Identitet"
    question: "En GitHub Actions-workflow må deploye uten å lagre en privat Google-nøkkel. Hvilken mekanisme er laget for dette?"
    options: ["Et offentlig Cloud Storage-objekt", "Workload Identity Federation med GitHub OIDC", "En delt menneskelig Owner-konto", "En API-nøkkel committet som secret"]
    correct: 1
    explanation: "Workload Identity Federation veksler en betrodd ekstern identitet til kortlivede Google-credentials og unngår en nedlastet service account-nøkkel."
    reference: "https://docs.cloud.google.com/iam/docs/workload-identity-federation"
    reference_label: "Workload Identity Federation"
  - domain: "Identitet"
    question: "En utvikler kan ikke lese en bucket direkte, men kan impersonate en service account med Storage Object Viewer. Hva er den effektive risikoen?"
    options: ["Ingen, fordi direkte bucket-IAM vinner", "Utvikleren kan oppnå service accountens effektive tilgang", "Impersonering virker bare for fakturering", "Bucketen blir offentlig"]
    correct: 1
    explanation: "En service account er både principal og ressurs. Rett til å impersonate den kan gi en indirekte tilgangsvei til alt kontoen kan nå."
    reference: "https://docs.cloud.google.com/iam/docs/best-practices-service-accounts"
    reference_label: "Beste praksis for service accounts"
  - domain: "Nettverk"
    question: "Hvilken påstand beskriver et Google Cloud VPC-nettverk riktig?"
    options: ["VPC-en er regional og hvert subnett er globalt", "Både VPC og subnett er sonale", "VPC-en er global og subnettene er regionale", "Hver VM krever en egen VPC"]
    correct: 2
    explanation: "VPC-nettverk er globale ressurser; subnettene er regionale ressurser."
    reference: "https://docs.cloud.google.com/vpc/docs/vpc"
    reference_label: "VPC-nettverk"
  - domain: "Nettverk"
    question: "Et plattformteam skal eie ett nettverk sentralt, mens produktteam deployer ressurser i egne prosjekter. Hva passer best?"
    options: ["Shared VPC med host project og service projects", "Transitiv VPC-peering", "Offentlig IP på alle workloads", "En Cloud NAT per bruker"]
    correct: 0
    explanation: "Shared VPC skiller nettverksadministrasjon i et host project fra workload-eierskap i tilknyttede service projects."
    reference: "https://docs.cloud.google.com/vpc/docs/shared-vpc"
    reference_label: "Shared VPC"
  - domain: "Compute"
    question: "Et stateless HTTP-API i en container trenger request-basert autoskalering og ikke Kubernetes-API-et. Hva er det enkleste sterke utgangspunktet?"
    options: ["En manuelt patchet Compute Engine-VM", "Cloud Run service", "GKE Standard med custom node pools", "Bare Cloud Storage"]
    correct: 1
    explanation: "Cloud Run er en fullt administrert containerplattform som passer stateless request-drevne tjenester uten clusteradministrasjon."
    reference: "https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run"
    reference_label: "Cloud Run-oversikt"
  - domain: "Compute"
    question: "Et script genererer fakturaer én gang hver natt og avslutter. Hvilken kjøringsmodell beskriver dette best?"
    options: ["Cloud Run job trigget etter tidsplan", "En alltid aktiv webtjeneste med minimum 20 instanser", "En offentlig DNS-sone", "En permanent administrator-VM"]
    correct: 0
    explanation: "En job representerer endelig arbeid som kjører til det er ferdig og kan startes etter tidsplan."
    reference: "https://docs.cloud.google.com/run/docs/create-jobs"
    reference_label: "Cloud Run jobs"
  - domain: "Compute"
    question: "Hva garanterer ikke en Kubernetes Deployment i seg selv?"
    options: ["Et ønsket antall replikaer", "Avstemming av pods", "At applikasjonens state og shutdown-oppførsel er riktig utformet", "En pod template"]
    correct: 2
    explanation: "Kubernetes kan avstemme workload-ressurser, men applikasjonen må fortsatt eksternalisere varig state, håndtere terminering og eksponere meningsfull health."
    reference: "https://docs.cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview"
    reference_label: "GKE-oversikt"
  - domain: "Data"
    question: "En tjeneste trenger ACID-transaksjoner for ordre i PostgreSQL. Hva er det mest direkte administrerte utgangspunktet?"
    options: ["Cloud SQL for PostgreSQL", "Cloud Storage", "Cloud CDN", "Cloud DNS"]
    correct: 0
    explanation: "Cloud SQL er den administrerte relasjonelle tjenesten for PostgreSQL, MySQL og SQL Server. Teamet eier fortsatt skjema, connections og recovery-design."
    reference: "https://docs.cloud.google.com/sql/docs/postgres/introduction"
    reference_label: "Cloud SQL for PostgreSQL"
  - domain: "Data"
    question: "En spørring skanner en stor BigQuery-tabell daglig, men trenger bare én måned og seks kolonner. Hvilket design kontrollerer skannet datamengde mest direkte?"
    options: ["Legg til flere Project Owners", "Partisjoner hensiktsmessig og velg bare nødvendige kolonner", "Flytt tabellen til filsystemet på en VM", "Deaktiver audit logs"]
    correct: 1
    explanation: "Partition pruning og å unngå SELECT * reduserer unødvendig skannet data og forbedrer ytelse og kostnad."
    reference: "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute"
    reference_label: "Beste praksis for BigQuery-spørringer"
  - domain: "Integrasjon"
    question: "En Pub/Sub-subscriber mottar av og til samme forretningshendelse på nytt. Hva er den tryggeste applikasjonsantakelsen?"
    options: ["Duplikater er umulige", "Consumeren bør være idempotent eller deduplisere ved den faglige grensen", "Slett subscription etter hver melding", "Slå av databasen under retries"]
    correct: 1
    explanation: "Asynkron levering og retries gjør at consumers må håndtere duplikatprosessering og sikre side effects."
    reference: "https://docs.cloud.google.com/pubsub/docs/subscriber"
    reference_label: "Pub/Sub subscribers"
  - domain: "Drift"
    question: "Hvilket varsel ligger nærmest brukersentrert SRE-praksis?"
    options: ["Varsle når CPU overstiger 50 prosent i ett minutt", "Varsle ved meningsfull burn av API-ets error budget for tilgjengelighet eller latency", "Varsle for hver logglinje", "Send alle varsler til en postkasse uten eier"]
    correct: 1
    explanation: "SLO- og error-budget burn kobler varsler til brukersynlig pålitelighet og reduserer støy fra rene ressursvarsler."
    reference: "https://docs.cloud.google.com/stackdriver/docs/solutions/slo-monitoring"
    reference_label: "SLO-overvåking"
  - domain: "Pålitelighet"
    question: "Applikasjonsreplikaer kjører i to soner, men avhenger av én sonal database. Hva er hovedproblemet i arkitekturen?"
    options: ["Applikasjonen er automatisk multi-region", "Databasen er fortsatt én sonal feilavhengighet", "To soner fjerner behovet for backup", "DNS kan ikke lenger slå opp navn"]
    correct: 1
    explanation: "Tilgjengelighet gjelder ende til ende. En sonal avhengighet kan dominere feilmodellen selv om compute-laget dekker flere soner."
    reference: "https://docs.cloud.google.com/architecture/framework/reliability"
    reference_label: "Well-Architected-pilaren for pålitelighet"
  - domain: "Arkitektur"
    question: "Hvilken gjennomgang er mest komplett før produksjon?"
    options: ["Bekreft bare at deployment lyktes", "Gjennomgå drift, sikkerhet, pålitelighet, kostnad, ytelse og bærekraft, inkludert eierskap og tester", "Velg den nyeste tjenesten i hver kategori", "Bruk én administratorkonto for enkelhet"]
    correct: 1
    explanation: "Googles Well-Architected Framework bruker seks pilarer og fremmer eksplisitte avveininger og operasjonell beredskap fremfor kun deployment."
    reference: "https://docs.cloud.google.com/architecture/framework"
    reference_label: "Well-Architected Framework"
---

Svar ut fra arkitekturen som beskrives, ikke gjenkjenning av produktnavn. Etter innsending viser hver oppgave en begrunnelse og en offisiell kilde. Et feil svar peker til modulen du bør besøke på nytt.

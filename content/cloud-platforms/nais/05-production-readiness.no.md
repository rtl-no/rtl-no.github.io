---
title: "Produksjonsberedskap og driftsansvar"
translationKey: nais-production-readiness
module: "05"
weight: 50
track: "Drift"
duration: "30 min"
level: "Viderekommen"
summary: "Gjør en deployet workload til et driftet produkt gjennom SLO-er, avhengighets- og recovery-design, sikker verdikjede, kostnadseierskap og hendelsesøvelser."
topics: ["Produksjonssjekkliste", "Sikker verdikjede", "Hendelser og recovery"]
last_reviewed: "22. august 2026"
outcomes:
  - "Gjennomføre produksjonsberedskapsgjennomgang av hele tjenesten"
  - "Definere SLO, varsel, runbook og eierskap sammen"
  - "Forklare sikkerhetskontrollene fra repository til workload"
  - "Forberede recovery for deployment, avhengigheter og data"
next: { url: "/cloud-platforms/nais/06-knowledge-check/", label: "Neste: kunnskapstest" }
---

## Deployment er starten på drift

En vellykket NAIS-deployment beviser at plattformen aksepterte deklarasjonen og startet workloaden. Produksjonsberedskap stiller et større spørsmål: Kan teamet levere tiltenkt brukerutfall trygt, observere det, svare på feil og gjenopprette data og avhengigheter?

Gjennomgå tjenesten som ett system:

```text
bruker → ingress → applikasjon → identitet → avhengigheter → data
                 ↘ logger · metrics · traces · varsler
repository → build → image → deploy → runtime
```

En frisk pod er bare én node i grafen.

## Tjenestedefinisjon og eierskap

Før produksjon skriver dere ned:

- tjenestens formål og kritiske brukerreiser;
- eierteam og kontakt-/eskaleringsveier;
- brukere, dataklassifisering og nødvendige identitetsflyter;
- oppstrøms og nedstrøms avhengigheter med eiere;
- forventet last, vekst og kostnadseier;
- endringsvinduer eller kompatibilitetsbegrensninger;
- mål for tilgjengelighet, latency, korrekthet og recovery;
- supporttid og forventninger til hendelseshåndtering.

Hvis eieren er «plattformen», besøk modul 1 igjen. NAIS eier delte kapabiliteter; plattformen eier ikke domeneutfallet til hver applikasjon.

## SLO, varsel og runbook er én enhet

En SLO uten telemetri kan ikke måles. Et varsel uten eier er støy. En vaktansvarlig uten runbook må gjenoppdage systemet under press.

En praktisk kjede er:

1. **SLI:** prosentandel gyldige API-requests fullført med suksess innen 800 ms.
2. **SLO:** 99,9 prosent over et rullerende 28-dagersvindu.
3. **Varsel:** signaler for rask og langsom error-budget burn.
4. **Runbook:** dashboards, avhengighetssjekker, nylige deployments, trygge tiltak, rollback og eskalering.
5. **Gjennomgang:** bekreft etter hendelser om signal og respons beskyttet brukerne.

Definer også signaler for faglig korrekthet. En queue consumer kan være teknisk tilgjengelig uten at noen saker beveger seg videre.

## Avhengighets- og feildesign

For hver avhengighet angir du:

- timeout- og cancellation-oppførsel;
- retryable feil, eksponentiell backoff og jitter;
- idempotens for side effects;
- concurrency- og connection-grenser;
- circuit-breaking eller load shedding der det er nyttig;
- fallback eller degradert modus;
- datakonsistens etter delvis fullføring;
- observerbare signaler og kontakt til eier.

Retries multipliserer last. En kallkjede med tre lag og tre retries i hvert lag kan forsterke ett brukerkall dramatisk. Retry i et lag som forstår operasjonen, begrens antall forsøk og la deadlines forplante seg.

## Trygg endring og rollback

En rolling deployment kjører midlertidig gammel og ny versjon samtidig. API-er, hendelser og databaseskjema må tåle overlappen. Bruk expand/migrate/contract for skjemaendringer; gjør event consumers tolerante for kompatibel utvikling; og gjenbruk ikke en image tag for ulikt innhold.

Avgjør om feil håndteres best med rollback eller roll-forward. Rollback kan ikke angre en irreversibel datamigrering eller en hendelse sendt til eksterne systemer. Feature flags kan skille deployment fra eksponering, men flags trenger eiere, defaults og slettedatoer.

Test driftsveien: deploy, observer, stans trafikk gjennom readiness, terminer kontrollert, rull tilbake, restore og reprocess. En plan som aldri er øvd, er en hypotese.

## Programvarens verdikjede

NAIS kan etablere en sporbar kjede fra et autorisert GitHub-repository gjennom støttede build actions til et signert container-image og deployment. Bygget kan produsere en software bill of materials, og plattformen gir sårbarhetsinnsikt for images.

Produktteamets ansvar består:

- beskytt branches og gjennomgå kode/workflows;
- minimer GitHub Actions-permissions og lås betrodde actions hensiktsmessig;
- vedlikehold base images og avhengigheter;
- unngå secrets i repository og byggeoutput;
- triager sårbarheter etter utnyttbarhet og eksponering;
- bygg og deploy på nytt når avhengigheter eller base images endres;
- behold evidens organisasjonens risikoprosess krever.

Se [innsikt og håndtering av sårbarheter](https://docs.nais.io/services/vulnerabilities/).

## Kapasitet og kostnad

Resource requests påvirker delt clusterkapasitet og kostnad. Maksgrenser for autoskalering påvirker nedstrøms connections og kostnad. Logger, traces, Kafka-retention, databasetiers og analytiske scans kan dominere applikasjonens CPU-kostnad.

Plasser kostnad hos produktet, følg trender og knytt forbruk til nyttige enheter som requests eller behandlede saker. Kostnadsavvik kan indikere loop, trafikkangrep, løpsk query, retention-feil eller loggeksplosjon. Kostnad hører hjemme i driftsdashboards, ikke bare kvartalsrapportering.

## Recovery og kontinuitet

For hver stateful kapabilitet dokumenterer dere:

- autoritativ datakilde;
- funksjoner for infrastruktur-durability og backup;
- beskyttelse mot utilsiktet sletting;
- RPO og RTO;
- restore-steg, tilgang og beslutningsmyndighet;
- validering etter restore;
- replay eller avstemming av hendelser etter recovery point;
- kommunikasjon og juridiske forpliktelser.

Test recovery i et representativt miljø og registrer faktisk tidsbruk. Recovery-eierskap kan ikke utledes under en hendelse.

## Sjekkliste for produksjonsberedskap

### Workload

- immutable vedlikeholdt image, non-root-prosess og ingen varig lokal state;
- målte requests, trygge limits og avgrenset skalering;
- minst to replikaer der tilgjengelighetsbehovet krever det;
- distinkte probes og kontrollert terminering;
- kompatibel rollout og plan for rollback/roll-forward.

### Sikkerhet og data

- minimale access policies og riktige token audiences/scopes;
- faglig autorisasjon og audit-kontekst;
- kortlivede identiteter og administrerte secrets;
- dataformål, lokasjon, tilgang, retention og sletting dokumentert;
- backup/restore og hendelsesforpliktelser testet.

### Drift

- SLO-er og faglige signaler;
- håndterbare varsler med eiere og runbooks;
- avhengighetsdashboards og deployment-markører;
- vakt-/eskaleringsavtale;
- overvåking av kapasitet, kvoter og kostnad;
- nylig game day eller recovery-øvelse.

## Arkitekturkontroll

Teamet sier: «NAIS har autoskalering, logger og backups, så vi er produksjonsklare.» Identifiser beviset som mangler.

Utsagnet mangler målte ressurs- og nedstrømsgrenser, SLO-er, håndterbare varsler, faglige signaler, eiere, identitets-/autorisasjonsgjennomgang, dataansvar, restore-testing, deployment-kompatibilitet, feiloppførsel for avhengigheter, hendelsesøvelse og kostnadseierskap. Plattformfunksjoner er input til beredskap, ikke evidens for beredskap.

## Offisielle studielenker

- [God workload-praksis](https://docs.nais.io/workloads/explanations/good-practices/)
- [Observability](https://docs.nais.io/observability/)
- [Sårbarhetshåndtering](https://docs.nais.io/services/vulnerabilities/)
- [Dataansvar](https://docs.nais.io/persistence/explanations/responsibilities/)
- [Drift av workloads og tjenester](https://docs.nais.io/operate/)

### Google Cloud-bro

Bruk [data- og driftsmodulen for Google Cloud]({{< relref "/cloud-platforms/google-cloud/05-data-integration-and-operations.no.md" >}}) for å gjennomgå managed-service-feil, SLO, kostnad og Well-Architected-begreper under sjekklisten.

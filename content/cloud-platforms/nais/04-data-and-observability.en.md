---
title: "Data services and observability"
translationKey: nais-data-observability
module: "04"
weight: 40
track: "Platform capabilities"
duration: "35 min"
level: "Intermediate"
summary: "Choose Nais data capabilities by behavior and ownership, then combine logs, metrics and traces into useful service-level operations."
topics: ["Cloud SQL and buckets", "Kafka and BigQuery", "OpenTelemetry and Grafana"]
last_reviewed: "22 August 2026"
outcomes:
  - "Choose a storage capability from the data problem"
  - "Explain team responsibility for provisioned data resources"
  - "Use logs, metrics and traces for different questions"
  - "Define alerts from SLOs and actionable failure conditions"
next: { url: "/cloud-platforms/nais/05-production-readiness/", label: "Next: production readiness" }
---

## Self-service does not choose for you

Nais exposes multiple persistence capabilities because data problems differ. A declaration or Console action can provision infrastructure and credentials; it cannot decide the correct consistency model, privacy basis, retention, schema or recovery strategy.

| Need | Nais capability | Important design questions |
| --- | --- | --- |
| Relational transactions | Cloud SQL / PostgreSQL | Schema, connections, migrations, HA, RPO/RTO and restore |
| Objects and files | Cloud Storage bucket | Object naming, lifecycle, versioning/soft delete, retention and access |
| Analytical workloads | BigQuery | Dataset ownership, partitioning, scan cost, PII and deletion |
| Event streams | Kafka through Aiven | Partitions, keys, ordering, schemas, offsets, replay and source of truth |
| Search and documents | OpenSearch | Index design, reindexing, access and authoritative source |
| Fast key/value and cache | Valkey | Eviction, loss behavior, TTL, consistency and whether it is only a cache |

Availability varies between environments. The current [persistence overview](https://docs.nais.io/persistence/) is the authoritative comparison.

## Data responsibility remains with the team

Nais provisions and maintains infrastructure and integrations according to the team's specification. The underlying storage may be operated by Google, Aiven or another infrastructure provider. The product team remains responsible for the data and its lawful, secure use.

Before provisioning, answer:

1. What is the data's purpose and classification?
2. Where may it be processed and stored?
3. Who may access it, and how is that reviewed?
4. How long is it retained, and how is deletion verified?
5. What are RPO and RTO?
6. Which backup or durability feature exists, and does it protect against accidental deletion?
7. Has restore been tested at the application level?
8. Who owns schema, migration, cost and incidents?

“Highly available” and “backed up” are not synonyms. The Nais storage comparison explicitly notes that some durable services do not provide a separate backup against mistaken deletion. Read [data responsibilities](https://docs.nais.io/persistence/explanations/responsibilities/).

## Relational data

For Cloud SQL, plan connection pooling and maximum application scale together. Rolling deployments temporarily add replicas, and each may open a pool. Database saturation can occur while CPU looks healthy.

Use backward-compatible schema changes across rolling versions: expand first, migrate, then contract later. Treat major-version upgrades and instance changes as product changes with testing, observability and rollback/recovery plans. Platform automation does not know whether a migration preserves domain meaning.

## Kafka and event ownership

Nais offers Kafka as a managed service through Aiven. Topics have partitioning and access controls; clients still determine keys, producer acknowledgement, consumer groups, offset commits and error behavior.

Consumers should handle redelivery and be idempotent at the business boundary. Define schema compatibility, ownership and replay before production. Kafka's durability is not a reason to make it the only master of business data accidentally; the Nais documentation recommends being able to restore the data from another system.

## Observability: ask questions with signals

Nais standardizes the three main signal types:

- logs written to `stdout`/`stderr` are collected; structured logs are easier to search and aggregate;
- metrics follow OpenMetrics/Prometheus conventions and are queried/visualized in Grafana;
- traces use OpenTelemetry and are stored in Tempo, with Nais APM providing service and RED views;
- alerts can be evaluated from metrics or logs and routed through supported channels.

Automatic OpenTelemetry instrumentation can create useful baseline telemetry without code changes. It does not know the important business events, correct correlation identifiers or what “good service” means to users.

Use each signal deliberately:

| Question | Best starting signal |
| --- | --- |
| Is error rate rising across all instances? | Metric |
| What happened to order `abc-123`? | Structured log with safe correlation ID |
| Which downstream call dominates latency? | Distributed trace |
| Are users receiving successful responses within target time? | SLI metric and SLO |

Never place tokens, secrets or unnecessary personal data in logs, span attributes or metric labels. High-cardinality identifiers can make metrics expensive and ineffective; put request-specific identifiers in logs/traces.

## Alert on conditions people can act on

An alert needs:

- a user or system impact worth interrupting someone for;
- a threshold and duration that avoid transient noise;
- an owner and delivery route;
- context, dashboard and runbook;
- a safe first action and escalation path;
- periodic review of whether it was useful.

Start with availability, latency and correctness SLOs. Resource alerts such as memory pressure are useful when they predict user impact or imminent failure. Avoid paging on every pod restart; Kubernetes restarts are normal, while a restart loop and loss of healthy capacity are not.

Study the current [Nais observability overview](https://docs.nais.io/observability/) and [observability tutorial](https://docs.nais.io/observability/tutorials/getting-started/).

## Architecture checkpoint

An application stores case state in Cloud SQL, publishes case events to Kafka, indexes searchable text in OpenSearch and emits every case number as a Prometheus label.

The architecture needs an authoritative-source statement, transaction/event consistency, replay and reindex strategy, data classification in every copy, recovery testing, and ownership. Case number must not be a high-cardinality metric label; use bounded metrics for trends and safe correlation in logs/traces for individual cases.

## Official study links

- [Persistent data overview](https://docs.nais.io/persistence/)
- [Data responsibilities](https://docs.nais.io/persistence/explanations/responsibilities/)
- [Kafka](https://docs.nais.io/persistence/kafka/)
- [Observability](https://docs.nais.io/observability/)
- [Automatic instrumentation](https://docs.nais.io/observability/how-to/auto-instrumentation/)

### Google Cloud bridge

Cloud SQL, Cloud Storage and BigQuery retain their Google Cloud behavior when provisioned through Nais. The [Google Cloud data and operations module]({{< relref "/cloud-platforms/google-cloud/05-data-integration-and-operations.en.md" >}}) explains the underlying service trade-offs and Well-Architected view.

---
title: "Data, integration and production operations"
translationKey: gcp-data-operations
module: "05"
weight: 50
track: "Architecture"
duration: "35 min"
level: "Intermediate"
summary: "Match storage and messaging to data behavior, then operate the whole system with SLOs, telemetry, resilience, cost controls and the Well-Architected Framework."
topics: ["Data services", "Observability and SLOs", "Reliability and cost"]
last_reviewed: "22 August 2026"
outcomes:
  - "Select storage from access, consistency and recovery needs"
  - "Separate operational messaging from analytical data movement"
  - "Turn logs, metrics and traces into SLO-driven operations"
  - "Review an architecture across all six Well-Architected pillars"
next: { url: "/cloud-platforms/google-cloud/06-knowledge-check/", label: "Next: knowledge check" }
---

## Choose data services from behavior

Begin with workload characteristics rather than a favourite database:

- Is the data relational, document-shaped, object/blob, analytical or streaming?
- Which operations must be transactional?
- What consistency does each read require?
- What are the read/write patterns, volume and growth?
- Which RPO and RTO must recovery meet?
- Where may data reside, and when must it be deleted?
- Who owns schema evolution and access review?

| Need | Google Cloud starting point | Core trade-off |
| --- | --- | --- |
| Relational application data | Cloud SQL | Familiar engines and managed operations; regional design and connection limits matter |
| Globally scalable relational transactions | Spanner | Strong consistency and horizontal scale with a distinct schema/cost model |
| Document/mobile application data | Firestore | Flexible documents and client integration; query/index model shapes the design |
| Objects, files and archives | Cloud Storage | Durable object storage; not a mounted transactional filesystem |
| Analytical warehouse | BigQuery | Serverless columnar analytics; scan patterns, partitioning and governance drive cost |
| In-memory cache | Memorystore | Low latency; cache loss and eviction must not corrupt the source of truth |

A managed database removes hardware and much routine maintenance, not data ownership. Teams still own schema, migrations, query behavior, data minimization, authorization, retention, recovery requirements and restore verification.

## Cloud Storage is object storage

A bucket contains immutable-object generations addressed by name. Applications should not assume filesystem rename, append or locking semantics. Storage class and lifecycle rules can move or delete objects as they age. Versioning or soft-delete features can help with accidental change, but retention and recovery must be deliberately configured and tested.

Uniform bucket-level access simplifies authorization by using IAM consistently instead of mixing object ACLs. Public access prevention, signed URLs, encryption requirements and audit logs depend on the use case.

## Cloud SQL and connection management

Cloud SQL offers managed PostgreSQL, MySQL and SQL Server. High availability can provide a standby across zones in a region; read replicas solve read scaling, not every disaster-recovery requirement. Automated backups and point-in-time recovery are only useful when retention and restore procedures meet the product's RPO/RTO.

Serverless and highly scaled applications can exhaust database connections long before CPU. Use connection pooling, cap application scale, measure saturation and plan migrations. A database schema change must be compatible with rolling application versions.

## BigQuery is an analytical engine

BigQuery is designed for analytical scans, aggregations and data pipelines, not as a drop-in transactional database. Partitioning, clustering and selecting only necessary columns can reduce scanned data and cost. Separate raw, curated and serving layers where that improves ownership and quality, but do not copy personal data without a lifecycle.

IAM, row-level security, column-level policy tags and authorized views provide different access patterns. Data governance must say who owns datasets, quality, lineage, classification and deletion—not merely who can run a query.

## Messaging and integration

Pub/Sub delivers asynchronous messages between independent publishers and subscribers. Design for duplicate delivery, retries, poison messages, ordering requirements and observability. A successful publish means the platform accepted the message; it does not mean the business process completed.

Use:

- Pub/Sub for decoupled event distribution and streaming ingestion;
- Cloud Tasks for explicit, rate-controlled delivery of tasks to a handler;
- Eventarc for routing supported platform events;
- Workflows for visible orchestration of service calls;
- Dataflow for Apache Beam batch and streaming pipelines.

An event should have a clear owner, contract, versioning strategy, sensitivity classification and retention. Do not make a message broker the only authoritative source unless that is an intentional event-sourcing design with recovery understood.

## Observability is a feedback system

Google Cloud Observability combines Cloud Monitoring, Cloud Logging, Error Reporting, Trace and Profiler capabilities. Instrument applications with OpenTelemetry where practical so signals are portable and correlated.

The useful model begins with users:

1. Define a **service-level indicator** such as successful non-user-error requests within 500 ms.
2. Set a **service-level objective** over a window, based on user and business needs.
3. Alert on meaningful error-budget burn rather than every transient resource spike.
4. Connect the alert to a runbook, owner and escalation path.

Metrics show trends and aggregates, logs explain discrete events, and traces show request paths across dependencies. None alone is “observability.” Correlation IDs and consistent service metadata make them a system.

## Reliability, delivery and cost

Reliability is an end-to-end property. Identify dependencies, failure domains and capacity limits; make timeouts finite; retry only transient failures with backoff and jitter; make side effects idempotent; and test restoration and regional failover rather than trusting configuration.

Infrastructure as Code makes environments reviewable and repeatable. CI/CD should separate build identity from runtime identity, produce immutable artifacts, verify policy, support progressive rollout and make rollback or roll-forward explicit.

Cost is also an architecture signal. Attribute spend, set budgets, watch unit cost, right-size requests, control data transfer and retention, and treat surprising cost as an operational anomaly. Optimization that destroys reliability or developer time is not automatically economical.

Review designs across Google's six [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework) pillars: operations, security/privacy/compliance, reliability, cost, performance and sustainability. A strength in one pillar can create a trade-off in another.

## Architecture checkpoint

Design an order service with relational transactions, receipt PDFs, domain events and analytical reporting. A strong starting answer might use Cloud SQL for orders, Cloud Storage for receipts, Pub/Sub for integration events and BigQuery for analytics. It must additionally specify transaction/event consistency, idempotency, schema ownership, PII lifecycle, backup and restore tests, database connection limits, SLOs, alerts and cost allocation.

## Official study links

- [Cloud Storage overview](https://docs.cloud.google.com/storage/docs/introduction)
- [Cloud SQL overview](https://docs.cloud.google.com/sql/docs/introduction)
- [BigQuery introduction](https://docs.cloud.google.com/bigquery/docs/introduction)
- [Google Cloud Observability](https://docs.cloud.google.com/stackdriver/docs)
- [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework)

### Nais bridge

Nais exposes several of these capabilities as self-service: Cloud SQL, Cloud Storage and BigQuery on GCP, plus Kafka, OpenSearch and Valkey. It also standardizes logs, metrics, traces and alerting. The platform provisions and operates shared infrastructure; the product team still owns the data, selection, configuration, migrations, privacy, recovery requirements, SLOs, incidents and cost.

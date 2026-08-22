---
title: "Google Cloud directly or through Nais?"
translationKey: nais-vs-google-cloud
module: "Guide"
weight: 5
track: "Decision guide"
duration: "35 min"
level: "Foundation → architecture"
summary: "Compare the developer experience, responsibility, support, flexibility and failure behavior when a product team uses Google Cloud directly or through Nais."
topics: ["Benefits and trade-offs", "Responsibility and support", "PostgreSQL failure scenarios"]
last_reviewed: "22 August 2026"
outcomes:
  - "Explain what Nais adds on top of Google Cloud"
  - "Choose between a supported Nais capability and direct Google Cloud access"
  - "Assign application, platform and provider responsibilities"
  - "Describe what happens during common Cloud SQL for PostgreSQL failures"
next: { url: "/cloud-platforms/nais/01-platform-model/", label: "Next: platform model and architecture" }
---

## The short answer

Nais is not a competing cloud beside Google Cloud. It is a **higher-level application platform** that uses Google Kubernetes Engine and selected managed services underneath. The choice is therefore not usually “Nais or Google.” It is:

- should the product team assemble and operate its Google Cloud setup through cloud-native APIs and tooling; or
- should it consume a supported Nais contract while the platform team handles common cloud and Kubernetes engineering?

Nais gives a team a paved road: a secure runtime, declarative deployment, identity integrations, traffic controls, secrets, observability and self-service data services. In return, the team accepts the capabilities, conventions and configuration surface that the platform supports.

The abstraction moves operational work to the platform layer. It **does not move ownership of the product, its users or its data** away from the product team.

## What the two alternatives mean

### Google Cloud directly

“Directly” means that the team or its cloud organization works primarily with Google Cloud projects, IAM, VPC, GKE or another runtime, Cloud SQL and other services through Terraform, Google Cloud APIs, `gcloud` or Cloud Console. An organization may still supply landing zones, policy and a central support agreement, but the team must design more of the application platform itself.

### Google Cloud through Nais

The team works primarily with a Nais team, application manifest, Nais Console, supported delivery actions and platform APIs. Nais operators translate desired state into Kubernetes and cloud resources and continually reconcile supported settings.

Each Nais cloud environment runs on GKE. A team has a namespace in each environment and a dedicated Google Cloud project for each environment. Selected resources, such as Cloud SQL databases and Cloud Storage buckets, are provisioned into the matching team project. The Google Cloud resources still exist; Nais changes the normal interface and responsibility boundary.

Using Nais does not prevent every direct use of Google Cloud. A team may receive direct access for a justified capability, but that resource then needs an explicit owner and operating model. Do not assume the Nais team supports a cloud resource merely because it shares a project with Nais-provisioned resources.

## Side-by-side comparison

| Concern | Google Cloud directly | Google Cloud through Nais |
|---|---|---|
| Primary interface | Google APIs, Terraform, `gcloud` and Cloud Console | Nais manifests, Console, CLI, APIs and supported GitHub Actions |
| Runtime | The team selects and configures GKE, Cloud Run, Compute Engine or another service | Applications and jobs run through the supported Nais workload contracts, normally on GKE |
| Kubernetes | The organization must design clusters, upgrades, controllers, namespaces, policy and integrations | The platform team operates clusters, controllers and the supported workload abstraction |
| Identity | The team assembles cloud IAM and application identity flows | Nais integrates workload identity and common Norwegian identity providers such as ID-porten, TokenX and Maskinporten, plus Entra ID |
| Network access | The team designs VPCs, firewall policy, load balancing, DNS and service connectivity | Common ingress and explicit application access policies are exposed through the Nais contract |
| Deployment | The team builds its own artifact, rollout, policy and deployment path | Supported actions and Nais deployment provide a standardized path to the runtime |
| Secrets | The team selects and integrates Secret Manager or another secret system | Platform-provided credentials are injected automatically; teams manage their own application secrets through supported interfaces |
| Data services | The team creates and governs any approved Google Cloud data service | Nais provides self-service for a selected set, including Cloud SQL, buckets and BigQuery |
| Observability | The team selects, connects and operates logging, metrics, tracing, dashboards and alerts | Nais provides common logging, metrics, traces and platform-integrated observability tools |
| Security baseline | The cloud organization and team must implement and verify it | Nais supplies supported defaults and guardrails; the team still owns application and data security |
| Flexibility | Broad Google Cloud catalogue and low-level configuration | Faster common path, but a smaller supported catalogue and configuration surface |
| Support | The organization must define platform ownership and its Google support route | Nais supports the platform contract; the product team supports its product; providers operate their managed services |
| Portability | Uses Google-specific APIs and architecture directly | Adds a Nais-specific application contract while still depending on Kubernetes and provider services underneath |
| Cost | Cloud consumption plus the engineering needed to build and run the platform | Cloud consumption remains; common platform engineering is shared, while some resilient defaults cost more |

## What a product team gains from Nais

### Less undifferentiated platform work

The team does not need to build a Kubernetes application platform before it can deliver its application. Cluster controllers, common policy, workload identity, ingress integration, credentials and telemetry paths are supplied as a coherent product.

### Consistent, reviewed defaults

The same platform contract can be used across teams and environments. Common security, privacy and operational patterns can be evaluated centrally and improved without every team inventing a separate implementation.

### Faster self-service

A workload and supported resources are requested declaratively. The declaration is versionable, reviewable and reconciled. The team spends less time coordinating manual infrastructure tickets or wiring together cloud services.

### Integrated Norwegian public-sector identity

Nais provides documented patterns for employee, citizen and machine identities through Entra ID, ID-porten, TokenX and Maskinporten. The application must still make correct domain authorization decisions, but the surrounding protocol and platform integration is standardized.

### A platform support boundary

The Nais team owns the shared runtime, platform operators, supported integrations, documentation and platform support. Product teams have somewhere to escalate evidence of a platform failure without each team becoming experts in every underlying component.

## What Nais does not give the team

Nais is not outsourced product operations. It does not decide:

- whether the service works correctly for its users;
- the application's architecture, code quality or domain authorization;
- which data may be stored, how long it is retained or whether processing is lawful;
- schema design, query behavior, connection-pool sizing or migration safety;
- the product's availability, latency, RPO and RTO objectives;
- whether a backup can restore the complete business service in time;
- how the product communicates with users during an incident; or
- whether an unsupported cloud capability is safe, compliant and operable.

Nais also does not make Google Cloud failure modes disappear. A Cloud SQL database provisioned through Nais remains Cloud SQL. Regions, zones, maintenance, quotas, connection limits, service availability and provider incidents still shape the product.

## Responsibility and support

| Area | Product team | Nais platform team | Google or another provider |
|---|---|---|---|
| Application behavior | Owns code, configuration, SLOs, alerts and user impact | Provides workload contract and platform signals | — |
| Shared runtime | Uses it correctly and reports evidence | Operates clusters, operators and supported platform components | Operates underlying cloud infrastructure where applicable |
| Data | Owns purpose, classification, schema, lifecycle, access and recovery requirements | Provisions supported services according to the declaration and provides tooling/documentation | Operates the managed storage service |
| Incident response | First responder for product impact; mitigates and communicates | Responds when evidence points to the Nais platform and coordinates its components | Responds through the organization's provider support agreement |
| Disaster recovery | Defines RPO/RTO, selects configuration and validates restored product behavior | Supplies supported interfaces and platform procedures | Supplies service recovery mechanisms and infrastructure |
| Cost | Owns product demand, requested sizes and inefficient use | Operates shared platform capacity and exposes supported controls | Charges for consumed services |

The exact support channel, on-call hours and vendor escalation route are tenant-specific. Public Nais documentation establishes the responsibility boundary but does not promise one universal Slack channel or response time. A production service must have a local runbook that names:

1. the product team's on-call or support channel;
2. the Nais support and incident channel for its tenant;
3. who is authorized to open a provider case;
4. severity definitions and expected response times; and
5. who owns user communication and the recovery decision.

### A practical escalation flow

1. **The product team detects user impact.** Check application changes, logs, metrics, database connections, quotas and dependency health.
2. **Classify the likely fault domain.** An invalid migration or exhausted connection pool is different from a Nais operator that cannot reconcile or a confirmed Cloud SQL incident.
3. **Mitigate product impact.** Roll back, reduce load, disable a feature or degrade safely where possible. Do not wait for fault attribution before protecting users.
4. **Escalate with evidence.** Include tenant, team, environment, application, resource, timestamps, change history, symptoms, dashboards and correlation identifiers.
5. **Keep product ownership.** Even when Nais or Google repairs infrastructure, the product team verifies correctness, reconciles missed work and closes user communication.

## PostgreSQL: what happens when the database is down?

This section describes **Cloud SQL for PostgreSQL requested through `spec.gcp.sqlInstances`**, which Nais currently recommends for a new PostgreSQL database. A separate Nais-operated PostgreSQL resource has its own configuration and lifecycle; do not mix the two failure models in a runbook.

### First: “down” is a symptom, not a diagnosis

An application can fail database operations because of:

- a failed instance, zone, region or network path;
- planned maintenance or an instance restart;
- exhausted database connections, CPU, memory or storage;
- invalid credentials or access configuration;
- locks, slow queries or an unsafe schema migration; or
- deleted or logically corrupted data.

The response differs for each case. Start with application and database signals rather than assuming a provider outage.

### Scenario 1: instance or zone failure with high availability

Nais exposes Cloud SQL high availability through `highAvailability: true`. Cloud SQL then maintains a primary and standby in different zones within one region using synchronous disk replication.

If the primary or its zone becomes unresponsive:

1. Cloud SQL detects missed health heartbeats.
2. The standby becomes the new primary automatically.
3. Existing database connections are closed.
4. The application reconnects using the same connection string or IP address.
5. Cloud SQL rebuilds standby capacity after the failed zone or instance returns.

Google advises that the instance is commonly unavailable for about 60 seconds during failover, although the duration varies. The application must use bounded connection timeouts, retry transient connection failures with backoff, and make retried operations idempotent where duplication is possible. Readiness and graceful degradation should prevent every unavailable database connection from becoming an uncontrolled restart storm.

HA reduces downtime for an instance or zonal failure. It does not mean zero downtime.

### Scenario 2: no high availability

`highAvailability` is optional in the Nais application specification. A team must not assume that provisioning Cloud SQL automatically gives it a cross-zone standby.

For a standalone instance, Cloud SQL does not automatically recover the database into a healthy zone after a zonal outage. Recovery can require point-in-time recovery into a new instance or promotion of a separately configured replica. Clients may then need a new address or connection name. The achievable RTO and RPO depend on configuration chosen **before** the outage.

### Scenario 3: the whole region is unavailable

Normal Cloud SQL HA is regional: the primary and standby occupy different zones in the same region. It does not keep the database available when the complete region is unavailable.

A stricter continuity requirement needs a cross-region design, such as a designated disaster-recovery replica, plus an explicit decision and promotion procedure. Cross-region replication is asynchronous, so recent committed transactions may not yet exist in the recovery region. The product team must decide whether the cost, operational complexity and possible non-zero RPO are justified.

### Scenario 4: accidental deletion or a bad migration

Failover does not repair a logical error. A destructive statement or bad migration can be replicated to the standby. Recovery then depends on backups, point-in-time recovery, replay and business reconciliation.

For Nais-provisioned Cloud SQL:

- automated backups run nightly by default and seven backups are retained by default;
- point-in-time recovery can be enabled, but is not enabled merely by requesting a database; and
- Nais documentation describes an additional daily on-premises disaster backup for catastrophic GCP failure.

A backup is evidence that recovery material may exist—not evidence that the product meets its RTO. The team must test the restore, database credentials, application rollout, event replay and verification of business data.

### Scenario 5: saturation looks like an outage

Suppose six application replicas each allow a pool of 30 database connections. They can demand 180 connections before maintenance tools and operational headroom are counted. A rolling deployment temporarily adds replicas and can make the peak larger.

Nais can deploy and scale the workload, but it cannot infer the safe total connection budget. The product team must coordinate:

- application replica limits;
- per-replica pool size and acquisition timeout;
- Cloud SQL tier and maximum connections;
- query latency, locks and transaction duration; and
- overload behavior when capacity is exhausted.

This is usually a product capacity incident, even though users experience it as “the database is down.”

## One service, implemented both ways

Consider an API that authenticates citizens, stores case state in PostgreSQL and exposes availability and latency signals.

### Direct Google Cloud design

The organization chooses and configures the runtime, project IAM, workload identity, VPC connectivity, ingress, certificates, DNS, secrets, Cloud SQL, HA, backups, observability, deployment, policy and provider support route. This offers broad control, but the product needs platform-engineering capacity or a separate internal platform.

### Nais design

The team declares an Application, ingress and access policies, selects the supported identity flow, requests Cloud SQL settings and deploys through the supported path. Nais creates and reconciles the Kubernetes and supported cloud integrations. The team focuses on application behavior, authorization, schema, database configuration, SLOs, alerts and recovery testing.

The second design contains fewer team-owned platform components. It does **not** contain fewer product responsibilities.

## How to choose

Prefer the supported Nais path when:

- the workload and required services fit the platform contract;
- common security, identity, delivery and observability patterns meet the need;
- faster, consistent self-service is more valuable than low-level customization; and
- the team wants shared platform expertise while retaining product ownership.

Consider direct Google Cloud access when:

- a necessary capability or topology is not supported by Nais;
- the team needs a provider feature or control that the Nais contract intentionally hides;
- the workload is itself platform infrastructure rather than a normal application; or
- the organization has explicitly accepted the additional security, compliance, cost, lifecycle and support responsibilities.

Direct access should be an architectural decision, not an escape hatch used before checking the supported platform capability.

## Production decision checklist

Before choosing either route, answer:

1. Which runtime and managed services does the product need?
2. Does Nais support the required configuration and environments?
3. Which components will the product team operate directly?
4. Who owns application, platform and provider incidents?
5. Where are the local support channels and escalation expectations documented?
6. What are the product's availability SLO, RPO and RTO?
7. Is Cloud SQL HA explicitly enabled where required?
8. Is point-in-time recovery enabled where required, and has restore been tested?
9. How does the application behave during 60 seconds—or longer—without its database?
10. How are region failure, missed events and data reconciliation handled?
11. What is the expected cloud cost, including HA, replicas, logs and shared platform allocation?
12. Which assumptions have been tested rather than inferred from a feature name?

## Official references

- [What is Nais?](https://docs.nais.io/explanations/nais/)
- [Nais under the hood](https://docs.nais.io/explanations/under-the-hood/)
- [Responsibilities for data in Nais](https://docs.nais.io/persistence/explanations/responsibilities/)
- [Nais authentication and authorization](https://docs.nais.io/auth/)
- [Nais Cloud SQL reference](https://docs.nais.io/persistence/cloudsql/reference/)
- [Nais Application specification](https://docs.nais.io/workloads/application/reference/application-spec/)
- [Google Cloud SQL high availability](https://docs.cloud.google.com/sql/docs/postgres/high-availability)
- [Google Cloud SQL disaster recovery](https://docs.cloud.google.com/sql/docs/postgres/intro-to-cloud-sql-disaster-recovery)
- [Google Cloud SQL connection management](https://docs.cloud.google.com/sql/docs/postgres/manage-connections)

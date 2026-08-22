---
title: "Production readiness and operating ownership"
translationKey: nais-production-readiness
module: "05"
weight: 50
track: "Operations"
duration: "30 min"
level: "Intermediate"
summary: "Turn a deployed workload into an operated product through SLOs, dependency and recovery design, secure supply chains, cost ownership and incident practice."
topics: ["Production checklist", "Supply chain security", "Incidents and recovery"]
last_reviewed: "22 August 2026"
outcomes:
  - "Run a production-readiness review across the complete service"
  - "Define SLO, alert, runbook and ownership together"
  - "Explain the security controls from repository to workload"
  - "Prepare deployment, dependency and data recovery paths"
next: { url: "/cloud-platforms/nais/06-knowledge-check/", label: "Next: knowledge check" }
---

## Deployment is the beginning of operations

A successful Nais deployment proves that the platform accepted the declaration and started the workload. Production readiness asks a larger question: can the team deliver the intended user outcome safely, observe it, respond to failure and recover its data and dependencies?

Review the service as one system:

```text
user → ingress → application → identity → dependencies → data
                ↘ logs · metrics · traces · alerts
repository → build → image → deploy → runtime
```

A healthy pod is only one node in that graph.

## Service definition and ownership

Before production, write down:

- the service purpose and critical user journeys;
- owning team and contact/escalation paths;
- users, data classification and required identity flows;
- upstream and downstream dependencies with owners;
- expected load, growth and cost owner;
- change windows or compatibility constraints;
- availability, latency, correctness and recovery objectives;
- support hours and incident expectations.

If the owner is “the platform,” revisit module 1. Nais owns shared capabilities; it does not own the domain outcome of every application.

## SLO, alert and runbook form one unit

An SLO without telemetry cannot be measured. An alert without an owner is noise. An on-call owner without a runbook must rediscover the system under pressure.

A practical chain is:

1. **SLI:** percentage of valid API requests completed successfully within 800 ms.
2. **SLO:** 99.9% over a rolling 28-day window.
3. **Alert:** fast and slow error-budget burn signals.
4. **Runbook:** dashboards, dependency checks, recent deploys, safe mitigations, rollback and escalation.
5. **Review:** after incidents, confirm whether the signal and response protected users.

Also define business correctness signals. A queue consumer can be technically available while no cases progress.

## Dependency and failure design

For each dependency, specify:

- timeout and cancellation behavior;
- retryable errors, exponential backoff and jitter;
- idempotency of side effects;
- concurrency and connection limits;
- circuit-breaking or load-shedding behavior where useful;
- fallback or degraded mode;
- data consistency after partial completion;
- observable signals and owner contact.

Retries are load multipliers. A three-layer call chain with three retries at each layer can amplify one user request dramatically. Retry at a layer that understands the operation, cap attempts and make deadlines propagate.

## Safe change and rollback

A rolling deployment temporarily runs old and new versions together. APIs, events and database schemas must tolerate this overlap. Use expand/migrate/contract for schema change; make event consumers tolerant of compatible evolution; and do not reuse an image tag for different content.

Decide whether failure is best handled by rollback or roll-forward. A rollback cannot undo an irreversible data migration or an externally emitted event. Feature flags can decouple deployment from exposure, but flags need owners, defaults and deletion dates.

Test the operational path: deploy, observe, stop traffic through readiness, terminate gracefully, roll back, restore and reprocess. A plan never exercised is a hypothesis.

## Software supply chain

Nais can establish a traceable chain from an authorized GitHub repository through supported build actions to a signed container image and deployment. The build can produce a software bill of materials, and the platform provides vulnerability insight for images.

Product-team responsibilities remain:

- protect branches and review code/workflows;
- minimize GitHub Actions permissions and pin trusted actions appropriately;
- maintain base images and dependencies;
- avoid secrets in repository and build output;
- triage vulnerabilities by exploitability and exposure;
- rebuild and redeploy when dependencies or base images change;
- retain evidence required by the organization's risk process.

See [vulnerability insights and management](https://docs.nais.io/services/vulnerabilities/).

## Capacity and cost

Resource requests affect shared cluster capacity and cost. Autoscaling maximums affect downstream connections and spend. Logs, traces, Kafka retention, database tiers and analytical scans can dominate application CPU cost.

Assign cost to the product, watch trends and relate spend to useful units such as requests or processed cases. Cost anomalies can indicate a loop, traffic attack, runaway query, retention error or logging explosion. Cost belongs in operational dashboards, not only quarterly reporting.

## Recovery and continuity

For each stateful capability, document:

- authoritative data source;
- infrastructure durability and backup features;
- accidental-deletion protection;
- RPO and RTO;
- restore steps, access and decision authority;
- validation after restore;
- replay or reconciliation of events created after the recovery point;
- communication and legal obligations.

Test recovery using a representative environment and record actual timings. Recovery ownership cannot be inferred during an incident.

## Production-readiness checklist

### Workload

- immutable maintained image, non-root process and no durable local state;
- measured requests, safe limits and bounded scaling;
- at least two replicas where availability needs it;
- distinct probes and graceful termination;
- compatible rollout and rollback/roll-forward plan.

### Security and data

- minimal access policies and correct token audiences/scopes;
- domain authorization and audit context;
- short-lived identities and managed secrets;
- data purpose, location, access, retention and deletion documented;
- backup/restore and incident obligations tested.

### Operations

- SLOs and business signals;
- actionable alerts with owners and runbooks;
- dependency dashboards and deploy markers;
- on-call/escalation agreement;
- capacity, quota and cost monitoring;
- recent game day or recovery exercise.

## Architecture checkpoint

The team says: “Nais has autoscaling, logs and backups, so we are production-ready.” Identify the missing proof.

The statement lacks measured resource and downstream limits, SLOs, actionable alerts, domain signals, owners, identity/authorization review, data responsibility, restore testing, deployment compatibility, dependency failure behavior, incident practice and cost ownership. Platform features are inputs to readiness, not evidence of readiness.

## Official study links

- [Good workload practices](https://docs.nais.io/workloads/explanations/good-practices/)
- [Observability](https://docs.nais.io/observability/)
- [Vulnerability management](https://docs.nais.io/services/vulnerabilities/)
- [Data responsibilities](https://docs.nais.io/persistence/explanations/responsibilities/)
- [Operate workloads and services](https://docs.nais.io/operate/)

### Google Cloud bridge

Use the [Google Cloud data and operations module]({{< relref "/cloud-platforms/google-cloud/05-data-integration-and-operations.en.md" >}}) to review the managed-service failure, SLO, cost and Well-Architected concepts below this checklist.

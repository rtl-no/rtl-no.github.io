---
title: "Platform model and architecture"
translationKey: nais-platform-model
module: "01"
weight: 10
track: "Foundations"
duration: "25 min"
level: "Foundation"
summary: "Understand Nais as a product for autonomous teams, the team/environment/workload model, and how its contract maps to Kubernetes and Google Cloud."
topics: ["Teams and environments", "Paved roads", "Naiserator and GKE"]
last_reviewed: "22 August 2026"
outcomes:
  - "Explain what Nais is—and what it is not"
  - "Map team, environment and workload concepts to Kubernetes"
  - "Distinguish platform responsibility from product responsibility"
  - "Describe how a Nais declaration becomes cloud resources"
next: { url: "/cloud-platforms/nais/02-workloads-and-delivery/", label: "Next: workloads and delivery" }
---

## Nais is a platform product

Nais aims to give teams the technical capabilities needed to develop and run software safely without every team becoming a Kubernetes platform team. It offers building blocks for runtime, identity, traffic, data, observability, secrets, delivery and operations.

The operating idea is important: an unobstructed multidisciplinary team that can take responsibility for what it builds learns faster than a team handing every production change to a separate operations queue. Nais therefore removes repeatable platform complexity while preserving the insight and controls a product team needs.

Four principles follow:

1. **Self-service:** desired state is declared through versioned manifests, Console or platform APIs.
2. **Paved roads:** secure defaults and integrated capabilities make the common path easier.
3. **Team ownership:** the product team owns code, data, user outcomes and production behavior.
4. **Platform as a product:** Nais has users, documentation, APIs, a console, support and an evolving contract—not merely clusters.

Read [What is Nais?](https://docs.nais.io/explanations/nais/) and [What is a team?](https://docs.nais.io/explanations/team/).

## The core vocabulary

| Nais concept | Practical meaning | Underlying idea |
| --- | --- | --- |
| Team | People responsible for related workloads and resources | Ownership and access boundary |
| Tenant | An organization or platform installation using Nais | Top-level organizational context |
| Environment / cluster | A runtime target such as development or production | Kubernetes cluster; cloud environments use GKE |
| Namespace | The team's scope inside a cluster | Kubernetes Namespace |
| Workload | Code that runs as an Application or Naisjob | Kubernetes resources plus platform integrations |
| Resource | Data or platform capability requested by the team | Custom resource and/or managed service |

A team is not only an access group. It should reflect people who can develop and operate the workloads. If ownership is unclear, manifests and dashboards cannot compensate.

Environment boundaries matter. Development and production differ in identities, data, exposure, reliability and change control. “It worked in dev” proves the build path, not production readiness.

In the current cloud architecture, each team also has a dedicated Google Cloud project for each environment. A requested bucket, for example, is provisioned in the team's project for the matching environment. The Kubernetes namespace and Google Cloud project therefore express related team/environment boundaries at different layers.

## The layers under the developer contract

In a cloud environment, the stack can be simplified as:

```text
Product team
  └─ Nais manifest / Console / API
      └─ Naiserator and capability-specific operators
          └─ Kubernetes resources and platform components
              └─ GKE, Google Cloud and Aiven services
```

The **Nais Application** is a Kubernetes Custom Resource. The core operator, [Naiserator](https://github.com/nais/naiserator), watches desired state and produces the Kubernetes resources and integrations required by the specification. Other operators manage capabilities such as identity or data.

This is a reconciliation model, not a one-time script. If someone manually changes a generated resource or vendor setting, an operator may restore declared state. Durable changes belong in the supported declaration or management interface.

## Abstraction without illusion

Nais allows a developer to say “run this image with two replicas, expose this ingress, allow this caller and connect this database.” The platform can translate that intent into Deployments, Services, ingress resources, identities, policies and managed-service configuration.

The abstraction does not make the underlying properties disappear:

- GKE placement still defines failure domains and capacity;
- Google Cloud IAM still controls access to cloud resources;
- VPC and Kubernetes networking still carry traffic;
- Cloud SQL still has connection, availability and recovery characteristics;
- Aiven Kafka still has partitions, offsets and schema concerns;
- Kubernetes still restarts and reschedules containers.

Product teams do not need to operate every layer, but architects should know which layer owns a behavior when diagnosing risk or failure.

## Shared responsibility

| Platform responsibility | Product-team responsibility |
| --- | --- |
| Clusters and shared platform components | Application code and domain correctness |
| Operators, CRDs, automation and supported defaults | Workload manifests and resource choices |
| Integrations for identity, data and telemetry | Correct use of identities and domain authorization |
| Platform documentation, Console, APIs and support | Data purpose, privacy, lifecycle and recovery requirements |
| Platform availability and upgrade path | Product SLOs, alerts, incidents, dependencies and cost |

The exact boundary varies by capability. A managed database may have automated infrastructure backup, while the team remains responsible for knowing whether it can restore the business service within its required RPO and RTO.

## Architecture checkpoint

A team asks the platform group to “own production” because Nais owns Kubernetes. Rewrite the statement as an explicit responsibility model.

A good answer says the platform team owns the shared runtime, operators, supported integrations and platform availability. The product team owns whether the service works for users, code and dependency quality, manifests, domain access, data, SLOs, alert response, recovery requirements and product incidents. Both sides need an escalation contract for platform failures.

## Official study links

- [What is Nais?](https://docs.nais.io/explanations/nais/)
- [Under the hood](https://docs.nais.io/explanations/under-the-hood/)
- [The runtime environment](https://docs.nais.io/workloads/explanations/environment/)
- [Naiserator source](https://github.com/nais/naiserator)

### Google Cloud bridge

Review the [Google Cloud foundations module]({{< relref "/cloud-platforms/google-cloud/01-foundations.en.md" >}}) to understand the projects, locations and billing model below Nais. Nais changes the interface available to a product team, while the cloud resource hierarchy remains part of the platform team's control plane.

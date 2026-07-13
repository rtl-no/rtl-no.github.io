---
title: "The Nais platform"
summary: "How Nais makes Kubernetes, identity, data, observability and secure deployment available as self-service building blocks for autonomous product teams."
description: "An architectural guide to Nais: runtime, declarative manifests, Naiserator, identity, zero trust, data, observability and responsibilities."
translationKey: nais-platform
category: "Cloud platforms · Application platform"
toc: true
last_reviewed: "13 July 2026"
---

[Nais](https://docs.nais.io/explanations/nais/) is an application platform designed to give teams the technical capabilities they need to develop and run software safely, without every team having to build its own Kubernetes and cloud platform. The name originally stood for *NAVs Application Infrastructure Services*; the Nais community is working towards letting the N stand for *Norwegian*.

Nais is not another cloud provider. It is a **platform layer over Kubernetes and managed services** with a clear, declarative developer experience. The platform team builds standardized paved roads, while the product team retains responsibility for the application and its data.

## The platform idea

Nais assumes that a multidisciplinary team able to develop, deploy and operate its own product can deliver faster and learn directly from production. The platform attempts to remove unnecessary operational complexity while preserving the insight a team needs to take responsibility.

This leads to four principles:

1. **Self-service:** teams describe desired state in version-controlled manifests.
2. **Sound defaults:** security, runtime, networking and telemetry have sensible defaults.
3. **Product ownership:** the team owns code, quality, cost, data and production behavior.
4. **Platform as a product:** Nais provides documentation, a console, APIs and support—not merely a Kubernetes installation.

## What happens under the hood

A Nais application is one or more running instances of a container image. The developer describes it with a Kubernetes Custom Resource, usually in `nais.yaml`:

```yaml
apiVersion: nais.io/v1alpha1
kind: Application
metadata:
  name: order-api
  namespace: my-team
spec:
  image: europe-north1-docker.pkg.dev/project/app/order-api:1.4.0
  ingresses:
    - https://order-api.example.com
  replicas:
    min: 2
    max: 6
  resources:
    requests:
      cpu: 50m
      memory: 256Mi
  accessPolicy:
    inbound:
      rules:
        - application: order-frontend
```

The [Application specification](https://docs.nais.io/workloads/application/reference/application-spec/) can also describe probes, autoscaling, environment variables, secrets, ingress, outbound traffic, identity integrations and data services.

The core operator, [Naiserator](https://github.com/nais/naiserator), translates the concise Nais specification into the Kubernetes resources and integrations actually required. The team expresses **intent**—“run this workload with this identity and these dependencies”—while the platform handles much of the implementation detail.

Each cloud-based Nais environment is a Kubernetes cluster on Google Kubernetes Engine. Kubernetes is primarily the implementation layer; the developer contracts are the Nais manifests, Nais Console and platform APIs.

## From commit to production

The basic delivery chain is simple and traceable:

1. The team builds the application as a container image.
2. Code, Dockerfile, Nais manifest and workflow live in GitHub.
3. GitHub Actions builds, tests and publishes the image.
4. The Nais deploy action submits the manifest and image reference to the target environment.
5. Platform operators create or change the workload, network, identity and selected resources.
6. The team follows deployment and operations through GitHub, Nais Console and observability tools.

The official [Hello Nais tutorial](https://docs.nais.io/tutorials/hello-nais/) demonstrates the full path. Nais supports both long-running **Applications** and **Jobs** that finish, run once or follow a schedule.

## Runtime and traffic

An Application provides capabilities including:

- a Kubernetes Deployment and Service;
- HTTPS ingress for the intended audience;
- CPU and memory requests;
- minimum and maximum replicas with automatic scaling;
- startup, readiness and liveness probes;
- controlled rolling updates and termination;
- environment-specific configuration and secret integration.

The platform can automate these mechanisms, but the application must be designed for them. It should tolerate multiple replicas, handle termination signals, report health correctly and keep durable state outside the container.

## Identity and zero trust

Nais treats identity as a platform capability rather than a library every team has to configure from scratch.

### Workload identity

Every workload has its own identity, effectively tied to a Kubernetes Service Account. The platform can inject short-lived OIDC tokens. Short lifetimes and automatic rotation reduce the need for persistent client secrets and make it possible to assign precise rights to a workload.

### Users and systems

The [authentication area](https://docs.nais.io/auth/) covers different needs:

- **ID-porten** for citizen login;
- **TokenX** for token exchange when an internal service chain must act on behalf of a logged-in user;
- **Maskinporten** for machine-to-machine integration between organizations;
- **Microsoft Entra ID** for organizational identities and internal users;
- workload identity for the service's own machine identity.

Availability and exact configuration vary by environment. Architects must separate end-user identity, workload identity and any delegated context carried by an API call.

### Access policies

Nais follows a zero-trust principle: traffic between applications is not automatically permitted. `accessPolicy` explicitly describes which apps, namespaces, clusters or external hosts a workload may communicate with. For supported token mechanisms, the same relationships are also used to validate incoming clients.

A network rule is not the complete authorization model. Allowing frontend A to reach backend B does not necessarily mean that the end user may read a particular resource. The application must still enforce domain authorization at the appropriate level.

## Data as self-service resources

The [Nais data overview](https://docs.nais.io/persistence/) offers several storage types because one database does not fit every problem:

| Need | Platform service | Important architecture question |
| --- | --- | --- |
| Relational transactions | PostgreSQL / Cloud SQL | Consistency, connections, migration, HA and recovery |
| Object and file storage | Google Cloud Storage | Lifecycle, versioning, retention and access |
| Event streams | Kafka delivered through Aiven | Partitioning, ownership, schemas, replay and why Kafka should not be the only master |
| Analytics | BigQuery | Data minimization, cost, access and lifecycle |
| Search and documents | OpenSearch | Indexing, reindexing and the authoritative data source |
| Fast key/value and cache | Valkey | Behavior on loss, eviction and failure |

A declaration can create infrastructure and provide credentials, but it cannot choose the correct data model or recovery strategy for the team. The [responsibility guide](https://docs.nais.io/persistence/explanations/responsibilities/) is explicit: the platform provisions and maintains the infrastructure, while the team remains responsible for its data, privacy, configuration, recovery and daily use.

## Observability as a standard capability

[Observability in Nais](https://docs.nais.io/observability/) covers logs, metrics and traces:

- text written to `stdout` and `stderr` is collected automatically and searchable in Loki;
- metrics follow the OpenMetrics/Prometheus model and can be visualized and alerted on in Grafana;
- traces follow OpenTelemetry and are stored in Tempo;
- alerts can be routed through Alertmanager;
- Nais APM combines health, RED signals, errors, endpoints, database insights, traces and logs.

Nais can auto-instrument supported runtimes with an OpenTelemetry agent. That provides a fast start, but useful observability still requires the team to define meaningful service levels, alerts, correlation IDs and domain signals.

## Secure software supply chain

The platform can provide a coherent path from an authorized GitHub repository to a running workload. The build flow can produce an SBOM, and Nais provides insights and metrics for vulnerabilities in images. Together with short-lived identities, explicit access policies and version-controlled configuration, this improves traceability.

It does not remove the team's responsibility for dependency updates, secure base images, code review, secret handling and vulnerability response. The platform makes controls available and visible; the team must use them.

## Responsibility model

| Platform team | Product team |
| --- | --- |
| Kubernetes clusters and shared platform components | Application code, tests and domain correctness |
| Operators, CRDs, automation and standards | Manifests, resource choices and environment configuration |
| Identity, data and observability integrations | Domain authorization and correct use of identities |
| Documentation, console, APIs and support | Data responsibility, privacy, recovery and backup requirements |
| Platform availability and upgrade path | Product SLOs, alerts, incidents and cost |

This is the essence of sound platform engineering: centralize undifferentiated complexity without centralizing every decision or all operational ownership.

## When Nais is a good choice

Nais is well suited to organizations and teams that:

- deliver containerized web applications, APIs, background jobs and event-driven services;
- want a standardized route from GitHub to Kubernetes without making everyone a cluster administrator;
- need Norwegian public-sector identity integration alongside workload identity;
- want data, secrets, networking and observability as self-service platform capabilities;
- organize around autonomous teams that own the complete product lifecycle.

Nais and [Altinn]({{< relref "altinn-platform.en.md" >}}) do not necessarily compete. Altinn offers domain and collaboration capabilities for public digital services. Nais provides a general runtime and developer platform. A solution may run APIs and supporting components on Nais while integrating with Altinn where service needs and access arrangements call for it.

## Questions an architect should ask

1. Which Kubernetes and cloud complexity does the platform own, and what must the team still understand?
2. Which identity represents the user, the workload and any delegation in each call?
3. Does `accessPolicy` reflect the actual service graph, least privilege and domain authorization?
4. Which data service matches the consistency, search, analytics and recovery requirements?
5. Can the application scale horizontally and roll out without losing traffic or state?
6. Which signals show that users receive a working service—not merely that pods are running?
7. Who responds to security findings, cost anomalies and production incidents?

## Official starting points

- [Nais developer documentation](https://docs.nais.io/)
- [What is Nais?](https://docs.nais.io/explanations/nais/)
- [Application specification](https://docs.nais.io/workloads/application/reference/application-spec/)
- [Observability](https://docs.nais.io/observability/)
- [Persistent data](https://docs.nais.io/persistence/)
- [Nais on GitHub](https://github.com/nais)

*Last reviewed 13 July 2026. Nais evolves continuously, and some capabilities are environment-specific or in preview. Treat the official documentation as authoritative for current support.*

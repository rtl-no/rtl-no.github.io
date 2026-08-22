---
title: "Compute, containers and workload selection"
translationKey: gcp-compute
module: "04"
weight: 40
track: "Application platform"
duration: "30 min"
level: "Intermediate"
summary: "Choose deliberately between Cloud Run, GKE and Compute Engine, then design stateless services, jobs and event-driven workloads for scaling and failure."
topics: ["Cloud Run", "GKE", "Compute Engine"]
last_reviewed: "22 August 2026"
outcomes:
  - "Choose a runtime from workload needs rather than familiarity"
  - "Explain the operational boundary of Cloud Run, GKE and Compute Engine"
  - "Design a container for health checks, scaling and termination"
  - "Separate service, job and event-processing patterns"
next: { url: "/cloud-platforms/google-cloud/05-data-integration-and-operations/", label: "Next: data, integration and operations" }
---

## Choose the highest useful abstraction

The first compute question is not “which VM size?” It is “how much infrastructure control does this workload truly require?” A higher-level runtime reduces undifferentiated operations, but only if its constraints fit the application.

| Runtime | Good fit | Team still owns |
| --- | --- | --- |
| Cloud Run | Stateless HTTP/gRPC services, event handlers, functions, jobs and worker pools | Code, container/runtime contract, scaling limits, identity, data and service reliability |
| Google Kubernetes Engine | Kubernetes workloads needing its API, ecosystem, scheduling or platform extensibility | Workload design plus the selected cluster responsibilities |
| Compute Engine | Legacy software, custom OS/runtime, appliances or control that managed runtimes cannot provide | Guest OS, patching model, instance lifecycle and much more infrastructure |

This is not a maturity ladder. A small HTTP API does not become more professional by moving from Cloud Run to Kubernetes. GKE is valuable when Kubernetes capabilities justify its larger control surface.

## Cloud Run: managed container execution

Cloud Run runs containers without requiring a team to create a cluster. A **service** exposes a stable HTTPS endpoint and scales stateless instances in response to traffic and configured metrics. A **job** runs work to completion, possibly as parallel tasks. A **worker pool** supports continuous non-request workloads such as pull consumers.

The runtime contract matters:

- the service process listens on the provided port;
- the writable filesystem is ephemeral;
- instances can start and stop at any time;
- local memory and files are not shared durable state;
- concurrency, minimum/maximum instances and CPU allocation affect behavior and cost;
- the attached service account is the runtime identity.

Scaling to zero can reduce idle cost but introduces cold starts. Minimum instances can reduce latency at a cost. Maximum instances protect downstream systems only if selected from measured database connections, API quotas and back-pressure behavior.

Read [What is Cloud Run?](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run).

## GKE: Kubernetes with a managed control plane

Google Kubernetes Engine provides managed Kubernetes. In **Autopilot** mode, Google manages nodes and enforces a more opinionated operating model. In **Standard** mode, the customer controls node pools and more cluster configuration. Both still expose Kubernetes concepts such as namespaces, Deployments, Services, Pods, ConfigMaps, Secrets and service accounts.

Kubernetes reconciles desired state. A Deployment says how many replicas and which pod template should exist; it does not make an application stateless or reliable by itself. The workload must:

- expose meaningful startup, readiness and liveness probes;
- request realistic CPU and memory;
- tolerate rescheduling and multiple replicas;
- handle termination signals and drain in-flight work;
- store durable state outside the container;
- emit useful logs, metrics and traces;
- use a narrowly scoped workload identity.

Use GKE when you need Kubernetes APIs, custom controllers, specialized scheduling, portability around Kubernetes contracts or a shared internal platform. Compare [GKE and Cloud Run](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/gke-and-cloud-run) before choosing the more operationally demanding option.

## Compute Engine: infrastructure control

Compute Engine provides virtual machines, disks, images, instance templates, managed instance groups and autoscaling. Managed instance groups can recreate unhealthy VMs and distribute identical instances, but the guest OS and application stack remain your concern.

VMs fit software that requires kernel or OS control, unsupported agents, specialized networking, traditional stateful installation or migration with minimal initial change. Even then, decide whether the destination should remain a VM after migration or move to a managed service later.

Avoid pets: prefer immutable images, instance templates, automated startup and externalized configuration. A manually repaired production VM is hard to reproduce and audit.

## Events and asynchronous work

Pub/Sub decouples publishers from subscribers. Delivery is generally at least once, so consumers must be idempotent or deduplicate at the business boundary. Acknowledgement deadlines, retries, ordering needs, dead-letter handling and back-pressure belong in the design.

Eventarc routes supported events to destinations such as Cloud Run. Cloud Tasks is useful when an application needs explicit scheduled delivery, rate control and per-task retry towards an HTTP handler. Workflows orchestrates calls when the process is naturally a sequence of managed-service steps.

Ask whether the workload is:

- request/response or asynchronous;
- continuously running or finite;
- latency-sensitive or batch-oriented;
- stateless or stateful;
- horizontally scalable;
- tolerant of duplicate delivery;
- dependent on Kubernetes-specific capabilities.

Those properties narrow the runtime far better than a product popularity list.

## Architecture checkpoint

A team has a public stateless API, an hourly report generator, a Kafka consumer that runs continuously, and a licensed document converter requiring a custom OS package.

A reasonable starting portfolio is Cloud Run service for the API, Cloud Run job for report generation, a worker pool or GKE workload for the continuous consumer depending on control requirements, and Compute Engine for the converter if it cannot be containerized into a managed runtime. The answer should also cover scaling bounds, identity, failure retries, data persistence, patching ownership and observability.

## Official study links

- [Cloud Run overview](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run)
- [GKE overview](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview)
- [GKE and Cloud Run comparison](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/gke-and-cloud-run)
- [Compute Engine overview](https://docs.cloud.google.com/compute/docs/overview)
- [Pub/Sub overview](https://docs.cloud.google.com/pubsub/docs/overview)

### Nais bridge

Nais primarily offers long-running **Application** workloads and finite or scheduled **Naisjob** workloads on GKE. Product teams provide a container and a concise custom resource; Naiserator creates the underlying Kubernetes resources and integrations. This greatly reduces cluster work, but all container design responsibilities—health, shutdown, resources, horizontal scaling, statelessness and observability—still apply.

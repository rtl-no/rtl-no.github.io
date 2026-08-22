---
title: "Workloads, manifests and delivery"
translationKey: nais-workloads-delivery
module: "02"
weight: 20
track: "Developer path"
duration: "35 min"
level: "Foundation"
summary: "Move from container image to Nais Application or Naisjob, understand the manifest contract, and design a traceable GitHub-to-production delivery flow."
topics: ["Application and Naisjob", "nais.yaml", "GitHub Actions"]
last_reviewed: "22 August 2026"
outcomes:
  - "Choose Application or Naisjob from execution behavior"
  - "Read the essential fields in a Nais workload manifest"
  - "Design probes, resources, replicas and shutdown correctly"
  - "Trace an authorized deployment from commit to cluster"
next: { url: "/cloud-platforms/nais/03-identity-and-networking/", label: "Next: identity and networking" }
---

## Application or Naisjob?

A Nais **Application** runs one or more instances of a container image as a long-lived service. It fits APIs, web applications, continuous consumers and workers. A **Naisjob** represents finite work that should complete, either on demand or on a schedule.

Use execution behavior, not implementation language, to choose:

| Question | Application | Naisjob |
| --- | --- | --- |
| Should it remain available? | Yes | No |
| Does success mean the process keeps serving? | Usually | No, success is completion |
| Typical trigger | Traffic or continuously available work | Manual, scheduled or explicit run |
| Failure model | Restart and restore healthy replicas | Retry/fail the execution according to job policy |

Do not simulate a scheduled job with an API endpoint on a permanent service unless the request/response semantics are genuinely needed.

## The manifest expresses intent

A minimal Application manifest might look like this:

```yaml
apiVersion: nais.io/v1alpha1
kind: Application
metadata:
  name: order-api
  namespace: my-team
spec:
  image: europe-north1-docker.pkg.dev/project/apps/order-api:1.4.0
  ingresses:
    - https://order-api.example.no
  replicas:
    min: 2
    max: 6
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      memory: 512Mi
  startup:
    path: /internal/health/startup
  readiness:
    path: /internal/health/ready
  liveness:
    path: /internal/health/live
```

The [Application specification](https://docs.nais.io/workloads/application/reference/application-spec/) is the authoritative contract. It also covers service protocol/port, autoscaling strategies, environment variables, ingress, access policy, identity integrations and selected resource access. Support can vary by environment; validate against the environment reference instead of copying a manifest blindly.

The manifest is not a generated deployment file to ignore. It is production architecture in source control and deserves review for exposure, permissions, resources, scaling, identity and dependencies.

## Design the container for orchestration

### Image and process

Use a minimal maintained base image, run as a non-root user, pin dependencies and produce an immutable version. Store configuration outside the image. The main process should remain in the foreground and exit on unrecoverable failure so Kubernetes can restart it.

### Resource requests and limits

Requests influence Kubernetes scheduling and resource reservation. Set them from observed normal use, then revisit after load testing and production measurement. Excess requests waste shared capacity; insufficient requests increase contention risk. A memory limit can bound a leak, but if set below normal peaks it causes OOM termination.

### Probes have different meanings

- **startup** gives a slow-starting application time before other probes decide it is unhealthy;
- **readiness** answers whether this instance should receive traffic now;
- **liveness** answers whether the process is stuck and should be restarted.

A liveness probe that depends on every remote dependency can turn one dependency outage into a restart storm. Readiness may include critical serving dependencies, but liveness should normally be narrower.

### Replicas, scaling and state

Two or more replicas reduce avoidable downtime during rescheduling and rolling deployment. Horizontal replicas require durable state outside the container and coordination for singleton work. If only one instance should perform a task, use a job, distributed coordination or the platform's leader-election capability rather than relying on luck.

Autoscaling can respond to CPU and supported workload signals. A maximum should protect downstream capacity. Six replicas each opening 30 database connections require space for 180 connections plus operational headroom.

### Graceful termination

Kubernetes may terminate a pod during a rollout, node maintenance or scaling. The application must handle `SIGTERM`, stop accepting new work, finish or safely abandon in-flight operations, close connections and exit within the grace period. Read the official [good practices](https://docs.nais.io/workloads/explanations/good-practices/).

## From repository to runtime

The common delivery chain is:

1. Register an authorized GitHub repository for the Nais team.
2. Build and test the application.
3. Build, sign and push the container image through supported actions.
4. Deploy the manifest and exact workload image with the Nais deploy action.
5. The deployment service validates authorization and desired state.
6. Operators reconcile the Application, Kubernetes resources and integrations.
7. The team observes rollout health and production signals.

Repository authorization limits which source can deploy for the team. The pipeline identity is not the application runtime identity. Keep those duties separate and avoid long-lived credentials.

A deployment being accepted is not the same as a healthy product release. Progressive rollout, compatibility with previous schema and API versions, startup behavior, smoke tests and rollback/roll-forward still belong to delivery design. Follow the official [build and deploy guide](https://docs.nais.io/build/how-to/build-and-deploy/).

## Troubleshooting order

When deployment fails, move from declared state to runtime evidence:

1. inspect the deploy-action result and validation error;
2. inspect the Application status;
3. list and describe pods to find scheduling, image or probe failures;
4. read application and sidecar logs;
5. check events, resource pressure and dependent-service availability;
6. compare the deployed image and manifest with the intended commit.

Nais Console handles most management tasks; `kubectl` remains useful for advanced diagnosis. Do not “repair” an operator-managed resource manually and expect the change to persist.

## Architecture checkpoint

An API has one replica, stores uploaded files in `/tmp`, has a liveness probe that queries three downstream APIs and opens 40 database connections per instance. Explain the failure modes before increasing `max` replicas from 2 to 20.

The design risks downtime during restart, file loss, cascading restart storms and 800 possible database connections. Fix state, probe semantics, replica availability, connection pools and downstream capacity before treating autoscaling as the solution.

## Official study links

- [Hello Nais tutorial](https://docs.nais.io/tutorials/hello-nais/)
- [Application example](https://docs.nais.io/workloads/application/reference/application-example/)
- [Application specification](https://docs.nais.io/workloads/application/reference/application-spec/)
- [Naisjob](https://docs.nais.io/workloads/job/)
- [Build and deploy](https://docs.nais.io/build/how-to/build-and-deploy/)

### Google Cloud bridge

Nais Applications ultimately become Kubernetes workloads on GKE. The [Google Cloud compute module]({{< relref "/cloud-platforms/google-cloud/04-compute-and-containers.en.md" >}}) explains the reconciliation, container and failure concepts that remain relevant under the concise manifest.

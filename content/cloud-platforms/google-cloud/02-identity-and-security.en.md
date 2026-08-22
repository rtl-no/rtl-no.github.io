---
title: "Identity, IAM and security controls"
translationKey: gcp-identity-security
module: "02"
weight: 20
track: "Security"
duration: "30 min"
level: "Foundation"
summary: "Separate authentication from authorization, understand principals, roles and policies, and give workloads short-lived identities without downloaded keys."
topics: ["IAM policies", "Service accounts", "Workload identity"]
last_reviewed: "22 August 2026"
outcomes:
  - "Read an IAM decision as principal + role + resource"
  - "Distinguish user, group, service account and federated identities"
  - "Avoid long-lived service-account keys in normal designs"
  - "Place preventive, detective and data-perimeter controls correctly"
next: { url: "/cloud-platforms/google-cloud/03-networking-and-connectivity/", label: "Next: networking and connectivity" }
---

## Authentication and authorization are different questions

**Authentication** establishes who or what a caller is. **Authorization** determines which actions that principal may perform on which resources. Google Cloud IAM is primarily the authorization system; Cloud Identity, Google Workspace or an external identity provider can supply workforce identities.

An IAM allow-policy binding connects three things:

```text
principal  +  role (permissions)  +  resource scope
```

For example, a group may receive `roles/viewer` on one project, while a Cloud Run service account receives a narrow database-client role on a specific resource. The policy should be explained in terms of a job or workload need, not convenience.

## Principals and roles

Common principal types include:

- users for individual people;
- groups for manageable workforce access;
- service accounts for workloads and automation;
- Google groups, domains or workforce pools for sets of identities;
- federated workload identities from systems such as GitHub or another cloud.

Prefer groups over direct user grants. A person's access can then follow an auditable joiner/mover/leaver process. Use temporary elevation for privileged operations rather than permanent owner-like access.

A **permission** is one allowed API operation. A **role** is a named collection of permissions. Basic roles such as Owner, Editor and Viewer are broad; predefined service roles are usually a better starting point. Custom roles are useful when predefined roles are still too broad, but they create a maintenance obligation as APIs evolve.

The effective allow access is the union of applicable bindings on the resource and its ancestors. Conditions can make a binding context-dependent. Deny policies can prohibit selected permissions even where an allow binding exists. Always inspect the effective policy, not merely the binding closest to the resource.

Study the [IAM overview](https://docs.cloud.google.com/iam/docs/overview) and [policy inheritance](https://docs.cloud.google.com/iam/docs/resource-hierarchy-access-control).

## Service accounts have a dual nature

A service account is both:

1. a **principal** that can receive roles and call APIs; and
2. a **resource** that another principal might be permitted to use or impersonate.

This distinction exposes a common escalation path. A user may not directly access a storage bucket, but if that user can impersonate an over-privileged service account, the effective path still reaches the bucket.

Use a dedicated service account for each workload or trust boundary. Give it only required permissions, and control who may attach or impersonate it. Avoid using a default service account simply because it already exists.

### Prefer credentials that rotate themselves

Downloaded service-account keys are long-lived bearer credentials. They can leak through source control, logs, build artifacts or developer machines, and the platform cannot know every copied location. Google recommends avoiding keys where a safer mechanism exists.

Preferred patterns are:

- attach a service account to Compute Engine or Cloud Run and use Application Default Credentials;
- use Workload Identity Federation for GKE so Kubernetes workloads receive short-lived access;
- use Workload Identity Federation for external workloads and deployment systems such as GitHub Actions;
- let developers use their own login and, when necessary, controlled service-account impersonation.

Client libraries obtain and refresh tokens through the environment. Application code should not load a JSON private key in the normal case. Read Google's [service-account security practices](https://docs.cloud.google.com/iam/docs/best-practices-service-accounts) and [workload identity overview](https://docs.cloud.google.com/iam/docs/workload-identities).

## The controls around IAM

IAM answers “may this principal perform this API action here?” A complete security architecture needs more:

| Control | Purpose |
| --- | --- |
| Organization Policy Service | Constrain how resources may be configured, such as permitted locations or external IP use |
| Secret Manager | Store, version, audit and rotate application secrets that cannot be replaced by identity |
| Cloud KMS | Manage encryption keys and key-use policy when customer-managed keys are required |
| VPC Service Controls | Reduce data-exfiltration paths around supported managed services |
| Cloud Audit Logs | Record administrative activity, data access where enabled, system events and policy-denied events |
| Security Command Center | Aggregate security posture, findings and threat signals |

Encryption at rest and in transit is a baseline, not the whole data-security model. Classification, minimization, access, retention, deletion, key needs, logging and incident response still require design.

## A practical access review

For every sensitive path, write down:

1. the original actor—person, workload or external system;
2. every impersonation or token-exchange step;
3. the target resource and exact operation;
4. the allow binding and its inheritance point;
5. applicable conditions, deny policies or organization constraints;
6. the audit trail that will show the action.

If you cannot reconstruct this chain, the design is not yet reviewable.

## Architecture checkpoint

A GitHub Actions workflow deploys a Cloud Run service which reads one bucket and publishes to one Pub/Sub topic. Design the identity chain without a downloaded key.

A sound answer uses GitHub's OIDC identity with Workload Identity Federation, restricts the provider to the trusted repository and branch or environment, lets the pipeline impersonate a deployment-specific service account, and gives the runtime a different service account with only object-read and topic-publish access. Deployment identity and runtime identity are separate because they perform different jobs.

## Official study links

- [IAM overview](https://docs.cloud.google.com/iam/docs/overview)
- [Service account best practices](https://docs.cloud.google.com/iam/docs/best-practices-service-accounts)
- [Workload Identity Federation](https://docs.cloud.google.com/iam/docs/workload-identity-federation)
- [Organization Policy overview](https://docs.cloud.google.com/resource-manager/docs/organization-policy/overview)
- [Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit)

### Nais bridge

Nais gives each workload a Kubernetes identity and can connect that identity to cloud and token capabilities without an application-managed key. `accessPolicy` describes permitted service relationships, while ID-porten, TokenX, Maskinporten and Entra ID cover different user and system scenarios. These mechanisms do not remove domain authorization: the application still decides whether the authenticated actor may perform the business action.

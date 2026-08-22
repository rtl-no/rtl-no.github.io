---
title: "Resource model, locations and cost"
translationKey: gcp-foundations
module: "01"
weight: 10
track: "Foundations"
duration: "25 min"
level: "Foundation"
summary: "Learn how organizations, folders, projects, resources, APIs, regions, zones and billing fit together before deploying anything."
topics: ["Resource hierarchy", "Regions and zones", "Billing and quotas"]
last_reviewed: "22 August 2026"
outcomes:
  - "Explain the organization → folder → project → resource hierarchy"
  - "Choose an appropriate regional, zonal or global resource"
  - "Separate trust, lifecycle and billing concerns with projects"
  - "Recognize budgets, quotas and labels as different controls"
next: { url: "/cloud-platforms/google-cloud/02-identity-and-security/", label: "Next: identity and security" }
---

## The resource hierarchy is the control structure

Most Google Cloud resources belong to a **project**. Projects can sit directly below an **organization** or be grouped into **folders**, which can themselves be nested. Service resources—such as a Cloud Run service, a GKE cluster or a storage bucket—live below a project.

```text
Organization
├── Folder: shared-platform
│   ├── Project: network-host-prod
│   └── Project: security-logging
└── Folder: product-area
    ├── Project: orders-dev
    └── Project: orders-prod
```

The hierarchy does three jobs at once:

1. **Ownership and lifecycle:** resources belong to an organization and project rather than to the person who created them.
2. **Policy inheritance:** IAM allow policies and organization policies can be attached high in the tree and affect descendants.
3. **Boundaries:** projects provide practical boundaries for access, enabled APIs, quotas, billing analysis and resource lifecycle.

An IAM allow policy inherited from a parent is additive: a grant at organization or folder level remains effective below it. A narrower child policy does not simply cancel that grant. Deny policies, principal access boundary policies and organization policy constraints solve different control problems, so do not treat “IAM policy” as one universal mechanism.

Read the official [resource hierarchy](https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy) and [hierarchy-based access control](https://docs.cloud.google.com/iam/docs/resource-hierarchy-access-control) guides.

## Design projects around boundaries

A project should contain resources that share a sensible trust and lifecycle boundary. Separating production from development is common because the environments should not share broad operator access, quotas or accidental deletion risk. Separate shared networking and central logging projects can be useful when a platform team owns those capabilities.

Avoid both extremes:

- one enormous project makes permissions, quota, blast radius and cost attribution hard to reason about;
- a project for every small resource creates administrative overhead and cross-project IAM complexity.

A good question is: **which resources should be granted, changed, billed and retired together?** The answer often points to an appropriate project boundary.

Project IDs are globally unique and effectively permanent after creation. Project names are human-readable and mutable; project numbers are generated numeric identifiers used by several APIs and IAM principal formats. Know which one a command or policy expects.

## Services and APIs must be enabled

Google Cloud capabilities are exposed through service APIs. Enabling the Cloud Run API, for example, makes that service available to a project; IAM still decides who may create or invoke resources. Service enablement is therefore not an access grant.

The common interfaces are:

- the Google Cloud console for discovery and visual administration;
- the `gcloud` CLI for repeatable commands;
- Cloud Shell for a managed command environment;
- REST APIs and client libraries for applications;
- Infrastructure as Code such as Terraform for reviewed, reproducible environments.

Prefer automation for durable environments, but learn how the resulting resource appears in the console. Automation without operational visibility is not enough.

## Global, regional and zonal resources

A **region** is an independent geographic area. A **zone** is a deployment area inside a region and is a single failure domain. Google Cloud also has multi-regional and global services. The exact location model belongs to each product; never infer it from the marketing category alone.

Location affects:

- latency to users and dependencies;
- resilience against zonal or regional failure;
- data residency and regulatory commitments;
- which services and machine types are available;
- network data transfer and replicated-storage cost;
- disaster-recovery design.

For a high-availability regional service, distribute zonal resources across at least two zones and ensure every dependency supports the intended failure model. Merely placing two application instances in different zones does not help if they depend on one zonal database.

`europe-north1` is Google Cloud's Finland region. A Norwegian workload may use it, but “near Norway” is not the same as “data is stored in Norway.” Architects must verify the location, replication and processor terms for each service and data class. Use the current [locations documentation](https://cloud.google.com/about/locations) as the source of truth.

## Billing, budgets and quotas

A **Cloud Billing account** pays for linked projects. Access to billing and access to resources are separate concerns. A FinOps-friendly setup makes product ownership visible through project structure, labels or tags, billing exports and agreed allocation rules.

Keep four controls distinct:

| Control | What it does | What it does not do |
| --- | --- | --- |
| Budget | Tracks forecast or actual spend and sends alerts | Automatically cap all usage by default |
| Quota | Limits consumption of a service or resource | Express a financial target |
| Label | Adds key/value metadata used for filtering and cost analysis | Enforce a hierarchy-wide security rule |
| Tag | Attaches governed key/value metadata that policies can reference | Replace a naming and ownership model |

Export detailed billing data to BigQuery when you need allocation and trend analysis beyond the console. Alerts need an owner and an action: a budget email nobody handles is only a report.

## Architecture checkpoint

You are designing an organization with three product teams, separate development and production environments, and a central network team. Sketch a hierarchy that supports inherited baseline policies, central network ownership and team autonomy. Then answer:

1. Which access is inherited from the organization or folder?
2. Which resources share a project, and why?
3. Which failures does the selected region/zone design tolerate?
4. Who receives budget and quota alerts, and what do they do?

The goal is not one perfect tree. It is a hierarchy whose ownership, trust and lifecycle boundaries can be explained.

## Official study links

- [Google Cloud overview](https://docs.cloud.google.com/docs/overview)
- [Resource hierarchy](https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy)
- [Geography and regions](https://cloud.google.com/about/locations)
- [Cloud Billing documentation](https://docs.cloud.google.com/billing/docs)
- [Quotas overview](https://docs.cloud.google.com/docs/quotas/overview)

### Nais bridge

Nais product teams normally work with **teams, tenants, clusters and namespaces** instead of designing the Google Cloud organization and projects themselves. Those cloud boundaries still exist underneath. The platform team owns much of their structure and policy; the application team must still understand environment separation, data location, cost ownership and the lifecycle of resources it requests.

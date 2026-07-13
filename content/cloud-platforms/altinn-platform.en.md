---
title: "The Altinn platform"
summary: "An architectural guide to Altinn Studio, Altinn Apps and the shared platform services on which Norwegian public digital services are built."
description: "What Altinn 3 is, how the platform is built, and how applications, identity, authorization, data, events and operations fit together."
translationKey: altinn-platform
category: "Cloud platforms · Norwegian digital infrastructure"
toc: true
last_reviewed: "13 July 2026"
---

Altinn is not a single application or merely a place to fill in forms. [Altinn 3](https://docs.altinn.studio/en/community/about/) is the third generation of a platform for developing and running public digital services. It is owned by the Norwegian Digitalisation Agency, developed as open source, and combines a development environment, a runtime for service-owner applications and shared national capabilities.

Its most important architectural distinction is between **what belongs to a specific service** and **what should be solved once and reused across services**. An agency can own its data model, workflow, user experience and domain logic while the platform supplies identity, authorization, storage, events and notifications.

## Three parts that should not be confused

| Part | Role | What developers encounter |
| --- | --- | --- |
| **Altinn Studio** | Development and configuration environment | Data models, screens, text, process, access rules, source code, builds and deployment |
| **Altinn Apps** | Runtime for service-owner applications | Containerized apps in isolated environments, Kubernetes, ingress, scaling and platform API integration |
| **Altinn Platform** | Shared services and APIs | Authentication, authorization, storage, register and profile data, events, notifications, PDF and receipts |

The [Altinn architecture documentation](https://docs.altinn.studio/en/technology/architecture/components/) also distinguishes application, data, platform and infrastructure components. In everyday language, “the Altinn platform” may refer to the whole ecosystem, while **Altinn Platform** is the more precise name for the shared runtime components.

## From service model to running application

An Altinn app is an independent digital service. Its repository normally brings together data models, UI layouts, text, process configuration, authorization policy, deployment configuration and any custom code.

The typical path is:

1. The service owner models the data, user journey, process and access rules.
2. The app is developed in Altinn Studio and/or ordinary code tools, with Git providing version history.
3. The build combines the app content with the Altinn application runtime and produces a container image.
4. The image is stored in a private container registry and published with Helm to the service owner's Kubernetes environment.
5. The running app uses Altinn Platform for shared capabilities and stores data through platform APIs.

According to the [build and deployment documentation](https://docs.altinn.studio/en/technology/architecture/capabilities/runtime/appdeploy/), each app runs in containers orchestrated by Kubernetes, and organizations have separate app environments. [Deployment configuration](https://docs.altinn.studio/en/altinn-studio/v8/reference/configuration/deployment/) is based on a central Helm chart with app-specific overrides and autoscaling support.

The result is an important property: a service can be developed and versioned independently while following platform contracts for data, security and operations.

## Core platform services

The official [Altinn Platform overview](https://docs.altinn.studio/en/technology/solutions/altinn-platform/) lists components that provide central functionality to Altinn Apps and external consumers.

### Authentication

Altinn is not itself the identity provider. The platform establishes sessions and tokens based on external providers such as ID-porten, Maskinporten and Feide. The [authentication component](https://docs.altinn.studio/en/authorization/getting-started/authentication/) can exchange external tokens for Altinn tokens and give apps a consistent identity foundation.

It is useful to separate:

- **the person or system being authenticated**;
- **the app or component making a call**;
- **the party represented by that person or system**, such as a business.

### Authorization and delegation

Altinn authorization is attribute-based and uses XACML 3.0. A decision may depend on subject, resource, action, party, role, delegation and context. The [reference architecture](https://docs.altinn.studio/en/authorization/reference/architecture/) follows the classic XACML roles:

- The **PAP** administers policies. Altinn Studio, Access Management and the Resource Registry are important sources.
- The **PDP** evaluates a request against policy and available attributes.
- The **PIP/context handler** obtains and enriches the decision context.
- The **PEP** enforces the decision by allowing or denying the operation.

This goes beyond simple role-based access. Altinn must handle people and systems acting on behalf of others, with rights delegated among citizens, organizations, employees, suppliers and system users. The service owner still owns the meaning of the policy: an incorrect rule may expose protected data to the wrong person.

### Storage and instances

A service instance represents a concrete execution of an app for a particular party. It connects metadata, process history and one or more data elements such as form data or attachments.

The [storage architecture](https://docs.altinn.studio/en/technology/architecture/components/infrastructure/storage/) uses different technologies for different jobs. App and instance metadata is stored in Cosmos DB, binary and form data in Azure Blob Storage, while PostgreSQL is used by components including Events and Repository. Data and metadata are exposed through platform APIs, so the app does not connect directly to the underlying storage technology.

### Events and notifications

Altinn Events lets apps and other producers publish events to which consumers can subscribe. It connects a service to line-of-business systems without forcing every process into synchronous point-to-point calls. Notifications handles messages to people, including email and SMS.

A sound design treats these as separate capabilities:

- An **event** tells another system that something happened.
- A **notification** attempts to make a person aware of something.
- The authoritative **state and truth** remain in the service data.

### Register, profile, PDF and receipts

Register and profile services give components a shared basis for information about people, organizations and parties. The PDF component can produce a printable representation of submitted data, while the receipt component presents the outcome of a submission. These are supporting capabilities; they do not replace the service owner's domain model or archiving decisions.

## Cloud and operational architecture

Altinn 3 runs in public cloud. The [infrastructure documentation](https://docs.altinn.studio/en/technology/architecture/capabilities/devops/platformoperations/infrastructuremgmt/) describes Azure, Kubernetes, Terraform, container registries, Key Vault, storage, networking and API management as core building blocks.

The architecture has several levels of isolation:

- service owners have separate Altinn Apps environments for test and production;
- apps are packaged and deployed independently;
- shared platform components run in separate platform environments;
- data, secrets and networks are configured as managed resources.

The platform team automates infrastructure and the shared runtime surface. The service owner remains responsible for the service purpose, data processing, access model, domain logic, testing and relevant availability and archiving requirements. A platform reduces operational friction; it does not move product ownership.

## When Altinn is a good platform choice

Altinn is particularly relevant when a public digital service needs several of these properties at the same time:

- interaction with citizens and businesses using established Norwegian identities;
- representation and delegation on behalf of another party;
- structured submissions, attachments and a controlled workflow;
- access rules that understand Norwegian roles, parties and system users;
- events, notifications and integration with the service owner's line-of-business systems;
- an independently versioned app that can be deployed and scaled inside a managed runtime.

Altinn is not automatically the right home for every API or internal microservice. If the primary requirement is a general container runtime and the service does not use Altinn's domain and collaboration capabilities, a general application platform such as [Nais]({{< relref "nais.en.md" >}}) or a direct cloud service may be a more natural level.

## Questions an architect should ask

1. Who is the user, which party does the user represent, and which identity is authoritative?
2. Which actions exist on which resources, and how can those rights be delegated?
3. What is the authoritative service data, and what is merely a presentation, event or receipt?
4. Which operations must be synchronous, and which should be connected through Events?
5. Which responsibilities belong to the Digitalisation Agency, the service owner and any line-of-business teams?
6. How are policy, process, migration, scale, failure modes and recovery tested before production?

## Official starting points

- [Altinn documentation](https://docs.altinn.studio/)
- [Altinn Platform component overview](https://docs.altinn.studio/en/technology/solutions/altinn-platform/)
- [Technical architecture](https://docs.altinn.studio/en/technology/architecture/components/)
- [Altinn Authorization](https://docs.altinn.studio/en/authorization/)
- [Altinn on GitHub](https://github.com/Altinn)

*Last reviewed 13 July 2026. The platform evolves continuously; official documentation is authoritative for current APIs and configuration.*

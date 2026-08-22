---
title: "Google Cloud"
headline: "Understand the cloud beneath the platform."
description: "A practical learning path through Google Cloud's resource model, identity, networking, compute, data and operations—with a direct bridge to Nais."
translationKey: google-cloud
type: cloud-learning
platform: "Google Cloud"
platform_key: gcp
level: "Foundation → architecture"
last_reviewed: "22 August 2026"
path_note: "Follow the modules in order if Google Cloud is new to you. Experienced cloud architects can begin with workload selection and use the Nais bridge in every module."
layers: ["ORGANIZATION · FOLDERS · PROJECTS", "IAM · SERVICE ACCOUNTS · POLICY", "VPC · REGIONS · ZONES", "RUN · GKE · COMPUTE ENGINE", "DATA · EVENTS · OPERATIONS"]
bridge:
  label: "The platform layer"
  title: "Continue from Google Cloud into Nais"
  text: "Nais runs application workloads on GKE and exposes selected Google Cloud services through safer self-service contracts. The Nais path shows which details remain visible and which are owned by the platform team."
  url: "/cloud-platforms/nais/"
  cta: "Start the Nais path"
cascade:
  type: cloud-learning
  platform: "Google Cloud"
  platform_key: gcp
---

Google Cloud is easier to learn when it is treated as a system of **resources, identities, networks, locations and managed capabilities**, not as a catalogue of hundreds of product names. This path starts with that system and moves towards the decisions an application architect or platform user actually makes.

The path is deliberately connected to [Nais]({{< relref "/cloud-platforms/nais/_index.en.md" >}}). Nais removes much of the day-to-day Kubernetes and cloud configuration from product teams, but concepts such as projects, IAM, service accounts, regions, GKE, Cloud SQL, Cloud Storage and BigQuery still explain what happens under the abstraction.

Use [Google Cloud directly or through Nais?]({{< relref "/cloud-platforms/nais/00-google-cloud-direct-or-nais.en.md" >}}) when you need the operational comparison: what Nais buys you, which flexibility changes, who provides support and what happens when PostgreSQL becomes unavailable.

Examples are conceptual and safe to study without a cloud account. When you practise in a real project, configure a budget first, use a sandbox project, prefer short-lived credentials and remove chargeable resources when the exercise is complete.

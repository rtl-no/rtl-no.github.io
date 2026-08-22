---
title: "The Nais platform"
headline: "Learn the platform contract—and the cloud beneath it."
description: "A practical path from the Google Cloud-versus-Nais decision through teams, workloads, identity, data, observability and production responsibility."
translationKey: nais-platform
type: cloud-learning
platform: "Nais"
platform_key: nais
level: "Foundation → production"
last_reviewed: "22 August 2026"
path_note: "Start with the direct comparison, then follow the life of a service: understand the platform, deploy a workload, connect it safely, add data and telemetry, and prepare it for production."
layers: ["PRODUCT TEAM · REPOSITORY", "NAIS MANIFEST · CONSOLE · API", "NAISERATORS · PLATFORM SERVICES", "KUBERNETES · GKE", "GOOGLE CLOUD · AIVEN"]
bridge:
  label: "See below the abstraction"
  title: "Revisit the Google Cloud foundation"
  text: "Nais deliberately hides much of Google Cloud and Kubernetes, but projects, IAM, workload identity, VPC, GKE and managed data services still shape security, location, resilience and cost."
  url: "/cloud-platforms/google-cloud/"
  cta: "Open Google Cloud"
cascade:
  type: cloud-learning
  platform: "Nais"
  platform_key: nais
---

[Nais](https://docs.nais.io/explanations/nais/) is an application platform built around autonomous teams that develop, deploy and operate their own products. It supplies a secure runtime and self-service building blocks so each team does not have to assemble a Kubernetes and cloud platform from scratch. The name originally meant *NAVs Application Infrastructure Services*; the Nais community is working towards letting the N mean *Norwegian*.

Nais is not a separate cloud provider. Each cloud environment is a Kubernetes cluster on Google Kubernetes Engine, while selected capabilities come from Google Cloud, Aiven and platform-operated components. The developer-facing contract is intentionally higher-level: teams primarily use Nais manifests, Nais Console, GitHub Actions and platform APIs.

That abstraction changes **who handles complexity**, not whether production responsibility exists. This learning path focuses on both sides of the contract: what the platform automates and what the product team must still understand, decide and operate.

If you are deciding between the two operating models, begin with [Google Cloud directly or through Nais?]({{< relref "/cloud-platforms/nais/00-google-cloud-direct-or-nais.en.md" >}}). It compares benefits, limits, support responsibilities and PostgreSQL outages before the technical modules begin.

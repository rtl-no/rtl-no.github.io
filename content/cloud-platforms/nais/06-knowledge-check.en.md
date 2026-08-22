---
title: "Nais production knowledge check"
translationKey: nais-knowledge-check
module: "06"
weight: 60
track: "Assessment"
duration: "20 min"
level: "Foundation → intermediate"
summary: "Fifteen scenarios on the Nais platform model, workloads, delivery, identity, access, data, observability and production ownership."
topics: ["15 scenarios", "Explanations", "Official Nais sources"]
questions_label: "questions"
answered_label: "answered"
submit_label: "Check answers"
reset_label: "Try again"
result_label: "Result"
correct_label: "Correct"
wrong_label: "Review this"
unanswered_label: "Not answered"
pass_percent: 73
pass_message: "Strong platform understanding. Review the rationales before applying the result to production work."
review_message: "Use the domain breakdown to choose a module to revisit, then try again."
result_note: "This independent learning check is not official Nais training, certification or production approval. Current tenant and environment documentation remains authoritative."
questions:
  - domain: "Platform model"
    question: "Which statement best describes Nais?"
    options: ["A separate public-cloud provider", "An application platform over Kubernetes and managed services with self-service developer contracts", "A replacement for product-team ownership", "Only a web interface for raw virtual machines"]
    correct: 1
    explanation: "Nais provides runtime and integrated building blocks through higher-level contracts. Cloud environments use Kubernetes on GKE and managed services underneath."
    reference: "https://docs.nais.io/explanations/nais/"
    reference_label: "What is Nais?"
  - domain: "Platform model"
    question: "A product team assumes Nais owns whether its case-processing logic is correct in production. What is wrong?"
    options: ["Nothing; platform ownership includes all business logic", "The platform owns shared capabilities, while the product team owns code, domain behavior and user outcomes", "Only Google owns correctness", "GitHub owns production after deployment"]
    correct: 1
    explanation: "Platform engineering centralizes common complexity without transferring product and domain responsibility from the team."
    reference: "https://docs.nais.io/explanations/nais/"
    reference_label: "Nais platform idea"
  - domain: "Workloads"
    question: "A finite report task should run nightly and exit. Which Nais workload model is the natural fit?"
    options: ["A Naisjob with a schedule", "A permanent public ingress", "A second team namespace", "A liveness probe"]
    correct: 0
    explanation: "Naisjob represents finite work and supports scheduled execution; Application represents a long-running workload."
    reference: "https://docs.nais.io/workloads/job/"
    reference_label: "Naisjob"
  - domain: "Workloads"
    question: "Which probe should answer whether an instance should receive traffic right now?"
    options: ["Readiness", "Liveness", "Image signature", "Budget alert"]
    correct: 0
    explanation: "Readiness controls whether the instance is an eligible traffic endpoint. Liveness asks whether it should be restarted."
    reference: "https://docs.nais.io/workloads/explanations/good-practices/"
    reference_label: "Good workload practices"
  - domain: "Workloads"
    question: "Six replicas can each open 30 database connections. What must be considered before setting max replicas to 20?"
    options: ["Only the colour of the dashboard", "The resulting connection pool demand and downstream capacity", "Whether the repository is public", "The number of team members"]
    correct: 1
    explanation: "Autoscaling multiplies downstream use. Connection pools, rolling-deployment overlap and database capacity must be planned together."
    reference: "https://docs.nais.io/workloads/application/reference/automatic-scaling"
    reference_label: "Automatic scaling"
  - domain: "Delivery"
    question: "Why must a GitHub repository be authorized for a Nais team?"
    options: ["To let any fork deploy", "To constrain which source repository may deploy on behalf of the team", "To make all images public", "To replace code review"]
    correct: 1
    explanation: "Repository authorization is part of the trusted deployment path and limits which GitHub source can deploy for the team."
    reference: "https://docs.nais.io/build/how-to/build-and-deploy/"
    reference_label: "Build and deploy"
  - domain: "Identity"
    question: "An internal API must act on behalf of a citizen already authenticated with ID-porten. Which mechanism is designed for the delegated internal chain?"
    options: ["TokenX", "Cloud NAT", "Prometheus", "A public bucket"]
    correct: 0
    explanation: "TokenX supports internal applications acting on behalf of citizens authenticated through ID-porten."
    reference: "https://docs.nais.io/auth/"
    reference_label: "Nais authentication overview"
  - domain: "Identity"
    question: "A Nais workload accesses a cloud resource with its workload identity. What does that prove about the end user?"
    options: ["The end user is automatically authorized for every object", "Nothing by itself; workload and end-user identity are distinct", "The user is a cluster administrator", "The call came through Maskinporten"]
    correct: 1
    explanation: "Workload identity represents the running application. User/delegated context and domain authorization must be handled separately."
    reference: "https://docs.nais.io/auth/workload-identity/"
    reference_label: "Workload Identity"
  - domain: "Networking"
    question: "Two applications in the same Nais environment need to communicate privately. What is the preferred starting path?"
    options: ["Service discovery plus explicit access policies", "A public ingress for both", "Shared administrator credentials", "Writing requests to local disk"]
    correct: 0
    explanation: "Service discovery avoids external exposure and unnecessary hops; access policies declare the permitted service edge."
    reference: "https://docs.nais.io/workloads/application/explanations/expose/"
    reference_label: "Exposing your application"
  - domain: "Networking"
    question: "An accessPolicy allows frontend A to reach API B. What is still required?"
    options: ["Nothing; network access authorizes every business action", "Token validation where applicable and domain authorization in API B", "Make API B public", "Disable audit logging"]
    correct: 1
    explanation: "Connectivity, token authorization and domain authorization are separate controls. An allowed network edge is not blanket business permission."
    reference: "https://docs.nais.io/workloads/reference/access-policies/"
    reference_label: "Access policy"
  - domain: "Data"
    question: "A Cloud Storage capability is highly available. What should the team conclude about accidental deletion?"
    options: ["Deletion is always recoverable automatically", "Availability is not the same as a separate backup; lifecycle and recovery must be verified", "The platform owns all data decisions", "Retention is unnecessary"]
    correct: 1
    explanation: "Nais distinguishes durability/availability from backup protection against mistaken deletion. The team owns recovery requirements and configuration."
    reference: "https://docs.nais.io/persistence/"
    reference_label: "Persistent data overview"
  - domain: "Data"
    question: "What is the safest general assumption about Kafka in a product architecture?"
    options: ["It should accidentally become the only master of all data", "Teams should understand replay and retain a recoverable authoritative source unless event sourcing is deliberate", "Consumers never see duplicates", "Schemas never change"]
    correct: 1
    explanation: "Kafka is durable, but Nais recommends being able to restore data from another system. Replay, schemas and duplicate handling need design."
    reference: "https://docs.nais.io/persistence/kafka/"
    reference_label: "Nais Kafka"
  - domain: "Observability"
    question: "Where should a unique case number normally be placed for request investigation?"
    options: ["As an unbounded Prometheus label on every metric", "As safe correlation context in structured logs and traces", "Inside a container image tag", "In the liveness endpoint path"]
    correct: 1
    explanation: "High-cardinality identifiers harm metric systems. Use bounded labels for aggregation and safe request-specific context in logs or traces."
    reference: "https://docs.nais.io/observability/"
    reference_label: "Nais observability"
  - domain: "Operations"
    question: "A pod is healthy, but no cases complete because a downstream queue is stalled. Which lesson is most important?"
    options: ["Pod health is sufficient", "Production signals must include user or business outcomes and dependencies", "Remove all alerts", "Run only one replica"]
    correct: 1
    explanation: "Infrastructure health does not prove product correctness. SLOs and business signals must represent the service outcome."
    reference: "https://docs.nais.io/observability/"
    reference_label: "Observability"
  - domain: "Operations"
    question: "Which statement is evidence of production readiness?"
    options: ["The manifest passed validation once", "The team has measured limits, SLOs, owned alerts/runbooks, compatible rollout and tested recovery", "Nais has a Console", "The application writes some logs"]
    correct: 1
    explanation: "Production readiness combines workload design, security, data, observability, change, recovery and explicit ownership. Features alone are not evidence."
    reference: "https://docs.nais.io/workloads/explanations/good-practices/"
    reference_label: "Good workload practices"
---

Answer from the platform and responsibility model, not from memorized YAML. Every submitted answer includes a short rationale and an official Nais reference.

---
title: "Google Cloud architecture check"
translationKey: gcp-knowledge-check
module: "06"
weight: 60
track: "Assessment"
duration: "20 min"
level: "Foundation → intermediate"
summary: "Fifteen scenario-based questions across resource design, IAM, networking, runtime selection, data and operations."
topics: ["15 scenarios", "Explanations", "Official references"]
questions_label: "questions"
answered_label: "answered"
submit_label: "Check answers"
reset_label: "Try again"
result_label: "Result"
correct_label: "Correct"
wrong_label: "Review this"
unanswered_label: "Not answered"
pass_percent: 73
pass_message: "Strong foundation. Review every explanation, especially where the correct answer was uncertain."
review_message: "Use the domain breakdown to choose which module to revisit, then try again."
result_note: "This is an independent learning check, not an official Google Cloud certification exam or readiness guarantee."
questions:
  - domain: "Resource model"
    question: "Production and development must have separate access, quotas and lifecycle, while baseline policy is inherited by both. What is the strongest starting design?"
    options: ["One project with prod and dev labels", "Separate prod and dev projects beneath a shared folder", "One folder for every individual resource", "Separate user accounts with no organization"]
    correct: 1
    explanation: "Projects provide useful trust, quota and lifecycle boundaries. A shared parent folder can carry common IAM or organization policies."
    reference: "https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy"
    reference_label: "Google Cloud resource hierarchy"
  - domain: "Resource model"
    question: "A budget reaches 100%. What should you assume happens by default?"
    options: ["All project resources stop immediately", "Billing is disabled permanently", "Configured notifications or automation can run, but the budget is not a hard usage cap", "Project quotas double"]
    correct: 2
    explanation: "Budgets primarily provide monitoring and alerts. They do not automatically cap all spend unless you deliberately build automation, which has its own risks."
    reference: "https://docs.cloud.google.com/billing/docs/how-to/budgets"
    reference_label: "Cloud Billing budgets"
  - domain: "Identity"
    question: "A GitHub Actions workflow needs to deploy without storing a Google private key. Which mechanism is designed for this?"
    options: ["A public Cloud Storage object", "Workload Identity Federation using GitHub OIDC", "A shared human Owner account", "An API key committed as a secret"]
    correct: 1
    explanation: "Workload Identity Federation exchanges a trusted external identity for short-lived Google credentials and avoids a downloaded service-account key."
    reference: "https://docs.cloud.google.com/iam/docs/workload-identity-federation"
    reference_label: "Workload Identity Federation"
  - domain: "Identity"
    question: "A developer cannot read a bucket directly but can impersonate a service account that has Storage Object Viewer. What is the effective risk?"
    options: ["No risk because direct bucket IAM wins", "The developer can obtain the service account's effective access", "Impersonation works only for billing", "The bucket becomes public"]
    correct: 1
    explanation: "A service account is both a principal and a resource. Permission to impersonate it can create an indirect access path to everything the account may access."
    reference: "https://docs.cloud.google.com/iam/docs/best-practices-service-accounts"
    reference_label: "Service account best practices"
  - domain: "Networking"
    question: "Which statement correctly describes a Google Cloud VPC network?"
    options: ["The VPC is regional and each subnet is global", "Both VPC and subnet are zonal", "The VPC is global and its subnets are regional", "Every VM requires a different VPC"]
    correct: 2
    explanation: "VPC networks are global resources; their subnetworks are regional resources."
    reference: "https://docs.cloud.google.com/vpc/docs/vpc"
    reference_label: "VPC networks"
  - domain: "Networking"
    question: "A platform team must centrally own one network while product teams deploy resources in their own projects. What best fits?"
    options: ["Shared VPC with a host project and service projects", "Transitive VPC peering", "Public IPs on every workload", "One Cloud NAT per user"]
    correct: 0
    explanation: "Shared VPC separates network administration in a host project from workload ownership in attached service projects."
    reference: "https://docs.cloud.google.com/vpc/docs/shared-vpc"
    reference_label: "Shared VPC"
  - domain: "Compute"
    question: "A stateless HTTP API in a container needs request-based autoscaling and no Kubernetes API. What is the simplest strong starting point?"
    options: ["A manually patched Compute Engine VM", "Cloud Run service", "GKE Standard with custom node pools", "Cloud Storage only"]
    correct: 1
    explanation: "Cloud Run is a fully managed container application platform and fits stateless request-driven services without cluster management."
    reference: "https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run"
    reference_label: "Cloud Run overview"
  - domain: "Compute"
    question: "A script generates invoices once per night and exits successfully. Which execution model best represents it?"
    options: ["Cloud Run job triggered by a schedule", "An always-on web service with minimum 20 instances", "A public DNS zone", "A permanent administrator VM"]
    correct: 0
    explanation: "A job represents finite work that runs to completion and can be invoked on a schedule."
    reference: "https://docs.cloud.google.com/run/docs/create-jobs"
    reference_label: "Cloud Run jobs"
  - domain: "Compute"
    question: "What does a Kubernetes Deployment not guarantee by itself?"
    options: ["A desired replica count", "Reconciliation of pods", "That application state and shutdown behavior are correctly designed", "A pod template"]
    correct: 2
    explanation: "Kubernetes can reconcile workload resources, but the application must still externalize durable state, handle termination and expose meaningful health."
    reference: "https://docs.cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview"
    reference_label: "GKE overview"
  - domain: "Data"
    question: "A service needs ACID relational order transactions using PostgreSQL. Which is the most direct managed starting point?"
    options: ["Cloud SQL for PostgreSQL", "Cloud Storage", "Cloud CDN", "Cloud DNS"]
    correct: 0
    explanation: "Cloud SQL is the managed relational service for PostgreSQL, MySQL and SQL Server. Schema, connection and recovery design remain team responsibilities."
    reference: "https://docs.cloud.google.com/sql/docs/postgres/introduction"
    reference_label: "Cloud SQL for PostgreSQL"
  - domain: "Data"
    question: "A query scans a large BigQuery table daily but needs only one month and six columns. What design most directly controls scanned data?"
    options: ["Add more project Owners", "Partition appropriately and select only required columns", "Move the table to a VM filesystem", "Disable audit logs"]
    correct: 1
    explanation: "Partition pruning and avoiding SELECT * reduce unnecessary scanned data, improving performance and cost."
    reference: "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute"
    reference_label: "BigQuery query best practices"
  - domain: "Integration"
    question: "A Pub/Sub subscriber sometimes receives the same business event again. What is the safest application assumption?"
    options: ["Duplicates are impossible", "The consumer should be idempotent or deduplicate at the business boundary", "Delete the subscription after every message", "Turn the database off during retries"]
    correct: 1
    explanation: "Asynchronous delivery and retries mean consumers must account for duplicate processing and make side effects safe."
    reference: "https://docs.cloud.google.com/pubsub/docs/subscriber"
    reference_label: "Pub/Sub subscribers"
  - domain: "Operations"
    question: "Which alert is closest to user-centred SRE practice?"
    options: ["Alert whenever CPU exceeds 50% for one minute", "Alert on meaningful burn of the API's availability or latency error budget", "Alert for every log line", "Send all alerts to an unowned mailbox"]
    correct: 1
    explanation: "SLO and error-budget burn connect alerts to user-visible reliability and reduce noisy resource-only paging."
    reference: "https://docs.cloud.google.com/stackdriver/docs/solutions/slo-monitoring"
    reference_label: "SLO monitoring"
  - domain: "Reliability"
    question: "Application replicas run in two zones but depend on one zonal database. What is the main architecture issue?"
    options: ["The application is automatically multi-region", "The database remains a single zonal failure dependency", "Two zones eliminate the need for backups", "DNS can no longer resolve"]
    correct: 1
    explanation: "Availability is end-to-end. A zonal dependency can dominate the failure model even when the compute tier spans zones."
    reference: "https://docs.cloud.google.com/architecture/framework/reliability"
    reference_label: "Well-Architected reliability pillar"
  - domain: "Architecture"
    question: "Which review is most complete before production?"
    options: ["Confirm only that deployment succeeded", "Review operations, security, reliability, cost, performance and sustainability, including ownership and tests", "Choose the newest service in every category", "Use one administrator account for simplicity"]
    correct: 1
    explanation: "Google's Well-Architected Framework uses six pillars and encourages explicit trade-offs and operational readiness rather than a deployment-only view."
    reference: "https://docs.cloud.google.com/architecture/framework"
    reference_label: "Well-Architected Framework"
---

Answer from the architecture described, not from product-name recognition. After submitting, every question shows a rationale and an official source. A wrong answer is a pointer to the module worth revisiting.

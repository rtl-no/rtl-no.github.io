---
title: "Azure products"
headline: "The services I believe matter most to understand."
description: "A curated product catalogue for architecture and development, with concise explanations and links to official Microsoft documentation."
translationKey: azure-products
layout: products
last_reviewed: "13 July 2026"
categories:
  - title: "Identity and access"
    mark: "ID"
    description: "The control plane for users, applications, workloads and privileged access."
    products:
      - { name: "Microsoft Entra ID", text: "Identity for users, groups, applications, devices and access policies.", url: "https://learn.microsoft.com/en-us/entra/fundamentals/whatis" }
      - { name: "Azure RBAC", text: "Role-based authorization for Azure resources with inheritance through the scope hierarchy.", url: "https://learn.microsoft.com/en-us/azure/role-based-access-control/overview" }
      - { name: "Managed identities", text: "Identities for Azure resources that remove application secrets from code and configuration.", url: "https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview" }
      - { name: "Conditional Access", text: "The policy engine for signal-based access, MFA, device requirements and session controls.", url: "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview" }
      - { name: "Privileged Identity Management", text: "Time-bound, approval-controlled privileged access to Entra roles and Azure resources.", url: "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure" }
      - { name: "Microsoft Entra ID Governance", text: "Access packages, access reviews and lifecycle governance for internal and external access.", url: "https://learn.microsoft.com/en-us/entra/id-governance/identity-governance-overview" }
  - title: "Applications and compute"
    mark: "APP"
    description: "Runtimes from serverless and PaaS to containers and full Kubernetes."
    products:
      - { name: "Azure App Service", text: "Managed web and API hosting with deployment slots, autoscale and integrated identity.", url: "https://learn.microsoft.com/en-us/azure/app-service/overview" }
      - { name: "Azure Functions", text: "Event-driven serverless compute with triggers and bindings.", url: "https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview" }
      - { name: "Azure Container Apps", text: "Serverless containers with revisions, KEDA scaling and managed infrastructure.", url: "https://learn.microsoft.com/en-us/azure/container-apps/overview" }
      - { name: "Azure Kubernetes Service", text: "Managed Kubernetes for solutions that need the Kubernetes API and orchestration control.", url: "https://learn.microsoft.com/en-us/azure/aks/what-is-aks" }
      - { name: "Azure Container Registry", text: "Private registry for container images and OCI artifacts, including builds with ACR Tasks.", url: "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro" }
      - { name: "Azure Virtual Machines", text: "IaaS compute when the operating system, software or network setup requires full control.", url: "https://learn.microsoft.com/en-us/azure/virtual-machines/overview" }
  - title: "APIs, messaging and events"
    mark: "INT"
    description: "Services that connect systems without coupling them unnecessarily."
    products:
      - { name: "Azure API Management", text: "Gateway, policies, developer portal and lifecycle management for APIs.", url: "https://learn.microsoft.com/en-us/azure/api-management/api-management-key-concepts" }
      - { name: "Azure Service Bus", text: "Reliable messaging with queues, topics, subscriptions, sessions and dead-letter queues.", url: "https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview" }
      - { name: "Azure Event Grid", text: "Distribution of discrete events to subscribers with filtering and retry.", url: "https://learn.microsoft.com/en-us/azure/event-grid/overview" }
      - { name: "Azure Event Hubs", text: "High-volume event streaming and telemetry with partitioned streams.", url: "https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about" }
      - { name: "Azure Logic Apps", text: "Declarative integration workflows with a large connector library.", url: "https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview" }
  - title: "Data and storage"
    mark: "DATA"
    description: "Structured and unstructured data, transactions, global distribution and analytics."
    products:
      - { name: "Azure Storage", text: "Blob, Files, Queue and Table Storage with several redundancy and access models.", url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction" }
      - { name: "Azure Cosmos DB", text: "Globally distributed database with multiple APIs, consistency levels and vector search.", url: "https://learn.microsoft.com/en-us/azure/cosmos-db/introduction" }
      - { name: "Azure SQL Database", text: "Relational PaaS database with built-in high availability and multiple compute models.", url: "https://learn.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview" }
      - { name: "Azure Database for PostgreSQL", text: "Managed PostgreSQL with Flexible Server, high availability and pgvector support.", url: "https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview" }
      - { name: "Azure Managed Redis", text: "Managed in-memory data platform for caching, streams and vector search.", url: "https://learn.microsoft.com/en-us/azure/redis/overview" }
      - { name: "Azure Data Factory", text: "Orchestration and movement of data between cloud and on-premises sources.", url: "https://learn.microsoft.com/en-us/azure/data-factory/introduction" }
  - title: "Networking and security"
    mark: "NET"
    description: "Private connectivity, traffic management, protection and hybrid networks."
    products:
      - { name: "Azure Virtual Network", text: "The basic private network for Azure resources, subnets, routing and peering.", url: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview" }
      - { name: "Azure Private Link", text: "Private access to PaaS services through private endpoints in a virtual network.", url: "https://learn.microsoft.com/en-us/azure/private-link/private-link-overview" }
      - { name: "Azure Front Door", text: "Global HTTP(S) entry point with acceleration, load balancing, failover and WAF.", url: "https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview" }
      - { name: "Azure Application Gateway", text: "Regional layer-7 load balancing, TLS termination and web application firewall.", url: "https://learn.microsoft.com/en-us/azure/application-gateway/overview" }
      - { name: "Azure ExpressRoute", text: "Private dedicated connectivity between on-premises networks and Microsoft's cloud.", url: "https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction" }
      - { name: "Microsoft Defender for Cloud", text: "Security posture, recommendations and workload protection for Azure and hybrid environments.", url: "https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction" }
  - title: "Operations, observability and governance"
    mark: "OPS"
    description: "Standardization, deployment, monitoring, cost and control at scale."
    products:
      - { name: "Azure Monitor", text: "A common platform for metrics, logs, alerts and observability across Azure.", url: "https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/overview" }
      - { name: "Application Insights", text: "Application performance monitoring, distributed traces and OpenTelemetry integration.", url: "https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview" }
      - { name: "Log Analytics", text: "Analysis of workspace log data with Kusto Query Language.", url: "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview" }
      - { name: "Azure Policy", text: "Evaluation and enforcement of standards across resources and scopes.", url: "https://learn.microsoft.com/en-us/azure/governance/policy/overview" }
      - { name: "Bicep", text: "Declarative infrastructure as code for consistent Azure deployments.", url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview" }
      - { name: "Azure Backup and Site Recovery", text: "Data protection, recovery and workload replication for disaster recovery.", url: "https://learn.microsoft.com/en-us/azure/backup/backup-overview" }
      - { name: "Well-Architected Framework", text: "Principles for reliability, security, cost, operations and performance.", url: "https://learn.microsoft.com/en-us/azure/well-architected/" }
---

The catalogue is deliberately selective. It prioritizes services that regularly appear in architecture decisions and in the certifications covered by this area. Every link goes directly to Microsoft Learn.

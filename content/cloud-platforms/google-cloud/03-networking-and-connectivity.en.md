---
title: "Networking and connectivity"
translationKey: gcp-networking
module: "03"
weight: 30
track: "Infrastructure"
duration: "25 min"
level: "Intermediate"
summary: "Build a mental model of global VPC networks, regional subnets, routes, firewalls, load balancing, DNS and private service access."
topics: ["VPC and subnets", "Ingress and egress", "Hybrid connectivity"]
last_reviewed: "22 August 2026"
outcomes:
  - "Explain why a VPC is global while its subnets are regional"
  - "Trace ingress, east-west traffic and egress separately"
  - "Choose between peering, Shared VPC, VPN and Interconnect"
  - "Identify where DNS, firewall and private API access affect a request"
next: { url: "/cloud-platforms/google-cloud/04-compute-and-containers/", label: "Next: compute and containers" }
---

## Start with the packet path

Cloud networking becomes manageable when you trace a request from source to destination and ask the same questions at each hop:

1. How does the source resolve the destination name?
2. Which IP and route does it select?
3. Which firewall, identity or service policy permits the traffic?
4. Which load balancer or proxy terminates the connection?
5. How does the response return, and where can it be observed?

Keep three paths separate: **ingress** into a workload, **east-west** traffic between workloads, and **egress** towards APIs or the internet. They often use different controls.

## VPC networks are global; subnets are regional

A Google Cloud Virtual Private Cloud network is a **global resource**. It can contain **regional subnets**, routes and firewall policies that connect resources across regions. This differs from clouds where the virtual network itself is regional.

IP planning still matters. Choose non-overlapping address ranges that leave room for environments, clusters, services and hybrid networks. Overlap makes peering and hybrid routing difficult later. Prefer custom-mode VPCs for deliberate production designs; the automatically created default network is convenient for exploration but usually too permissive and implicit for a governed landing zone.

VPC firewall rules are stateful and apply to instances or network interfaces based on direction, priority, target and source. Hierarchical firewall policies can enforce rules higher in the organization. A firewall permits network reachability; it does not authorize a business operation.

Read the [VPC overview](https://docs.cloud.google.com/vpc/docs/vpc) and [firewall policy overview](https://docs.cloud.google.com/firewall/docs/firewall-policies-overview).

## Shared VPC and peering solve different ownership problems

**Shared VPC** lets a host project own networks and expose selected subnets to service projects. It is useful when a network/platform team governs connectivity while product teams own workloads in separate projects. IAM controls who may use each subnet.

**VPC Network Peering** connects two independently administered VPC networks using private IP routes. The networks remain separate, and peering is not transitive: if A peers with B and B peers with C, A does not automatically reach C through B.

**Private Service Connect** publishes or consumes managed services and producer services through private endpoints. It is often a better abstraction than broad network peering when the desired contract is “consume this service,” not “join these networks.”

Choose based on ownership and exposure:

| Need | Typical mechanism |
| --- | --- |
| Central network, many workload projects | Shared VPC |
| Private routing between independent VPCs | VPC Peering |
| Private service endpoint with bounded exposure | Private Service Connect |
| Encrypted connection over the internet | Cloud VPN |
| Dedicated private enterprise connectivity | Cloud Interconnect |

## Ingress, load balancing and DNS

Google Cloud offers global and regional load-balancing modes for different protocols and backends. For an internet-facing HTTP application, a global external Application Load Balancer can provide one anycast IP, TLS termination, routing, health checks and integration with Cloud Armor. A regional internal Application Load Balancer is a different choice for private regional consumers.

Cloud DNS provides authoritative public and private zones. Private zones and forwarding policies affect how workloads resolve internal names. DNS failures can look like network or application failures, so include resolution in observability and troubleshooting.

Cloud Armor adds web application firewall and DDoS-related controls for supported load-balanced applications. It does not repair insecure application authorization or unsafe input handling.

## Egress and access to Google APIs

A workload without an external IP can use Cloud NAT for outbound internet connections. NAT does not accept unsolicited inbound sessions and does not by itself restrict which external hosts a workload may contact. Egress firewall policy, proxies or platform-specific controls may still be required.

Access to Google APIs has several private-routing patterns. The correct choice depends on whether the workload has an external IP, whether it must stay within a service perimeter, which API endpoints are supported and how DNS is configured. “Private IP only” is an intended property that must be verified end-to-end, not a checkbox on one resource.

## Architecture checkpoint

A public API runs in two regions. Its database is private, administrators connect from an on-premises network, and product projects must not manage shared routes.

A plausible design uses a centrally managed Shared VPC, service projects for workloads, private database connectivity, global HTTP(S) load balancing with health-aware backends, Cloud Armor, and Cloud VPN or Interconnect for hybrid access. The detailed answer must also state DNS ownership, egress, firewall targets, route exchange, regional failure behavior and which team operates every component.

## Official study links

- [VPC networks](https://docs.cloud.google.com/vpc/docs/vpc)
- [Shared VPC](https://docs.cloud.google.com/vpc/docs/shared-vpc)
- [Cloud Load Balancing overview](https://docs.cloud.google.com/load-balancing/docs/load-balancing-overview)
- [Private Service Connect](https://docs.cloud.google.com/vpc/docs/private-service-connect)
- [Hybrid connectivity](https://docs.cloud.google.com/network-connectivity/docs/concepts/hybrid-connectivity)

### Nais bridge

Nais presents networking primarily through ingresses and `accessPolicy`. The platform translates declared service relationships into routing and network controls on the underlying Kubernetes and cloud network. Teams should still understand names, TLS, ingress exposure, outbound dependencies and timeouts. An access policy establishes permitted connectivity; token validation and domain authorization remain separate layers.

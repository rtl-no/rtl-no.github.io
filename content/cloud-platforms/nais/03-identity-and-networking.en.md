---
title: "Identity, authentication and zero-trust traffic"
translationKey: nais-identity-networking
module: "03"
weight: 30
track: "Security"
duration: "35 min"
level: "Intermediate"
summary: "Separate user, delegation, machine and workload identities; design explicit access policies; and expose services only to their intended audience."
topics: ["ID-porten and TokenX", "Maskinporten and Entra ID", "accessPolicy"]
last_reviewed: "22 August 2026"
outcomes:
  - "Choose an identity mechanism from the actor and trust boundary"
  - "Distinguish workload identity from user or delegated identity"
  - "Design inbound and outbound access policies with least privilege"
  - "Choose service discovery or ingress from the intended audience"
next: { url: "/cloud-platforms/nais/04-data-and-observability/", label: "Next: data and observability" }
---

## Begin with the actor

Identity design fails when every token is treated as “the logged-in user.” For each call, name the actor and context:

- Is a Norwegian citizen using the service?
- Is an employee signed into an internal application?
- Is one internal workload calling another as itself?
- Must a downstream call preserve delegated user context?
- Is an external organization calling machine-to-machine?
- Is the application itself accessing a cloud resource?

These are different trust relationships. Nais integrates several mechanisms so teams do not build every protocol flow from scratch, but the team must select and validate the correct one.

## The identity mechanisms

| Need | Typical mechanism | Identity represented |
| --- | --- | --- |
| Citizen login | ID-porten | End user / Norwegian citizen |
| Internal call on behalf of a citizen | TokenX | Delegated citizen context in an internal service chain |
| Employee login or internal organization identity | Microsoft Entra ID | Employee or internal workload, depending on flow |
| Cross-organization machine integration | Maskinporten | External organization's client |
| Workload accessing platform/cloud resources | Workload Identity | The running workload itself |

Availability and exact configuration vary between tenants and environments. Use the [Nais authentication overview](https://docs.nais.io/auth/) and environment-specific documentation as the source of truth.

### Workload Identity

Every Nais workload has its own identity, implemented through a Kubernetes Service Account. The platform injects a short-lived OIDC identity that can be exchanged or trusted by supported services. Short-lived identity reduces static secret distribution and creates a more precise audit path.

Do not confuse this with an end user's identity. If `order-api` calls Cloud Storage through its workload identity, Google Cloud authorizes the application. If the business rule says the signed-in citizen may retrieve only their own receipt, `order-api` must separately enforce that rule using trusted user/delegation context.

### TokenX and delegation

TokenX supports internal applications acting on behalf of a citizen authenticated through ID-porten. Delegation should be preserved only where the downstream service needs it. Validate issuer, audience and required claims, and authorize the business operation—not just token validity.

### Maskinporten and Entra ID

Maskinporten fits machine-to-machine integration across organizations and scopes granted to the client. Entra ID covers employee login and internal application scenarios in supported Nais environments. “Machine token” does not identify the human behind an action; add business audit context where required.

## Access policy is the service graph

Nais uses a zero-trust starting point: traffic between workloads is not automatically allowed. `accessPolicy` declares permitted relationships.

```yaml
spec:
  accessPolicy:
    inbound:
      rules:
        - application: order-frontend
    outbound:
      rules:
        - application: inventory-api
          namespace: stock-team
      external:
        - host: api.external-provider.no
```

An inbound rule belongs on the receiving application and identifies callers. An outbound rule belongs on the caller and identifies destinations. Depending on the supported identity integration, the relationship can also configure which client identities are accepted.

Review access policies as a graph:

1. Does each edge correspond to a real runtime dependency?
2. Is the application, namespace, cluster and external host scope as narrow as possible?
3. Is a wildcard justified and time-bounded?
4. What token or application authorization is required after network access?
5. What happens if the dependency is slow or unavailable?

Network reachability, token authorization and **domain authorization** are separate layers. Passing one layer never implies the next.

## Service discovery or ingress

For workloads in the same environment, use Kubernetes service discovery: `http://<application>` in the same namespace or `http://<application>.<namespace>` across namespaces. This avoids external exposure and unnecessary network hops; access policy restricts the relationship.

Use an **ingress** when the intended audience is outside the environment—people, browsers or services in another environment/network. The selected domain communicates the intended exposure. TLS termination and routing are platform capabilities, but the application must still authenticate its audience.

Do not use an external ingress merely because it is easy to copy a URL. Start with the audience, then choose exposure. See [Exposing your application](https://docs.nais.io/workloads/application/explanations/expose/).

## Secrets and configuration

Prefer identity over a shared secret when the target supports it. For remaining secrets, use the supported Nais secrets capability and expose them to the workload as documented. Never commit secret values to the manifest or repository.

Treat secrets as lifecycle objects: identify owner, consumer, source, rotation, revocation and audit path. Environment variables are convenient but can leak through diagnostics or process inspection; applications must avoid logging configuration indiscriminately.

Non-secret configuration also needs ownership and rollout discipline. A configuration change can break production as effectively as a code change.

## Architecture checkpoint

A citizen-facing frontend calls an internal case API, which calls an external municipality API. Separate the controls.

A plausible design uses ID-porten for citizen login, TokenX where the internal case API needs delegated citizen context, explicit inbound/outbound access policies for the internal service edge, Maskinporten for the cross-organization machine call if required by the external API, and domain authorization in each service. It must also define ingress audience, token audiences/scopes, timeouts, audit context and failure behavior.

## Official study links

- [Authentication and authorization](https://docs.nais.io/auth/)
- [Workload Identity](https://docs.nais.io/auth/workload-identity/)
- [Access policy reference](https://docs.nais.io/workloads/reference/access-policies/)
- [Exposing an application](https://docs.nais.io/workloads/application/explanations/expose/)
- [Secrets](https://docs.nais.io/services/secrets/)

### Google Cloud bridge

The [Google Cloud identity module]({{< relref "/cloud-platforms/google-cloud/02-identity-and-security.en.md" >}}) explains the service-account and short-lived credential principles beneath workload access to Google services. The [networking module]({{< relref "/cloud-platforms/google-cloud/03-networking-and-connectivity.en.md" >}}) provides the VPC and ingress/egress model below Nais access policies.

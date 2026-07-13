---
title: "Agentic development"
translationKey: ai-agentic-development
eyebrow: "Foundations"
summary: "How goal-directed AI agents work, what makes them useful, and how to give them enough freedom to deliver without creating an uncontrolled blast radius."
last_reviewed: "13 July 2026"
weight: 10
official_sources:
  - name: "Building effective agents"
    description: "Anthropic's distinction between workflows and agents, with simple composable patterns."
    url: "https://www.anthropic.com/engineering/building-effective-agents"
  - name: "Demystifying evals for AI agents"
    description: "Practical guidance for evaluating multi-step agent behaviour."
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - name: "Microsoft agent architecture"
    description: "Architecture, evaluation and operational guidance for agent systems."
    url: "https://learn.microsoft.com/en-us/agents/"
---

## What “agentic” means

A language model responds to a message. An agent receives a goal, access to context and tools, and can choose a sequence of actions to achieve that goal. After each action it observes the result and decides what should happen next.

The basic loop is simple:

1. **Understand the goal** and what counts as done.
2. **Gather context** from code, documentation, logs or external systems.
3. **Choose and execute an action** with a tool.
4. **Observe the result**, including errors and unintended consequences.
5. **Adjust the plan** and repeat until the acceptance criteria are met.
6. **Deliver evidence**: tests, build output, a diff, screenshots, traces or other verification.

The important shift is that the model does not merely suggest the next text. It uses software to affect state outside the model.

## Workflow or agent?

| Approach | Who decides the next step? | Best suited when |
|---|---|---|
| Traditional code | The program | Rules are stable and can be expressed deterministically. |
| AI workflow | A predefined flow with model steps | The process is known but individual steps require interpretation. |
| Agent | The model dynamically chooses actions and tools | The route to the goal is unknown and requires exploration or adaptation. |

Start with the simplest architecture that solves the problem. Agents provide flexibility but pay for it with latency, cost and greater variance. A deterministic workflow is often better for stable business processes.

## The building blocks

### Model and instructions

The model provides interpretation, planning and selection. Instructions define role, boundaries, priorities and how uncertainty should be handled. They should be short enough to follow and concrete enough to test.

### Context

Context is more than a long prompt. It includes the task, repository rules, relevant files, earlier decisions, examples, tool descriptions and current state from the systems the agent works with. Good context is selective: the right information at the right step.

### Tools

A good agent tool does one thing clearly, has a precise input schema, returns structured results and separates reads from writes. Errors must give the agent enough information to recover. Command-line tools, APIs and MCP servers work well when their interfaces are predictable.

### State and memory

Short-term state tracks the plan and observations within one run. Durable memory can retain preferences, decisions or learning across runs. Durable memory needs ownership, a lifetime and a correction mechanism; otherwise stale assumptions become invisible technical debt.

### Orchestration

Orchestration controls the loop, tool calls, retry, time limits, delegation and stopping conditions. Multi-agent design is orchestration with several specialised contexts—not automatically better intelligence.

## A maturity ladder for delegation

1. **Assistant:** suggests code or analysis; a human performs the actions.
2. **Supervised agent:** can read, edit and test inside a bounded workspace; risky steps require approval.
3. **Bounded autonomous agent:** can complete well-defined tasks independently inside a sandbox with measurable stopping criteria.
4. **Orchestrated agent system:** several agents or workstreams cooperate while a control layer owns budget, access and final verification.

Move up only when measurements show that greater autonomy produces better outcomes than additional control.

## A robust development workflow

### 1. Define the contract

Describe the desired result, what must not change, technical constraints and how the solution will be verified. “Improve authentication” is weak. “Reject expired tokens, preserve the existing API contract and add regression tests” can be checked.

### 2. Let the agent investigate before writing

Ask it to find the relevant files, trace the data flow and explain existing patterns. This reduces the chance of it building a parallel solution because it missed the established one.

### 3. Review the plan when risk is high

The plan should name components, trade-offs, verification and possible migration requirements. Small reversible changes can proceed directly; significant data, security or infrastructure changes deserve an explicit checkpoint.

### 4. Work in small verifiable steps

Keep feedback loops short. Run relevant tests after each coherent step. Large unverified change sets make the cause of failure harder for both agent and human to find.

### 5. Require independent verification

The agent's own explanation is not evidence. Use compilers, tests, linting, type checking, security scanners, browser tests and diff review. For important changes, a separate agent or person can review without seeing the implementation conversation.

### 6. Capture learning in the repository

When a project has surprising rules, encode them in repository guidance, tests or tools. Do not make the next agent depend on an old conversation still being available.

## Evaluation: how do we know the agent works?

Evaluate both the outcome and the path:

- **Task completion:** Was a usable result actually delivered?
- **Correctness:** Does it pass deterministic tests and domain checks?
- **Tool use:** Did the agent select the right tool with the right arguments?
- **Safety and compliance:** Did it remain within instructions and access boundaries?
- **Efficiency:** How much time, tokens, tool use and human follow-up did it require?
- **Robustness:** Does it handle variations and edge cases, not only one example?

Build a representative evaluation set before optimising the prompt. Combine code-based checks, scenarios, model-based grading and expert human review. Re-run evals whenever the model, instructions, tools or knowledge sources change.

## Security and control

An agent's blast radius is determined by what it can reach, not only by how politely it is instructed.

- Use **least privilege** and separate identities for agents.
- Restrict filesystem and network with **sandboxes and allowlists**.
- Keep secrets out of prompts, logs and workspaces where possible.
- Require explicit approval for irreversible actions, production, payments and access changes.
- Treat web pages, issues, documents and tool results as potentially hostile input; prompt injection can travel with context.
- Log tool calls and decision-relevant state so incidents can be investigated.
- Set budgets, timeouts, retry limits and a clear way to stop the agent.

More approval prompts do not necessarily mean more security. They can cause approval fatigue. Technically enforced boundaries are stronger than asking a person to click “allow” all day.

## Common failure modes

- An unclear goal with no acceptance criteria.
- Too much irrelevant context or missing project rules.
- Tools with ambiguous names and unstructured output.
- Allowing the agent to modify the tests meant to prove the implementation.
- Adding multiple agents before measuring one agent and a simple workflow.
- Replacing regression tests and evals with “it looked right”.
- Granting production access because the sandbox feels inconvenient.

Good agentic development is therefore still good software engineering: clear contracts, small changes, automated evidence, observability and responsible change control.

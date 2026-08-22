---
title: "AI engineering: from prototype to production"
translationKey: ai-engineering
eyebrow: "Complete learning path"
summary: "A practical field guide to the six capabilities behind useful, grounded, measurable and production-ready AI applications."
last_reviewed: "22 August 2026"
weight: 5
official_sources:
  - name: "AI Engineering Skills Map"
    description: "Andrew Ng's six-part map for building and deploying AI applications—the starting point for this expanded guide."
    url: "https://www.linkedin.com/pulse/ai-engineering-skills-map-building-deploying-applications-andrew-ng-gyn5e/"
  - name: "Machine Learning Crash Course"
    description: "Google's practical modules on models, data, embeddings, LLMs, production systems and fairness."
    url: "https://developers.google.com/machine-learning/crash-course"
  - name: "Building effective agents"
    description: "Anthropic's distinction between workflows and agents, with composable architectural patterns."
    url: "https://www.anthropic.com/engineering/building-effective-agents"
  - name: "OWASP Top 10 for GenAI applications"
    description: "Current risks and mitigations for the development, deployment and operation of LLM applications."
    url: "https://genai.owasp.org/llm-top-10/"
  - name: "NIST Generative AI Profile"
    description: "A risk-management companion to the NIST AI Risk Management Framework for generative AI systems."
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
---

## What AI engineering really is

AI engineering is the discipline of building dependable software around components whose outputs are uncertain. A normal function should return the same answer for the same input. A language model may produce a different formulation, miss an instruction or choose an unexpected tool even when the input appears unchanged. The engineering task is therefore not to make a model infallible. It is to design a system that remains useful when the model is imperfect.

Andrew Ng's AI Engineering Skills Map identifies six connected capabilities:

1. **LLM foundations** — understand what the model can and cannot do.
2. **Grounding models with data** — supply the right evidence at the right time.
3. **Building agentic systems** — let models select and execute useful actions.
4. **Evaluation-driven development** — turn vague quality into measurable feedback.
5. **Operating in production** — control reliability, risk, cost and latency in real use.
6. **Machine-learning foundations** — reason systematically about data, uncertainty and generalisation.

These are not six isolated subjects. They form one feedback system:

```text
user need → context → model decision → action → validation → observation
     ↑                                                        │
     └────────────── evaluation and improvement ──────────────┘
```

The strongest systems place a **deterministic shell around a probabilistic core**. Code handles permissions, schemas, calculations, business rules and irreversible actions. Models handle interpretation, generation, classification and planning where flexibility is valuable. Evaluation tells you whether that division is working.

### The questions an AI engineer asks

| Layer | Core question | Evidence of a good answer |
|---|---|---|
| Product | Which user outcome should improve? | A task and measurable success criterion |
| Model | Which capability and failure profile fit? | A model comparison on representative cases |
| Context | What must the model know now? | Retrieval relevance, freshness and citations |
| Action | What may the system do? | Typed tools, permissions and approval boundaries |
| Evaluation | How will we detect better or worse? | Versioned datasets, graders and error analysis |
| Operations | Can we run it safely at scale? | Traces, alerts, budgets, rollback and incident plans |

Read the guide once from top to bottom to see the complete system. Then return to the capability that limits your current project.

## 1. LLM foundations

### A model predicts tokens, not truth

A large language model converts input into tokens and repeatedly predicts a probability distribution for the next token. The polished answer is the visible result of that sequence. It is not a database lookup and does not prove that the model has checked a fact.

This mental model explains several behaviours:

- Small wording changes can alter which continuation becomes likely.
- A plausible answer can be false because linguistic confidence is not factual certainty.
- Exact character counting, arithmetic and identifiers can be fragile because the model operates on tokens.
- Giving a model tools and authoritative context can be more effective than asking it to remember.
- Structured output narrows the possible response shape, but it does not guarantee that the values are correct.

### Generation controls

**Temperature** changes how strongly sampling favours the most likely tokens. Lower values usually make responses more consistent; higher values can increase variety. **Top-p** limits sampling to a probability mass. These controls affect variation, not knowledge. Lowering temperature does not transform an unsupported claim into a verified fact.

Set generation controls according to the task. Extraction, routing and tool arguments benefit from consistency and constrained schemas. Ideation may benefit from diversity. For high-risk decisions, use validation and evidence rather than relying on a particular sampling value.

### Context is a limited working space

The context window may contain system instructions, conversation, retrieved documents, tool descriptions and outputs. More context is not automatically better. Irrelevant material competes for attention, costs tokens and can introduce conflicting instructions.

Treat context as an engineered resource:

1. Put durable behavioural rules in the highest-priority instructions.
2. Include the current task and acceptance criteria explicitly.
3. Retrieve only material that can affect the answer.
4. Preserve provenance so claims can be traced to sources.
5. Summarise or externalise old state rather than carrying an unlimited transcript.
6. Measure whether added context improves the relevant evals.

Prompt caching can reduce cost and latency when a stable prefix is reused. A model's knowledge cutoff matters for changing facts; live data should come from retrieval or tools. Reasoning effort can improve hard tasks but consumes additional time and compute, so route it deliberately.

### Match the model to the job

Do not ask only, “Which model is best?” Ask, “Which model is sufficient for this step under our quality, latency, cost, privacy and deployment constraints?”

| Requirement | What to test |
|---|---|
| Reasoning quality | Success on difficult, representative tasks |
| Instruction following | Schema validity and constraint compliance |
| Tool use | Correct selection, arguments and recovery from errors |
| Multimodality | Performance on the actual image, audio or document formats |
| Speed | Time to first token and total task latency |
| Economics | Cost per successful task, not merely cost per token |
| Governance | Data handling, retention, region and audit requirements |

A capable model can handle complex planning while a smaller model performs routing or extraction. This model cascade is worthwhile only when evaluation shows that the router makes good decisions and the total system remains simpler or cheaper.

### Prompting, retrieval, tools or fine-tuning?

Use **prompting** to clarify the task, constraints, examples and output format. Use **retrieval** when knowledge changes or must be cited. Use **tools** when the system must calculate, query live state or perform an action. Use **fine-tuning** when you need a repeated behaviour, style or task pattern that examples and instructions cannot deliver efficiently enough.

Fine-tuning is not the natural first response to missing current facts. It introduces a training dataset, versioning, deployment and evaluation problem. Establish a baseline first; otherwise you cannot know whether it helped.

### Foundation exercise

Choose one real task and create 20 representative inputs. Test at least two models with the same prompt. Record task success, format validity, latency, input/output tokens and failure category. Then change only one variable—prompt, model, context or reasoning level—and run the same set again. This is the beginning of evaluation-driven engineering.

## 2. Grounding models with data

Grounding connects a model's response to information outside its trained parameters. The objective is not to provide the most information; it is to provide the **smallest sufficient set of trustworthy evidence** for the current decision.

### Three ways to provide knowledge

1. **Prompt context:** include a compact policy, record or document directly. This is simple and predictable for small, stable inputs.
2. **Retrieval:** search a larger corpus and place the best candidates in context. This fits knowledge bases and document collections.
3. **Tools:** let the model query a database, API, search service or calculation on demand. This fits live or structured state and lets access be authorised per call.

Many useful systems combine all three. A stable policy may be in the prompt, relevant manuals retrieved from a search index, and the customer's current order status fetched through a tool.

### A retrieval pipeline

Retrieval-augmented generation, or RAG, is a pipeline rather than a checkbox:

```text
source → parse → normalise → split → enrich → index
query  → rewrite/filter → retrieve → rerank → assemble → answer → cite
```

Every arrow is a possible failure. A perfect model cannot cite a paragraph that the parser dropped. A strong retriever cannot overcome stale permissions. When answers are weak, inspect the pipeline stage by stage instead of rewriting the final prompt at random.

### Choose the representation that matches the question

| Representation | Strong when | Typical weakness |
|---|---|---|
| Keyword search | Exact terms, codes, names and rare phrases matter | Misses paraphrases and conceptual similarity |
| Vector search | Users phrase the same idea in many ways | Can return semantically related but non-answering text |
| Hybrid search | Both exact and semantic relevance matter | More ranking and tuning complexity |
| Knowledge graph | Relationships and multi-hop connections are central | Expensive modelling and maintenance |
| Semantic layer over structured data | Questions map to governed business metrics and records | Requires clear schema and business definitions |
| Direct API or database tool | Data is live, scoped and naturally structured | Tool design, permissions and error handling become critical |

Vector search is not automatically the default. A product code, legal clause number or error identifier may demand lexical search. Numeric aggregation should usually happen in code or a query engine rather than through similarity search. Use reranking when initial retrieval has high recall but poor ordering.

### Prepare documents for use, not merely storage

Good ingestion preserves headings, tables, page references, dates, ownership and access labels. Chunk boundaries should follow meaning where possible. Very small chunks lose context; very large chunks dilute relevance. Keep the original document and a stable identifier so a citation can lead back to evidence.

Freshness needs an explicit policy:

- What event triggers re-indexing?
- How quickly must deleted content disappear?
- Can one user retrieve another user's documents?
- Which source wins when two documents conflict?
- How can an owner correct an error?
- Can the system explain which version it used?

Access control must happen before or during retrieval, not after the model has seen the text. Retrieved content is also untrusted input: a document can contain instructions intended to manipulate the model. Separate data from instructions, restrict tools independently and validate downstream actions.

### Evaluate grounding separately from generation

Measure at least two layers:

- **Retrieval quality:** Did the candidate set contain the necessary evidence? Track recall at *k*, ranking quality, permission correctness and freshness.
- **Answer quality:** Did the response use the evidence faithfully, answer the question and cite the supporting passage?

An answer may be wrong because retrieval missed the source, because context assembly truncated it, or because generation ignored it. These causes require different fixes.

### Grounding exercise

Select 30 questions for a small document set. For each question, identify the passage required to answer it. Build a keyword baseline before adding vector or hybrid search. Record whether the correct passage appears in the top results, then test answer faithfulness. Study every miss and label it as parsing, metadata, query, retrieval, ranking, context or generation failure.

## 3. Building agentic systems

An agentic system lets a model participate in deciding the next step. That can range from a fixed workflow containing several model calls to an agent loop that repeatedly observes state, selects tools and adapts its plan.

### Use the least autonomy that solves the task

| Level | Control flow | Good fit |
|---|---|---|
| Single model call | Application code | One bounded transformation or classification |
| Chained workflow | Predetermined steps | Stable process with interpretable stages |
| Router and specialists | Classifier plus specialised paths | Distinct request categories or cost tiers |
| Evaluator–optimizer | Generate, critique, revise | Quality criteria are clear and iteration helps |
| Agent loop | Model chooses the next action | The path cannot be known in advance |
| Multi-agent orchestration | Coordinator and isolated workers | Truly independent contexts or parallel investigation |

Every step adds latency, cost and another place for an error to compound. Complexity should earn its place by improving a measured outcome.

### The agent loop

A robust loop needs more than a clever system prompt:

1. **Goal:** define success, constraints and stopping conditions.
2. **State:** retain the plan, observations and artifacts that matter.
3. **Selection:** let the model choose an allowed action.
4. **Execution:** run that action in a controlled environment.
5. **Observation:** return structured success or actionable failure.
6. **Validation:** check progress with code, rules, another model or a human.
7. **Stop:** finish, request judgement or terminate at a budget boundary.

The environment should provide ground truth. A coding agent runs tests; a support agent reads the ticket state; a research agent opens the source. Asking the model whether it succeeded is weaker than checking the system it changed.

### Tools are the agent's user interface

A tool should have one clear purpose, typed inputs, bounded outputs and errors that enable recovery. Distinguish read tools from write tools. Prefer semantic operations such as `get_order_status` over exposing a generic database shell. Make dangerous parameters difficult to express accidentally.

For every tool, define:

- what it does and when it should be used
- required and optional arguments with examples
- permissions and data scope
- idempotency and retry behaviour
- possible errors and recovery guidance
- whether a human must approve execution
- what is logged for later investigation

Tool protocols such as MCP can standardise discovery and invocation, but a protocol does not make an unsafe capability safe. Identity, authorisation, validation and audit remain application responsibilities.

### Memory and long-running context

Conversation history is not the same as memory architecture. Separate:

- **Working state:** facts needed during the current run.
- **Episodic history:** what occurred in earlier tasks or conversations.
- **Semantic memory:** durable preferences, entities or decisions.
- **Source knowledge:** authoritative documents and records retrieved on demand.

Every durable memory needs provenance, an owner, expiry and a correction path. Storing every model summary indefinitely creates confident, stale assumptions. For long tasks, preserve structured state and artifacts; summarise narrative history only when it has continuing value.

### Safety is architectural

Guardrails should exist before and after the model. Validate inputs, but assume some adversarial instructions will enter through users, web pages or retrieved documents. Independently constrain which tools can run, which records they can access and which actions need approval. Validate model output before using it in HTML, SQL, shell commands, financial transactions or access changes.

Use sandboxes, least privilege, allowlists, timeouts, iteration limits and cost budgets. Keep secrets outside model-visible context where possible. Log decisions and tool calls without turning sensitive data into a new exposure.

### Agent exercise

Implement a three-step workflow for a task you know well: classify, execute a specialised step, and validate the result. Create an eval baseline. Only then replace the fixed control flow with an agent loop. Compare completion rate, latency, cost, number of tool errors and human interventions. Keep the agent only if its flexibility produces measurable value.

## 4. Evaluation-driven development

AI development becomes systematic when each change is an experiment against a stable set of examples. Without evals, teams respond to the most recent impressive demo or embarrassing failure. Neither is a representative sample.

### Start with the product decision

“Response quality” is too vague. Define what a user must be able to accomplish and what failures are unacceptable. A support assistant might be measured on correct resolution, grounded claims, policy compliance, escalation quality and time to resolution. A coding agent might be measured on passing tests, preserving behaviour, diff quality and security.

Use both **capability metrics** and **constraint metrics**. A system is not better if task success rises while serious data exposure also rises.

### Build a versioned evaluation set

Your initial set should include:

- common, high-volume cases
- difficult but valid cases
- edge cases and ambiguous requests
- adversarial or policy-sensitive cases
- historical production failures
- cases where the correct action is to abstain or ask for help

Store the input, reference facts, expected properties, grading method and reason the case exists. Split examples into a development set used during iteration and a held-out set used to estimate generalisation. Add production failures after fixing them, but avoid optimising the entire system for one anecdote.

### Select the right grader

| Grader | Best for | Watch for |
|---|---|---|
| Deterministic code | Schema, exact values, calculations, tool traces, tests | Can miss semantically valid alternatives |
| Statistical metric | Classification, ranking and retrieval at scale | Metric may not match user value |
| Model judge | Rubrics for relevance, completeness, tone or faithfulness | Position bias, self-preference and inconsistent reasoning |
| Human expert | Nuance, safety, product value and disputed cases | Cost, speed and reviewer disagreement |
| User outcome | Resolution, acceptance, correction or repeat use | Confounding factors and slow feedback |

Combine graders. Use code wherever correctness can be stated precisely; reserve model or human judgement for qualities that genuinely require interpretation.

### Evaluate the evaluator

A model judge is another probabilistic component. Calibrate it against examples labelled by humans. Randomise answer order in comparisons, hide irrelevant metadata and examine disagreement. Track false passes and false failures, especially around safety boundaries. If the judge cannot reliably separate a meaningful improvement from noise, it should not control a release gate alone.

### Error analysis drives the next change

After each run, inspect failures and build a taxonomy. For example:

- misunderstood intent
- missing or conflicting context
- retrieval miss
- unsupported claim
- wrong tool or arguments
- permission or policy violation
- valid answer in invalid format
- incomplete stopping or recovery
- unacceptable latency or cost

Count categories and prioritise by frequency, severity and fixability. Read traces for a sample of successes too; a correct final answer may hide a fragile path.

Change one major variable at a time where possible. Version prompts, models, tool schemas, retrieval settings and datasets. Record the hypothesis before running the comparison. The loop is:

```text
observe → label errors → choose highest-value cause → change → evaluate → review
```

### Evaluation exercise

Create a 50-case dataset for one feature. Write deterministic graders for everything that can be checked exactly, and a short rubric for the remaining qualities. Have two people label ten cases independently to expose ambiguity in the rubric. Run a baseline, classify the failures and improve only the largest actionable category.

## 5. Operating AI systems in production

A prototype proves that the happy path can work. Production engineering proves that the system remains useful across real users, changing data, provider failures, hostile inputs and budget constraints.

### A production reference flow

```text
client
  → authentication, quotas and policy
  → orchestration and context assembly
  → model gateway and tool execution
  → output validation and response
  → traces, feedback, eval sampling and incident signals
```

The model gateway centralises model versions, retry policy, timeouts, budgets and provider routing. Tool execution uses scoped identities. Output validation prevents model text from becoming trusted code or data merely because it looks structured.

### Observe the complete task

Traditional infrastructure metrics still matter: availability, error rate, CPU, memory and network. AI systems add semantic and economic signals:

- completion and escalation rates
- retrieval and citation quality
- policy violations and blocked actions
- tool selection, error and retry rates
- input, output and reasoning tokens
- time to first token and end-to-end task time
- cost per request and per successful outcome
- model, prompt, index and tool versions
- user correction, acceptance and abandonment

Use distributed traces to connect the user request, retrieved context, model calls, tool calls, validation and final outcome. Redact or minimise sensitive content. Logs must support debugging without becoming an uncontrolled copy of every private conversation.

### Release with statistical regression gates

Pin versions where the provider supports it. Treat a model, prompt, retrieval change or tool description change as a release. Run offline evals, then use shadow traffic, canaries or a limited cohort for meaningful changes. Define rollback criteria before launch.

Because outputs vary, a single pass is weak evidence. Repeat stochastic cases where necessary and compare distributions, confidence intervals or failure counts. Calibrate release rigor to harm: a drafting assistant and an automated benefits decision need different evidence and human oversight.

### Engineer latency and cost as a budget

Break the task into components. Retrieval, serial model calls, tool round trips and output length all add latency. Common optimisations include:

- reduce irrelevant context and response length
- parallelise truly independent work
- cache stable prompt prefixes and safe retrieval results
- route simple cases to a smaller model
- replace model work with code for deterministic operations
- combine steps only when evals show no quality loss
- stream early output when it improves user experience
- use batch or asynchronous processing off the interactive path

Optimise **cost per successful outcome**, not the price of an individual call. A cheap model that causes retries and human correction may be the expensive choice.

### Resilience, drift and change

Model providers can throttle, fail or change behaviour. Tools time out. Indexes become stale. Build explicit failure handling: bounded retries with backoff, idempotency keys for writes, circuit breakers, queues where appropriate and a degraded mode that remains honest.

Monitor drift in inputs, retrieval sources, model outputs and user behaviour. Keep an inventory of model and data dependencies. Re-run evals when any part changes, including seemingly harmless tool descriptions.

### Security and incident response

Prompt injection is a confused-deputy problem: untrusted content attempts to influence a system with more authority. Do not rely on the model to recognise every attack. Restrict authority outside the prompt.

Prepare for sensitive-information disclosure, supply-chain changes, poisoned data, unsafe output handling, excessive agency, vector-store weaknesses, misinformation and unbounded consumption. For each major risk, define prevention, detection, containment and recovery.

An AI incident playbook should answer:

1. How do we disable a tool, model route or feature quickly?
2. Which traces identify affected users and actions?
3. How are credentials revoked and data access contained?
4. Which safe fallback can continue serving users?
5. How does the failure become a regression test or eval case?

### Production exercise

Draw the request path for your system and mark every external dependency, trust boundary and irreversible action. Add a timeout, owner, metric and fallback for each. Calculate a per-task token and latency budget. Run a game day in which retrieval is stale, the model provider is unavailable or a tool returns a partial failure.

## 6. Machine-learning foundations

LLMs do not replace machine-learning fundamentals. They make those foundations more useful because teams must reason about uncertain outputs throughout the product.

### The basic learning problem

In **supervised learning**, examples pair inputs with desired labels or values. Classification predicts a category; regression predicts a number. **Unsupervised learning** finds structure without labelled targets, such as clusters or representations. **Reinforcement learning** learns behaviour from rewards over actions and outcomes. Modern foundation models combine large-scale self-supervised learning with various adaptation and alignment techniques.

You do not need to train a frontier model to benefit from these concepts. You do need to understand what the data represents, how performance is estimated and why a system that fits past examples may fail on new ones.

### Generalisation, bias and variance

Split data so evaluation represents unseen cases. Training performance shows fit to known examples; validation supports development choices; a held-out test estimates final generalisation. Prevent duplicates, near-duplicates, future information or records from the same entity leaking across splits.

**High bias** means the approach is too limited or underfit: both training and validation performance are poor. **High variance** means it has learned training specifics that do not transfer: training looks strong while validation lags. More model complexity does not solve every problem. Better data, features, regularisation or a simpler task definition may matter more.

### Metrics encode a decision

Accuracy can hide serious errors when classes are imbalanced. **Precision** asks how many predicted positives were correct. **Recall** asks how many real positives were found. The threshold trades one against the other. For ranking and retrieval, measure whether relevant items appear and how high. For numeric predictions, examine error magnitude and distribution rather than a single average.

Choose metrics from the cost of mistakes. A spam filter, cancer screen and fraud investigation have different consequences for false positives and false negatives. Always inspect slices: language, customer group, document type, request complexity or any dimension tied to product risk.

### Data engineering is model engineering

Labels can be inconsistent, proxies can encode historical unfairness and production data can differ from the training set. Document where data came from, who may use it, how it was labelled and which population it represents. Look for missing values, outliers, duplicates, leakage and temporal drift.

Error analysis often beats a blind search for a larger model. Sample the failures, group them by cause and decide whether to improve data, representation, objective, model, threshold or product flow.

### When classical ML is the right tool

Use a language model when unstructured language, broad knowledge or flexible generation is central. Use classical models or deterministic code when inputs are structured, the target is stable, latency is tight, explanations are required or large labelled datasets make a focused predictor effective. Many production systems combine them: an LLM extracts structured features, a rules engine enforces policy and a specialised model estimates risk.

### ML foundations exercise

Take a binary classification dataset. Create training, validation and test splits without entity or time leakage. Build a simple baseline, inspect the confusion matrix, choose a threshold from the real cost of false positives and false negatives, and examine performance across at least three meaningful slices. Write down which error category you would address next and why.

## Putting the six capabilities together

Imagine an internal support assistant that can answer policy questions and create a ticket.

1. **LLM foundations:** choose a model that follows instructions and can call tools reliably.
2. **Grounding:** retrieve current policy passages with access filters and citations.
3. **Agentic system:** use a fixed answer flow; allow a ticket tool only when the user asks for action.
4. **Evaluation:** test answer correctness, citation support, routing, arguments and refusal cases.
5. **Production:** trace requests, redact sensitive fields, set cost limits and deploy behind a canary.
6. **ML foundations:** analyse errors by request type, understand precision/recall for ticket routing and watch for data drift.

Notice what is not delegated to the model. Authentication establishes identity. Retrieval enforces document permissions. Code validates the ticket schema. The ticket API authorises the write. The model interprets intent and composes useful language inside those boundaries.

### A decision sequence for new features

1. Define the user outcome and the cost of failure.
2. Build the simplest model-call baseline.
3. Create representative eval cases before adding complexity.
4. Add grounding if the task needs external or changing knowledge.
5. Add tools if it needs live state, computation or action.
6. Add a workflow or agent only when the route cannot remain simple.
7. Design permissions, observability and rollback before production access.
8. Use production evidence to improve the eval set and the system.

## A twelve-week learning plan

| Weeks | Focus | Deliverable |
|---|---|---|
| 1–2 | Tokens, generation, context, structured output and model selection | A 20-case model comparison with failure labels |
| 3–4 | Parsing, chunking, keyword/vector/hybrid retrieval and citations | A small grounded Q&A system with retrieval evals |
| 5–6 | Tools, workflows, agent loops, state and permissions | A bounded agent with typed read/write tools |
| 7–8 | Eval datasets, graders, rubrics and error analysis | A repeatable evaluation command and experiment log |
| 9–10 | Tracing, deployment, latency, cost, security and incidents | A production readiness review and failure drill |
| 11 | Generalisation, metrics, bias/variance and data quality | A classical ML baseline with slice analysis |
| 12 | Integration | A capstone demo, evaluation report and operational runbook |

Do not spend twelve weeks only consuming material. Each week should produce an artifact that can fail and be inspected. Keep a learning log with the hypothesis, experiment, result, error categories and next decision.

## Capstone: build a reliable domain assistant

Choose a bounded domain with documents you are allowed to use—for example product manuals, public regulations or your own project documentation. Build an assistant that answers questions, cites evidence and performs one reversible action through a tool.

Your final package should contain:

- a one-page product contract and risk assessment
- a documented data and ingestion pipeline
- a simple baseline and an explanation of each added component
- at least 75 versioned evaluation cases
- separate retrieval, answer and tool-use results
- permissions, approval points and threat scenarios
- traces with sensitive-data handling documented
- latency and cost measurements at p50 and p95
- a deployment, rollback and incident runbook
- an error analysis naming the next three improvements

A polished demo is optional. Evidence is not.

## Production-readiness checklist

### Purpose and ownership

- The user outcome and non-goals are written down.
- A named owner can change, disable and roll back the feature.
- High-impact decisions have appropriate human oversight.

### Data and context

- Sources, freshness and permissions are visible.
- Retrieval is tested independently of final answers.
- Deletion, correction and conflicting-source behaviour are defined.

### Models and actions

- Model choice is supported by representative evals.
- Tool inputs are typed, validated and scoped to least privilege.
- Irreversible actions require stronger controls than read operations.

### Quality and safety

- Eval cases cover normal, difficult, adversarial and abstention scenarios.
- Release gates include both capability and safety constraints.
- Model-based graders have been calibrated against human judgement.

### Operations

- Traces connect context, model calls, tools and outcomes.
- Cost, latency, error and semantic-quality budgets have alerts.
- Provider failure, prompt injection and tool misuse have tested responses.
- Every production incident can become a regression case.

## Compact glossary

- **Agent:** a system in which a model can dynamically choose actions and tools.
- **Embedding:** a numeric representation used to compare or model meaning and similarity.
- **Eval:** a repeatable measurement of system behaviour on specified cases.
- **Grounding:** connecting generation or decisions to external evidence or state.
- **Hallucination:** generated content not adequately supported by truth or provided evidence.
- **Inference:** running a trained model to produce a prediction or output.
- **LLM-as-a-judge:** using a model to grade another system's output against a rubric.
- **RAG:** retrieving external information and placing it in context for generation.
- **Reranker:** a model or algorithm that reorders retrieved candidates by relevance.
- **Semantic layer:** governed definitions that map business concepts to structured data.
- **Tool calling:** the model produces structured arguments requesting an external operation.
- **Trace:** a connected record of the steps, calls and observations in one task.

## The durable lesson

The centre of AI engineering is not the prompt and not the agent framework. It is the learning loop around the system. Build the smallest useful version, observe real failures, classify them, change the component that caused them and prove that the result improved without violating a constraint. That discipline is how unreliable components become part of reliable products.

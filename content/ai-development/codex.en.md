---
title: "OpenAI Codex"
translationKey: ai-codex
eyebrow: "Coding agent"
summary: "A practical guide to Codex as a development agent: surfaces, repository guidance, tools, delegation, code review and verification."
last_reviewed: "13 July 2026"
weight: 20
official_sources:
  - name: "Codex documentation"
    description: "The official entry point for setup, surfaces, configuration and usage."
    url: "https://developers.openai.com/codex/"
  - name: "Codex use cases"
    description: "Concrete workflows for engineering, analysis, quality and automation."
    url: "https://developers.openai.com/codex/use-cases"
  - name: "OpenAI Codex on GitHub"
    description: "Source, releases and issues for the Codex CLI."
    url: "https://github.com/openai/codex"
---

## What Codex is

Codex is OpenAI's development agent for understanding, changing, testing, reviewing and debugging software. Its scope distinguishes it from traditional autocomplete: Codex can investigate an entire codebase, use development tools, edit several files and follow feedback from builds and tests.

Codex is most useful when the task describes an outcome rather than one particular line of code. Typical tasks include finding the cause of a bug, implementing a bounded feature, modernising code without changing behaviour, writing regression tests, reviewing a diff or explaining how an unfamiliar part of a system fits together.

## The surfaces

- **CLI** fits when the terminal, repository and existing command-line tools are central to the work.
- **IDE integration** keeps the agent close to open files, editor context and the usual coding flow.
- **The Codex app** combines conversation, planning, file edits, terminal work, visual checking and management of several tasks.
- **Cloud/web tasks** can operate in an isolated environment and suit bounded work that can be delegated and reviewed later.

Choose a surface based on where the context and checkpoints live. There is rarely a need to standardise everything on one surface; a local investigation can become a delegated task and finish as a local review.

## Codex's working model

A good Codex task combines five things:

1. **A concrete goal** with acceptance criteria.
2. **Repository context** explaining how the project builds, tests and is organised.
3. **Tools** for reading state and taking action.
4. **Permissions and sandboxing** that bound what the agent can affect.
5. **Verification** that determines whether the work is actually complete.

The prompt starts the task, but project guidance and tools make quality repeatable.

## Durable project guidance with AGENTS.md

`AGENTS.md` is where Codex finds rules it should know whenever it works in the repository. Include stable, actionable information:

- commands for build, test, linting and local execution
- architectural boundaries and ownership between layers
- style conventions not already enforced mechanically
- files or areas that must not be changed
- migration, backwards-compatibility and security requirements
- expected verification before a task is reported complete

Guidance can live closer to a particular subtree when its rules only apply there. Keep files concise. Rules that can be enforced by a formatter, compiler, test or hook should be enforced there rather than expressed only as prose.

## Skills, plugins, MCP and hooks

Codex can be extended at several levels:

- A **skill** defines a reusable workflow, often with references, scripts or templates.
- A **plugin** packages skills with tools, MCP configuration, hooks, apps or other installable resources.
- **MCP** connects the agent to structured tools and current context from external systems.
- **Hooks** enforce mechanical rules around tool calls and lifecycle events.
- **Configuration** controls personal or project defaults such as model, sandbox, approvals and integrations.

Use the smallest mechanism that fits. A one-off constraint belongs in the task. A durable repository convention belongs in `AGENTS.md`. A repeated process may become a skill. Live external data and actions should be exposed through a tool or MCP.

## A good Codex workflow

### 1. Start with the outcome

State the goal, scope and evidence. Example: “Add rate limiting to the public API endpoints. Preserve the existing client contract, document the configuration and verify with integration tests.”

### 2. Ask for investigation when the system is unfamiliar

Let Codex find entry points, trace call chains and summarise existing patterns before implementation. For risky work, a reviewable plan is a useful checkpoint.

### 3. Grant autonomy inside the right boundary

The agent should be able to read and write the workspace and run relevant development commands. Network access, secrets, production and irreversible actions should remain more restrictive.

### 4. Let tools provide feedback

Codex becomes much more effective when it can run a focused test, read the real failure and iterate. Put the most relevant commands in repository guidance.

### 5. Review the result, not merely the explanation

Read the diff, check coverage of the acceptance criteria and decide whether the tests prove the intended behaviour. Look for unnecessary scope, weakened validation and tests adapted to the implementation rather than the requirement.

## Use Codex for review

Code review is its own task, not merely the last implementation step. Ask Codex to prioritise concrete bugs, regressions, security problems and missing tests. Give it the diff and relevant context, but allow it to inspect surrounding code when findings depend on system behaviour.

A strong review explains:

- what can go wrong
- which inputs or states trigger it
- where the problem lives
- why existing tests miss it
- a bounded direction for a fix

Consider a separate Codex task for review. Independent context reduces the risk of the agent defending its earlier solution.

## Parallel work and delegation

Parallelism works when tasks are independent: research in separate components, distinct test work, documentation and implementation in different areas. It works poorly when several agents edit the same files or make interdependent architectural decisions.

Each delegated task needs its own goal, clear ownership of files or output, and a defined way to report findings. The main task must integrate and verify the whole.

## Safe use

- Start with the workspace as the security boundary.
- Grant network and external systems only when the task requires them.
- Do not place production secrets in files the agent can read.
- Control commands that change data, access or external resources.
- Treat web, issues and documents as untrusted input.
- Use branches, commits and diffs as reversible checkpoints—but not as substitutes for backup or access control.

Codex can perform substantial work independently. Responsibility for architecture, access, product decisions and what reaches production remains human.

## Where Codex provides the most value

Codex delivers the greatest benefit when feedback is available and the task has a verifiable goal. The better the repository can build, test and explain itself, the more independently the agent can work. A repository without reliable tests, documented commands or clear boundaries does not become mature merely because a strong model has access to it.

---
title: "Anthropic Claude Code"
translationKey: ai-claude-code
eyebrow: "Coding agent"
summary: "A practical guide to Claude Code: CLAUDE.md, explore–plan–code, subagents, hooks, MCP, permissions, sandboxing and verification."
last_reviewed: "13 July 2026"
weight: 30
official_sources:
  - name: "Claude Code"
    description: "Anthropic's product and documentation entry point for Claude Code."
    url: "https://www.anthropic.com/product/claude-code"
  - name: "Claude Code best practices"
    description: "Anthropic's patterns for context, planning, testing and Git workflows."
    url: "https://www.anthropic.com/engineering/claude-code-best-practices"
  - name: "Claude Code documentation"
    description: "Technical documentation for setup, configuration and integrations."
    url: "https://docs.anthropic.com/en/docs/claude-code/overview"
  - name: "Claude Code sandboxing"
    description: "How filesystem and network boundaries reduce risk and approval fatigue."
    url: "https://www.anthropic.com/engineering/claude-code-sandboxing"
---

## What Claude Code is

Claude Code is Anthropic's agentic coding system. It can read a codebase, plan work across files, make changes, run commands and tests, interpret the results and iterate. The terminal is a central surface, but Claude Code is also available through other integrations and can participate in web-based or automated workflows.

Claude Code is intentionally flexible. It does not force every team into one method, but that also means the team must establish its own rules for context, permissions and quality.

## CLAUDE.md as the project brief

`CLAUDE.md` is loaded as durable project context. It should help Claude make the right choices without rediscovering the same facts in each conversation.

Useful content includes:

- build, test and formatting commands
- a map of important directories and architectural boundaries
- code conventions and expected error handling
- rules for database changes and API compatibility
- sensitive areas or files that must not be changed
- verification requirements and what “done” means

Keep the file precise and update it when the agent repeatedly misunderstands the same part of the project. Personal, temporary preferences should not be mixed into a shared project file.

## Explore → plan → code → verify

Anthropic recommends a pattern where the agent investigates first, then plans and implements.

### Explore

Ask Claude to read relevant files, search for similar implementations and explain the data flow without writing code. This creates shared situational awareness and exposes poor task boundaries early.

### Plan

The plan should be more than a todo list. It should describe affected components, important trade-offs, risks and how each requirement will be verified. Use plan mode or an explicit planning phase for substantial changes.

### Code

Let Claude execute the plan in coherent, small steps. Ask it to follow established patterns and avoid unrelated refactoring. Test-first work is effective for verifiable problems: write a failing test, confirm the failure, implement without weakening the test and iterate until it passes.

### Verify

Run relevant tests, builds and static checks. Review the diff and inspect observable behaviour. A successful command is one piece of evidence; it does not automatically mean every requirement is met.

## Skills, commands, hooks and plugins

Claude Code can gain reusable workflows and automatic checkpoints:

- **Skills** collect instructions and resources for a type of task.
- **Commands** make frequently used operations easy to start consistently.
- **Hooks** run deterministic actions at specific events, such as formatting or policy checks.
- **Plugins** can package extensions and team standards for distribution.
- **MCP** provides structured connections to external tools and data sources.

Use model instructions for judgement and hooks for rules that must always be enforced. “Remember to format” is weaker than actually running a formatter.

## Subagents and agent teams

A subagent receives its own context and bounded assignment. This is useful for parallel research, security review, test analysis or work in independent components. It can also protect the main context from large amounts of intermediate material.

Good subagent assignments have:

- one clear question or deliverable
- explicit scope and relevant tools
- an agreed reporting format
- no overlapping file writes with other agents

More agents increase coordination cost. Use them when work can genuinely proceed independently, not by default whenever something looks complicated.

## MCP and external systems

Model Context Protocol lets Claude use tools from services such as GitHub, databases, observability platforms and internal APIs. An MCP tool should have a narrow purpose, explicit parameters, understandable errors and the least access possible.

Separate read and write operations. An agent analysing production logs rarely needs permission to change production. Treat data returned from external systems as untrusted context as well.

## Permissions, sandboxing and autonomy

Claude Code uses permissions for actions that can modify the system. Approvals provide human control, but frequent prompts can cause approval fatigue. Sandboxing creates stronger technical boundaries by restricting filesystem and network access.

A practical setup is:

1. Allow reads and writes inside the active repository.
2. Permit safe, reversible development commands.
3. Restrict network access to required domains.
4. Keep secrets and other workspaces out of reach.
5. Require approval for production, publishing, deletion and access changes.

Flags or settings that bypass all permissions remove an important safety layer. They should not be a convenience shortcut in an ordinary development environment.

## Context management

Long sessions accumulate both useful and stale information. Summarise decisions, clear context when the task changes and split large problems into explicit phases. Preserve durable knowledge in the repository rather than only in conversation.

When Claude moves in the wrong direction, it is often better to stop, explain the deviation and supply corrected context than to add layers of remedial prompting on top of a false assumption.

## Claude Code and Codex

Both are agents that can investigate code, edit files and use tools. Both benefit from clear goals, repository guidance, short feedback loops and rigorous verification. Differences include surfaces, models, configuration and extension mechanisms.

Do not copy configuration names blindly between them: `CLAUDE.md` and `AGENTS.md` serve related purposes but belong to different tools. A mature repository can support both by keeping its core truths in ordinary documentation, tests and automation, while using agent files as concise entry points.

## What the human still owns

Claude can propose architecture and carry out much of an implementation, but the human owns problem definition, risk assessment, access design, product trade-offs and the decision to deploy. High agent activity is not the same as high value; measure outcomes, quality and reduced lead time.

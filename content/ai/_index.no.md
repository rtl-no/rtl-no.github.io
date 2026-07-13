---
title: "AI-utvikling"
headline: "Fra kodeforslag til agentisk utvikling."
description: "Et praktisk kunnskapsområde om utvikling med AI-agenter: arbeidsmåter, kontekst, verktøy, sikkerhet, evaluering, Codex og Claude Code."
translationKey: ai-development
type: ai-development
cascade:
  type: ai-development
last_reviewed: "13. juli 2026"
areas:
  - mark: "01"
    title: "Agentisk utvikling"
    text: "Forstå agentløkken, kontekstarkitektur, verktøy, grader av autonomi, evalueringsdrevet utvikling og sikker delegering."
    url: "/ai/agentic-development/"
    cta: "Lær grunnprinsippene"
  - mark: "02"
    title: "OpenAI Codex"
    text: "Arbeidsflater, AGENTS.md, skills, MCP, kodegjennomgang og en verifiserbar arbeidsflyt fra oppgave til ferdig endring."
    url: "/ai/codex/"
    cta: "Gå til Codex-guiden"
  - mark: "03"
    title: "Claude Code"
    text: "CLAUDE.md, planlegging, hooks, MCP, subagenter, tillatelser og Anthropic-mønstre for agentisk koding."
    url: "/ai/claude-code/"
    cta: "Gå til Claude-guiden"
  - mark: "04"
    title: "YouTube og fagstemmer"
    text: "Offisielle kanaler og et kuratert utvalg innholdsskapere for agentisk koding, AI engineering og modellforståelse."
    url: "/ai/creators/"
    cta: "Finn kanaler å følge"
principles:
  - title: "Mål før prompt"
    text: "Beskriv ønsket resultat, avgrensning og akseptansekriterier. En elegant prompt kan ikke kompensere for et uklart mål."
  - title: "Kontekst er arkitektur"
    text: "Repo-regler, relevante filer, eksempler, verktøy og tidligere beslutninger avgjør hva agenten faktisk kan få til."
  - title: "Verifisering er produktet"
    text: "Tester, bygg, statisk analyse, evals og menneskelig kontroll gjør agentens arbeid etterprøvbart."
  - title: "Autonomi krever grenser"
    text: "Sandbox, minste privilegium, nettverkskontroll og eksplisitt godkjenning begrenser konsekvensene når agenten tar feil."
official_sources:
  - name: "OpenAI Codex"
    url: "https://developers.openai.com/codex/"
  - name: "Anthropic Claude Code"
    url: "https://www.anthropic.com/product/claude-code"
  - name: "Building effective agents"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
  - name: "Microsoft agent architecture"
    url: "https://learn.microsoft.com/en-us/agents/"
---

AI endrer ikke bare hvordan kode skrives. Agentiske utviklingsverktøy kan undersøke en kodebase, lage en plan, endre flere filer, kjøre verktøy, tolke feil og fortsette til resultatet kan verifiseres. Utviklerens viktigste oppgave flyttes derfor gradvis fra å produsere hvert tegn til å definere mål, forme kontekst, designe grenser og vurdere bevisene.

Dette området handler om den disiplinerte varianten av AI-utvikling: tydelige oppgaver, kontrollerbar autonomi og resultater som kan testes. Det er ikke en verktøykonkurranse mellom Codex og Claude Code. De samme grunnprinsippene avgjør kvaliteten uansett hvilken agent som brukes.

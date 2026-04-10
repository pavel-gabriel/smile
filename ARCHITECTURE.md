# Architecture

> Document the system design here. Update when significant changes are made. Reference `DECISIONS.md` for the rationale behind key choices.

---

## Overview

_One paragraph. What does this system do and how is it structured at a high level?_

---

## System Diagram

```
[Replace with ASCII diagram, Mermaid block, or embed a diagram file]

Example:

┌────────────┐      ┌──────────────┐      ┌──────────┐
│   Client   │ ───▶ │   API Layer  │ ───▶ │    DB    │
└────────────┘      └──────────────┘      └──────────┘
```

---

## Components

| Component | Responsibility | Technology | Location |
|-----------|---------------|------------|----------|
| | | | |

---

## Key Data Flows

### Flow 1: [Name]

1. 
2. 
3. 

---

## Data Model

_List key entities and their fields. Keep this at a logical level, not a migration file._

```
Entity: User
  - id: uuid (PK)
  - email: string (unique)
  - created_at: timestamp

Entity: [Next]
  - id: uuid
  - ...
```

---

## Authentication & Authorization

_How is auth handled? What roles exist? What are the trust boundaries?_

---

## Infrastructure

| Resource | Provider/Tool | Configuration notes |
|----------|--------------|-------------------|
| Compute | | |
| Database | | |
| Storage | | |
| CDN | | |
| CI/CD | | |
| Secrets | | |

---

## External Services

| Service | Purpose | Failure mode |
|---------|---------|--------------|
| | | |

---

## Non-Functional Requirements

| Concern | Approach |
|---------|---------|
| Performance | |
| Scalability | |
| Reliability | |
| Observability | |
| Security | |

---

## Known Limitations

_Technical debt, scale limits, or design compromises made deliberately._

- 

---

## Change Log

| Date | Change | Decision ref |
|------|--------|-------------|
| | | |

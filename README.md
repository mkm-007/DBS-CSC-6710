# Lifeline Blood Donation Platform

Course project (CSC 6710 Database Systems, GSU): an online platform that connects **donors**, **blood banks**, and **hospitals** so donation events, inventory, and hospital orders stay consistent.

**Display title (locked):** Lifeline Blood Donation Platform  
**Authors:** Monika Jagatha, Murali Krishna Maddineni

---

## Problem

Blood donation and distribution were fragmented: donors needed events, banks needed storage discipline, hospitals needed typed orders, and regular donors needed a reason to return. Ad-hoc spreadsheets do not enforce rewards, inventory, or order fulfillment.

## Build

Lifecycle the platform owns:

1. Donor / blood-bank / hospital registration and auth  
2. Donation events and recorded donations into bank storage  
3. Hospital orders fulfilled from typed inventory  
4. Reward points on donation, redeemable as partnered hospital services  

**Stack:** Java (Spring Boot) API · Next.js UI · MySQL schema + triggers · Gradle multi-project

```
database/   schemas, seed data, triggers
app/        Spring Boot API
ui/         Next.js frontend
```

## Proof

- Schema + triggers encode donation→storage and donation→reward rules (see `database/`).  
- Seed data boots a demo world (`database/data/`).  
- Schema smoke tests (no DB daemon required):

```bash
python3 -m pytest tests/test_schema_smoke.py -q
```

- Full stack (local):

```bash
# Requires: Java 17+, Node.js, MySQL reachable as configured in the project
./gradlew buildDatabase
./gradlew bootRun          # API
./gradlew startUI          # UI (separate terminal)
```

## Design notes

- Registration types are constrained (`BLOOD_BANK` | `DONOR` | `HOSPITAL`) so identity cannot drift.  
- Triggers keep storage and rewards consistent when donations land — the interesting DB Systems lesson, not just CRUD screens.  
- Failure mode to discuss in interview: order fulfillment under zero inventory for a blood type; trigger/order path must reject or queue honestly.

## Honesty

Enrolled coursework project. Not a production blood-bank deployment. No clinical safety claims.

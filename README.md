# github-dev-days-2026

Demo repo for the talk **From Generic to Team-Aware: Teaching GitHub Copilot how your team works**
(GitHub Copilot Dev Days 2026, Colombo).

It is a small Node.js + TypeScript API for bus seat booking with a test suite. Each branch adds one layer of team context for Copilot:

| Branch | What it adds |
| --- | --- |
| `01-vanilla` | Nothing yet. Just the API. |
| `02-instructions` | Team rules in `.github/copilot-instructions.md` |
| `03-skill` | NIC validation skill in `.github/skills/nic-validation/` |
| `04-agent` | Read-only security reviewer in `.github/agents/security-reviewer.agent.md` |

`main` has all three layers. Use it as a starter setup for your own repo.

## Run it

Requires Node.js 22.12 or later.

```
npm install
npm test
npm run dev        # http://localhost:3000
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/trips` | List trips |
| GET | `/trips/:id` | Trip with seat availability |
| POST | `/bookings` | Book a seat: `{ tripId, seatNumber, passenger: { name, nic, phone } }` |
| GET | `/bookings/:id` | Get a booking |

```
curl -X POST http://localhost:3000/bookings -H "Content-Type: application/json" \
  -d '{"tripId":"CMB-KDY-0730","seatNumber":12,"passenger":{"name":"Kasun Perera","nic":"199512345678","phone":"0771234567"}}'
```

## The three layers

```
.github/
  copilot-instructions.md            1. Always-on team rules
  skills/nic-validation/SKILL.md     2. Know-how loaded when relevant
  agents/security-reviewer.agent.md  3. Specialist with limited tools
```

All three are plain files, so they are reviewed in pull requests and shared with everyone who clones the repo. They work in both Copilot CLI and VS Code.

## Try it on Monday

1. Write five team rules into your instructions file.
2. Turn one task you repeat often into a skill.
3. Create one read-only reviewer agent.

## df-starter-kit

```
Tooling to help teams QUICKLY build conversational experiences
```

---

**Note:** For the very impatient, go here: **[quickstart.md](./quickstart.md)**

---

If you're new to conversational interfaces/agents, you might want to start with the:

- **[resources doc](./docs/resources.md)**

- **[glossary](./docs/glossary.md)**

- **[docs directory](./docs/README.md)**

---

## Overview

Designing and building conversational interfaces is a "team sport." To do it right (ie deliver something that is actually valuable to users ) requires the contributions of many different people from a variety of backgrounds and lots of fine-tuning based on feedback.

This repo and **[associated](https://github.com/valgaze/df-cheatcodes) [tooling](https://github.com/valgaze/df-frontend-vue)** are designed to make it fast and easy to experiment and make changes. With good tooling, teams can spend their limited time/resources on polishing their conversation-- not fiddling with infrastructure or implementation details.

Accordingly, this repo provides sane defaults & tooling for the following:

- **[A "starter" agent that orders ice cream](./agent_config/README.md)**
- **[server](./src/server/index.ts)**
- **[webhook](./src/webhook/health.ts)**
- **[frontend w/ rich components](./src/frontend/README.md)**
- **[Tunneling](./docs/ngrok.md)** for local development of fulfillment webhooks (connecting your agent to external services)
- **[Easy deployment w/ firebase](#deployment)**

## Commands

|       **Command**       | **Function**                                                                                               |
| :---------------------: | :--------------------------------------------------------------------------------------------------------- |
| `$ npm run install:all` | Installs dependencies                                                                                      |
|    `$ npm run serve`    | Starts live-reload process on port specified in config (default port 8000)                                 |
|    `$ npm run build`    | Bundles codebase to dist/ directory                                                                        |
|   `$ npm run tunnel`    | Tunnels server on port specified in settings (see **[here](./docs/ngrok.md)** for security considerations) |

## Deployment

![df-cheats](https://raw.githubusercontent.com/valgaze/df-cheat-docs/master/ex/ex2_ezdeploy.gif)

In order to get up and running as quickly as possible with sane defaults, this repo provides several commands that make deploying a simple backend server, **[fulfillment webhook](https://cloud.google.com/dialogflow/docs/fulfillment-webhook)**, and frontend using **[firebase funtions](https://firebase.google.com/docs/functions)**

|         **Command**         | **Description**                                                                                     |
| :-------------------------: | :-------------------------------------------------------------------------------------------------- |
| `$ npm run deploy:webhook`  | Bundles webhook & create deploy/ directory (for easy deploy to Firebase)                            |
| `$ npm run deploy:backend`  | Cretes deploy/ directory for a backend to transact w/ DialogFlow services (easy deploy to Firebase) |
| `$ npm run deploy:frontend` | Cretes deploy/ directory for a frontend from src/frontend/dist (easy deploy to Firebase)            |

# GW2 API Extended

This repo contains the source code and scripts for the extended GW2 API for tooltip libraries. Unfortunately, the main API is broken on many occasions and nobody bothered to fix any of the issues. This API is a fork of the main API and aims to fix some of the issues and add new features.

## Features

- Hosted on cloudflare in a KV store for global low-latency and high availability
- A second index over names
- **Descriptions**: some traits are missing descriptions. We add the missing ones.
- **Consumables**: all ascended food items miss the stats and descriptions
- **Skills**: a whole bunch of skills of type "bundle" such as tomes are missing
- **Skill/trait facts**: some facts are missing the percent sign

## Usage

- Lookup by name: [https://gw2-api-extended.princeps.workers.dev/v2/skills?ids=healingcloud](https://gw2-api-extended.princeps.workers.dev/v2/skills?ids=healingcloud)
- Patched description: [https://gw2-api-extended.princeps.workers.dev/v2/traits?ids=2071](https://gw2-api-extended.princeps.workers.dev/v2/traits?ids=2071)

## Scripts

- `scripts/fetchAPI.mjs`: Fetches the latest API from the official API and saves it into `data/api`
- `scripts/prepareExtendedAPI.ts`: Prepares and patches the official API and saves it into `data/api-extended`.
- `scripts/uploadKV.ts`: Generates the wrangler files from the api-extended files, which are uploaded to cloudflare. The script prints the commands that need to be executed by hand to fill the stores.

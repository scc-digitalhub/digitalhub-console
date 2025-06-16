# DigitalHub CORE Console

[![license](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/scc-digitalhub/digitalhub-console/LICENSE)
![Status](https://img.shields.io/badge/status-stable-gold)

The DigitalHub Console is the front-end application of [DigitalHub CORE](https://github.com/scc-digitalhub/digitalhub-core?tab=readme-ov-file) and it is distributed as one of its modules. It is a web UI based on React-Admin and backed by the CORE API.

Explore the full documentation at the [link](https://scc-digitalhub.github.io/docs/).

## Quick start

The Console is meant to be deployed and used as part of CORE. In order to run them standalone instead of bootstrapping the whole DigitalHub platform, please refer to the instructions in [CORE README](https://github.com/scc-digitalhub/digitalhub-core/blob/main/README.md).

## Configuration

When deployed as a module of CORE, CORE takes care of configuring the Console. When run independently for testing and developing purposes (see Development section below), the Console can be configured via environment variables.

### Parameters

The following environment variables are supported. Their default values, if any, are specified in ".env.production" and ".env.development" files.

| KEY                       | DESCRIPTION                                         |
| ------------------------- | --------------------------------------------------- |
| PUBLIC_URL                |                                                     |
| VITE_APP_NAME             | App name                                            |
| REACT_APP_VERSION         | Current app version, used to provide docs link      |
| REACT_APP_CONTEXT_PATH    | Sub path for React-Admin router                     |
| REACT_APP_APPLICATION_URL | Console URL (without context path)                  |
| REACT_APP_API_URL         | CORE API url                                        |
| REACT_APP_AUTH_URL        | Authentication server URL                           |
| REACT_APP_LOGIN_URL       | Login endpoint on the authentication server         |
| REACT_APP_ISSUER_URI      | OIDC issuer URI                                     |
| REACT_APP_CLIENT_ID       | OIDC client ID                                      |
| REACT_APP_SCOPE           | OIDC space-separated scopes                         |
| REACT_APP_ENABLE_SOLR     | Whether Solr search is enabled on CORE (true/false) |
| REACT_APP_WEBSOCKET_URL   | Websocket URL for StompJS client                    |

## Development

The Console code is written in Typescript and located in `src` folder, which is structured as follows:

```
├── common
├── components (UI components)
│   ├── buttons
│   ├── charts
│   ├── lineage
│   ├── toolbars
│   ├── upload
│   ├── **/*.tsx (miscellaneous components)
├── contexts (React contexts)
├── controllers (logical controllers)
├── i18n (translations)
│   ├── en
│   │   ├── **/*.json
│   ├── it
│   │   ├── **/*.json
│   ├── english.ts
│   ├── italian.ts
├── jsonSchema
│   ├── **/*.tsx (react-jsonschema-form templates and widgets)
├── layout (everything layout-related)
├── pages
│   ├── account (account page with personal access token components)
│   ├── dashboard (everything dashboard-related)
│   ├── lineage (project lineage)
├── provider (data/language/authentication providers)
├── resources (React-Admin resource definitions)
├── search (everything related to Solr search)
├── App.tsx
├── index.tsx
└── vite-env.d.ts
```

See CONTRIBUTING for contribution instructions.

### Build from source

Running the Console requires:

* Node.js v18 or higher
* Yarn v1.22 or higher

In order to build and run the Console, you first need to clone this repository and install its dependencies:

```sh
git clone https://github.com/scc-digitalhub/digitalhub-console.git
cd digitalhub-console
yarn install
```

You can build the application and start Vite dev server using respectively `yarn build` and `yarn start` commands. Depending on your use case, you can specify a profile to read the configuration from ".env.development", ".env.production" or ".env.localhost" files (e.g., `yarn start:localhost`).

*In production mode, the Console is expected to be embedded in CORE, therefore the configuration URLs in ".env.production" are relative, while in ".env.development" they are absolute.*

### Configuring authentication

No auth:

```
VITE_APP_NAME="DigitalHub"
REACT_APP_VERSION="0.11.0"
REACT_APP_API_URL=http://localhost:8080/api/v1
```

Basic auth:

```
VITE_APP_NAME="DigitalHub"
REACT_APP_VERSION="0.11.0"
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_AUTH_URL=http://localhost:8080/api
REACT_APP_LOGIN_URL=/auth
```

OIDC auth:

```
VITE_APP_NAME="DigitalHub"
REACT_APP_VERSION="0.11.0"
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_AUTH_URL=http://localhost:8080/api
REACT_APP_ISSUER_URI=<your_oidc_issuer_uri>
REACT_APP_CLIENT_ID=<your_oidc_client_id>
REACT_APP_SCOPE="openid profile email user.roles.me"
REACT_APP_LOGIN_URL=/auth
REACT_APP_APPLICATION_URL=http://localhost:5173
```

## Security Policy

The current release is the supported version. Security fixes are released together with all other fixes in each new release.

If you discover a security vulnerability in this project, please do not open a public issue.

Instead, report it privately by emailing us at digitalhub@fbk.eu. Include as much detail as possible to help us understand and address the issue quickly and responsibly.

## Contributing

To report a bug or request a feature, please first check the existing issues to avoid duplicates. If none exist, open a new issue with a clear title and a detailed description, including any steps to reproduce if it's a bug.

To contribute code, start by forking the repository. Clone your fork locally and create a new branch for your changes. Make sure your commits follow the [Conventional Commits v1.0](https://www.conventionalcommits.org/en/v1.0.0/) specification to keep history readable and consistent.

Once your changes are ready, push your branch to your fork and open a pull request against the main branch. Be sure to include a summary of what you changed and why. If your pull request addresses an issue, mention it in the description (e.g., “Closes #123”).

Please note that new contributors may be asked to sign a Contributor License Agreement (CLA) before their pull requests can be merged. This helps us ensure compliance with open source licensing standards.

We appreciate contributions and help in improving the project!

## Authors

This project is developed and maintained by **DSLab – Fondazione Bruno Kessler**, with contributions from the open source community. A complete list of contributors is available in the project’s commit history and pull requests.

For questions or inquiries, please contact: [digitalhub@fbk.eu](mailto:digitalhub@fbk.eu)

## Copyright and license

Copyright © 2025 DSLab – Fondazione Bruno Kessler and individual contributors.

This project is licensed under the Apache License, Version 2.0.
You may not use this file except in compliance with the License. Ownership of contributions remains with the original authors and is governed by the terms of the Apache 2.0 License, including the requirement to grant a license to the project.

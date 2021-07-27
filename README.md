<p align="center">
    <img src="public/assets/icons/flamingo.svg" />
    <h2 align="center">Tweeter</h2>
    <p align="center">Twitter-inspired web platform written in TypeScript, NodeJS, Pug, MongoDB and socket.io.</p>
</p>
<p align="center">
    <img alt="Build Passing" src="https://github.com/don-tay/tweeter/actions/workflows/build.yaml/badge.svg" />
    <a href="https://lgtm.com/projects/g/don-tay/tweeter/alerts/"><img alt="Total alerts" src="https://img.shields.io/lgtm/alerts/g/don-tay/tweeter.svg?logo=lgtm&logoWidth=18"/></a>
    <a href="https://lgtm.com/projects/g/don-tay/tweeter/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/don-tay/tweeter.svg?logo=lgtm&logoWidth=18"/></a>
</p>

## Getting started

To run the app locally:

1. Set up the global dependencies on your machine
2. Create an environment variable file with the necessary information.

Read on for detailed instructions.

## Global dependencies list

Global dependencies are listed as follows. See sections below for installation instructions for each dependency.

-   Node.js v16.x
-   Yarn 2 (berry)
-   MongoDB 4.4

### NodeJS Runtime Environment

There are 2 methods of downloading the NodeJS runtime environment, as follows:

A. Using nvm (Recommended)

B. From NodeJS website

#### A. Using nvm (Recommended)

See [guide](https://github.com/nvm-sh/nvm#installing-and-updating) for installation instruction. Before running the app, run

```bash
nvm install && nvm use
```

#### B. From NodeJS website

See [guide](https://nodejs.org/en/download/) for installation instruction.

To verify if NodeJS has been setup and running properly, run

```bash
node -v
```

### Yarn Package Manager

Yarn 2 is the recommended package manager for Tweeter. See this [guide](https://yarnpkg.com/getting-started/install) for installation instructions.

### Install dependencies

```bash
yarn install
```

### Setting up MongoDB database

Set up a MongoDB database instance by hosting an instance on MongoDB Atlas. See this [guide](https://docs.atlas.mongodb.com/getting-started/) on setting up.

> **NB**: Take note of your MongoDB instance credentials. It will be added to the environment variable file in the next step.

## Environment variable file

1. Create a new file in the repo `config/.env`
2. Add the following variables and values to the new file in the following format:

```bash
Variable1=Value1
Variable2=Value2
....
```

| Variable       | Value                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NODE_ENV       | production                                                                                                                                                  |
| PORT           | 5000                                                                                                                                                        |
| MONGO_URI      | Copy your MongoDB instance credentials here (eg. mongodb+srv://**_user_**:**_password_**!@main.xhohk.mongodb.net/**_db_name_**?retryWrites=true&w=majority) |
| SESSION_SECRET | _Add any random characters here_                                                                                                                            |

## Running the app

Once all global dependencies are set up and the `config/.env` file is populated, the app can be run in the following ways:

```bash
# Run in development
yarn dev

# Build and run in production
yarn build && yarn start
```

## License

License: MIT

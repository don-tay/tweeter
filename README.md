<p align="center">
    <span>
        <img src="public/assets/flamingo.svg"></img> 
        <h2 align="center">Tweeter</h2>
    </span>
    <p align="center">Twitter-inspired web platform written in TypeScript, NodeJS, Pug, MongoDB and socket.io.</p>
</p>
<p align="center">
    <img alt="Build Passing" src="https://github.com/don-tay/tweeter/actions/workflows/build.yaml/badge.svg" />
</p>

## Getting started

### Global dependencies list

Global dependencies are listed as follows. See sections below for installation instructions for each dependency.

-   NodeJS v14.16.1
-   Yarn 2 (berry)
-   MongoDB 4.4

### NodeJS Runtime Environment

There are 2 methods of downloading the NodeJS runtime environment, as follows:

1. Using nvm
2. Direct from NodeJS website

To verify, if NodeJS has been setup, run

```bash
node -v
```

#### Using nvm

See [guide](https://github.com/nvm-sh/nvm#installing-and-updating) for installation instruction. Before running the app, run

```bash
nvm install && nvm use
```

#### Direct from NodeJS website

See [guide](https://nodejs.org/en/download/) for installation instruction.

### Yarn Package Manager

Yarn 2 is the recommended package manager for Tweeter. See this [guide](https://yarnpkg.com/getting-started/install) for installation instructions.

### Install dependencies

```bash
yarn install
```

### Setting up MongoDB database

The recommended way of setting up the MongoDB database is to host an instance on MongoDB Atlas. See this [guide](https://docs.atlas.mongodb.com/getting-started/).

Then add your MongoDB instance credentials to `MONGO_URI` in the `config/.env` file.

### Running the app

Once all global dependencies are set up, the app can be run in the following ways:

```bash
# Run in development
yarn dev

# Build and run in production
yarn build && yarn start
```

## License

License: MIT

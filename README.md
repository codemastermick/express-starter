# express-starter

This project serves as a batteries included backend server, ready to use out of the box. Just add your own functionality on top!

![GitHub](https://img.shields.io/github/license/codemastermick/express-starter)
![GitHub repo size](https://img.shields.io/github/repo-size/codemastermick/express-starter)
![GitHub issues](https://img.shields.io/github/issues/codemastermick/express-starter?color=yellow)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/codemastermick/express-starter)
![GitHub package.json version](https://img.shields.io/github/package-json/v/codemastermick/express-starter)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/96b12a825e6846a1aa3a4fef8aca9615)](https://www.codacy.com/gh/codemastermick/express-starter/dashboard?utm_source=github.com&utm_medium=referral&utm_content=codemastermick/express-starter&utm_campaign=Badge_Grade)

## :warning: Please note that this project is still in heavy development and is not recommended for production applications yet

<hr>

## Feature Roadmap

| Feature                |    Implemented     | In Progress | Backburner |
| ---------------------- | :----------------: | :---------: | :--------: |
| Authentication         | :heavy_check_mark: |             |            |
| Role Based Permissions | :heavy_check_mark: |             |            |
| Mongo Database         | :heavy_check_mark: |             |            |
| Full Test Coverage     |                    |  :warning:  |            |
| Changelog Generation   |                    |             |    :o:     |
| Git Hooks              |                    |             |    :o:     |
| CI Support             |                    |             |    :o:     |
| Commitizen Support     |                    |             |    :o:     |
| CLI Tool               |                    |             |    :o:     |
| MySQL Database         |                    |             |    :o:     |
| SQLite Database        |                    |             |    :o:     |

:heavy_check_mark: - implemented

:warning: - not fully ready

:o: - not yet started

<hr>

## Getting Started

To get started with the project, clone the repository and then install the dependencies:

```bash
git clone https://github.com/codemastermick/express-starter.git
cd express-starter
npm i
```

Now you will need to set up your environment variables. This can be done easily by copying the file `.env.example` and renaming it to `.env`. A sample configuration is below:

```bash
NODE_ENV=development
APP_NAME=my-cool-backend-app
PORT=3000
JWT_SECRET=My!@!Se3cr8tH4sh3
DB_CONNECTION_STRING=mongodb+srv://<USERNAME>:<PASSWORD>@<HOSTNAME>/<DATABASE>
CODACY_PROJECT_TOKEN=<PASTE-YOUR-CODACY-TOKEN-HERE>
```

## Development[^1]

Running the development server will build the application, then start it and watch for any changes to the codebase, reloading the server when changes are detected:

```bash
npm run dev
```

## Testing[^2]

This project has a full test environment set up and ready to use, complete with code coverage reporting:

```bash
npm run test          # run all tests
npm run test:coverage # run all tests and generate coverage reports
```

## Building[^3]

The project can be built in development[^4] mode or production[^5] mode easily:

```bash
npm run build      # build the project in development mode
npm run build:prod # build the project in production mode
```

## Debugging

**(PRODUCES A LOT OF OUTPUT)**

The project includes a debugger that can be used to log statements in a development environment only, without the need to remove the code before building it for production:

```bash
npm run dev:debug   # start development server in debug mode
npm run start:debug # start production server in debug mode
npm run test:debug  # run tests in debug mode
```

### Footnotes

[^1]: Development server powered by [Nodemon](https://nodemon.io)
[^2]: Testing suite is powered by [Mocha](https://mochajs.org), [Chai](https://www.chaijs.com), and [Supertest](https://github.com/visionmedia/supertest#readme)
[^3]: Building is done with [Webpack](https://webpack.js.org)
[^4]: Development mode does not minify the code and uses inline source maps
[^5]: Production mode will minify the codebase, as well as move source maps out to separate files

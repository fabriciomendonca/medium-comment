# Medium comment API

This is a NodeJS + Express + MongoDB API for the app that uses the Javascript Range API to implements a simple version of the Medium's text highlight and comment feature.

See the real deal
https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f

Demo
https://boiling-beach-42579.herokuapp.com/

The API is served from a Heroku hosted NodedJS + Exprexx + MongoDB RESTFul API.

Front end project
https://github.com/fabriciomendonca/medium-comment-react

## Installation

You will need [NodeJS](https://nodejs.org/). 
Version used in this project: 6.9.2

```
git clone https://github.com/fabriciomendonca/medium-comment-api.git
cd medium-comment-api
npm install
```

## Running scripts

### Start

Starts the API server

```
npm start
```

### Development

Runs the nodemon command for watch server changes

```
npm server:dev
```

### Testing

#### Run the tests

Runs the tests using mocha, expect and supertes.

```
npm test
```

#### Watch the tests (Remote API)

Watches the tests while writing them.

```
npm run local:test:watch
```


# Obsidian Framework

[![Build Status](https://travis-ci.org/wanadev/obsidianjs.svg?branch=master)](https://travis-ci.org/wanadev/obsidianjs)


## Running Linter and Tests

To run the linter:

    npx eslint .

To run all tests:

    npm test

To run all test of a specific module:

    npm test modules/my-module/

To only run test on changed files:

    npm test -- -o


## Build Documentation

### Linux

    apt install virtualenv
    npm run build-doc

### Windows

* Download Python https://www.python.org/downloads/
* Install Python, don't forget to check the checkbox to add path variables to windows
* Open shell as an administrator
* run `pip install virtualenv`

You can now run the following command to build doc:

    npm run build-doc

## Generate TS types

`npx tsc -p ./obsidian`

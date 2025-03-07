# SimpleNight Playwright Test

## Setup
From the project root run the following:
```
npm install
```
Then install the playwright browsers with:
```
npx playwright install
```
If you run into trouble running after that, you may need the playwright system dependencies:
```
npx playwright install-deps
```

## Environment Variables
If you would like to specify what environment you would like the tests to run in, you can set a `TEST_ENVIRONMENT` environment variable that would be used in the baseURL of the tests. For example `TEST_ENVIRONMENT="development"` will set the baseURL to "https://development.simplenight.com/". If the environment variable is not set the baseURL will default to "https://app.simplenight.com/"

The easiest way to set this environment variable would be to create a .env file in the project root containing the following:
```
TEST_ENVIRONMENT = your_env
```

## Running tests
To run tests run the following command:
```
npm run test
```
To run the tests in playwright UI-Mode run:
```
npm run test:ui
```
By default, tests will be run in Chromium, Firefox, and Webkit browsers.

## Write-up
There are several things that could be improved or refactored, and I did my best to note those in code comments. 
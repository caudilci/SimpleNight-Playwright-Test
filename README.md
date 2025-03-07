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
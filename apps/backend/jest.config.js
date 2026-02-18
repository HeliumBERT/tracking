/** @type {import('ts-jest').JestConfigWithTsJest} */


// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: '.env.test',
});

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/tests/integration/**/*.test.ts"
  ],
  globalSetup: "<rootDir>/tests/helpers/globalSetup.ts",
  modulePaths: [
    "<rootDir>",
    "<rootDir>/src"
  ],
  moduleNameMapper: {
      "^@src(/.+)$": "<rootDir>/src$1",
      "^@apps$": "<rootDir>/src/global/apps"
  },
  moduleDirectories: [
    "node_modules",
    "src"
  ],
};
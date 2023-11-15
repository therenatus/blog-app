module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testRegex: ".e2e.js$",
  testEnvironmentOptions: {
    port: 8888,
  },
};

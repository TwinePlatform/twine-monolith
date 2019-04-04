module.exports = {
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    "<rootDir>/platform",
    "<rootDir>/plugins",
    "<rootDir>/node_modules",
    "<rootDir>/www/cordova-files",
    "<rootDir>/www/lib",
    "<rootDir>/www/js/libs",
  ],
  errorOnDeprecated: true,
  testPathIgnorePatterns: [
    "<rootDir>/platform",
    "<rootDir>/plugins",
    "<rootDir>/node_modules",
    "<rootDir>/www/cordova-files",
    "<rootDir>/www/lib",
    "<rootDir>/www/js/libs",
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'node'
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  verbose: true,
};

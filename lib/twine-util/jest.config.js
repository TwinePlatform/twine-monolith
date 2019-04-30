module.exports = {
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
  errorOnDeprecated: true,
  testPathIgnorePatterns: [
    '<rootDir>/bin',
    '<rootDir>/build/',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  testEnvironment: 'node',
  testRegex: '__tests__\/.*\.(test|test\.unit)\.(tsx?|jsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  verbose: true,
};

module.exports = {
  coverageDirectory: '<rootDir>/coverage/integration',
  errorOnDeprecated: true,
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/tests/utils/',
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
  testRegex: '.*\.test\.integration\.(tsx?|jsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  verbose: false,
};

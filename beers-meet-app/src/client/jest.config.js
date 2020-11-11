module.exports = {
  rootDir: '../..',
  roots: ['<rootDir>/src/client'],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/client/jest-setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/client/tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
  collectCoverageFrom: ['<rootDir>/src/client/app/**/*.{ts,js,jsx}'],
  coverageDirectory: '<rootDir>/coverage/client',
  coverageReporters: ['html', 'lcov', 'text']
};

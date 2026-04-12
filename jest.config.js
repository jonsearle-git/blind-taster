module.exports = {
  projects: [
    {
      displayName: 'server',
      testMatch: ['<rootDir>/src/party/__tests__/**/*.test.ts'],
      transform: { '^.+\\.ts$': 'ts-jest' },
    },
  ],
};

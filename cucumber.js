module.exports = {
  default: {
    require: ['tests/bdd/steps/**/*.ts'],
    requireModule: [
      'ts-node/register',
      'tsconfig-paths/register',
    ],
    format: ['progress'],
    paths: ['tests/bdd/features/**/*.feature'],
  },
}

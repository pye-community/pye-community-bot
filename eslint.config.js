const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  ignores: [
    'packages/**/*/dist',
    'packages/**/*/lib',
    'apps/**/*/dist',
  ],
})

module.exports = {
  //lintOnSave: process.env.NODE_ENV !== 'production',
  root: true,
  env: {
    'node': true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    'parser': 'babel-eslint'
  },
  rules: {
    'no-unused-vars': 1,
    'no-debugger': 1,
    'no-constant-condition': 1,
    'vue/no-unused-components': 1,
  }
}

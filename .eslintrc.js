// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // "semi": [2, "always"],
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 关闭函数括号前的空格验证
    'space-before-function-paren': 0,
    'no-mixed-spaces-and-tabs': 'off',
    'no-tabs': 'off',
    // node中不能使用__dirname或__filename做路径拼接
    // "no-path-concat": 0,
    //函数调用时 函数名与()之间不能有空格
    // "no-spaced-func": 2,
    'space-before-function-paren': [0, 'always'],
    // 句尾可以加 ;
    'semi': ['error', 'always']
  }
}

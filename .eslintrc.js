module.exports = {
  extends: [
    'plugin:@wide-web/typescript',
    'plugin:@wide-web/react',
    'plugin:@wide-web/node',
    'plugin:@wide-web/prettier',
  ],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-warning-comments': 'off',
    '@shopify/jsx-no-hardcoded-content': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};

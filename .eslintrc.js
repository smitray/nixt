module.exports = {
  root: true,
  plugins: ['prettier', '@typescript-eslint', 'import', 'jest', 'promise'],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  overrides: [
    {
      files: '*.js',
      extends: ['eslint-config-airbnb/base', 'prettier'],
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./packages/**/tsconfig.json'],
      },
      settings: {
        'import/extensions': ['.js', '.ts'],
        'import/resolver': {
          typescript: {
            project: ['packages/**/tsconfig.json'],
          },
          node: {
            extensions: ['.js', '.ts'],
          },
        },
      },
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:import/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/recommended',
        'prettier/@typescript-eslint',
        'prettier',
        // 'prettier/react',
      ],
      rules: {
        'class-methods-use-this': [0],
        'unicorn/no-useless-undefined': 'off',
        // 'import/no-cycle': 'off',
      },
    },
  ],
};

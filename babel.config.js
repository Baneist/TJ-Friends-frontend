module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      [
        'module-resolver',
        {
          alias: {
            '@navigators': './src/navigators',
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@config': './src/config',
            '@assets': './src/assets',
            '@reduxCore': './src/reduxCore',
          },
        },
      ],
    ],
  };
};

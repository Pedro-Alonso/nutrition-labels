module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Reanimated 4 / RN 0.85: o plugin de worklets vem de react-native-worklets.
    // Deve ser o ÚLTIMO plugin.
    plugins: ['react-native-worklets/plugin'],
  };
};

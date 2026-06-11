const { withGradleProperties } = require('@expo/config-plugins');

// AGP refuses to build when the project path has non-ASCII characters
// (e.g. accented characters from this repo's parent folder names).
// This disables that check, since the build works fine in practice.
module.exports = function withAndroidPathCheck(config) {
  return withGradleProperties(config, (config) => {
    config.modResults.push({
      type: 'property',
      key: 'android.overridePathCheck',
      value: 'true',
    });
    return config;
  });
};

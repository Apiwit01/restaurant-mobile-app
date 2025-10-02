module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './',
          },
        },
      ],
      // --- ลบบรรทัด 'expo-router/babel' ที่เลิกใช้แล้วออกไป ---
    ],
  };
};
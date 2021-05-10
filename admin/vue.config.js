const Timestamp = new Date().getTime();

module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    output: {
      filename: `[name].[hash].js`,
      chunkFilename: `[name].[hash].js`,
    },
  },
  devServer: {
    port: 8080,
  },
};

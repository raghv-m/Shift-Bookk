module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps
      webpackConfig.devtool = false;
      
      // Remove source-map-loader
      if (webpackConfig.module && webpackConfig.module.rules) {
        webpackConfig.module.rules = webpackConfig.module.rules
          .filter(rule => !(rule.use && rule.use.some && rule.use.some(use => 
            use && typeof use === 'object' && use.loader && use.loader.includes('source-map-loader')
          )));
      }
      
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.fallback = {
            ...webpackConfig.resolve.fallback,
            crypto: false,
            buffer: false,
            stream: false,
          };
          return webpackConfig;
        },
      },
      options: {},
    },
  ],
}; 
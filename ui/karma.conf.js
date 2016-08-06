// Karma configuration
// Generated on Tue Jul 19 2016 11:16:09 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-as-promised', 'chai-sinon'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      './test/**/*.spec.ts',
      './test/**/*.spec.tsx',
      './test/**/*Test.ts',
      './test/**/*Test.tsx',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.ts': ['webpack', 'sourcemap'],
      'src/**/*.tsx': ['webpack', 'sourcemap'],
      'test/**/*.ts': ['webpack', 'sourcemap'],
      'test/**/*.tsx': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'source-map',
      resolve: {
	// Add '.ts' and '.tsx' as resolvable extensions.
	extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".json"],
      },
      module: {
	loaders: [
	  // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
	  { test: /\.tsx?$/, loader: "babel-loader?presets[]=es2015!ts-loader", exclude: /node_modules/ },

	  // https://github.com/airbnb/enzyme/issues/47
	  { test: /\.json$/, loader: 'json' }
	],
        preLoaders: [
          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          { test: /\.js$/, loader: "source-map-loader" }
        ]
      },
      externals: {
	'react/addons': true,
	'react/lib/ExecutionEnvironment': true,
	'react/lib/ReactContext': true,
      },
    },
    webpackMiddleware: {
      stats: 'errors-only',
    },

    plugins: [
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai-sinon',
      'karma-chai-as-promised'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

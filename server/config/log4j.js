module.exports = {
  appenders: {
    'STDOUT': {
      type: 'stdout'
    },
    // 'FILE_ALL': {
    //     type: 'file',
    //     filename: path.resolve(__dirname, './../log/blog.log'),
    //     maxLogSize: 10485760,
    //     backups: 10
    // }
  },
  categories: {
    default: {
      appenders: ['STDOUT'],
      level: 'debug'
    }
  }
};

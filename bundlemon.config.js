module.exports = {
  baseDir: './dist',
  reportOutput: [
    [
      'github-pr',
      {
        statusCheck: true,
        prComment: true,
      }
    ]
  ],
  files: [
    {
      path: 'js/app.<hash>.js',
      maxPercentIncrease: 40,
      maxSize: '50kb',
    },
    {
      path: 'js/chunk-vendors.<hash>.js',
      maxPercentIncrease: 40,
      maxSize: '1000kb',
    },
    {
      path: 'css/app.<hash>.css',
      maxPercentIncrease: 40,
      maxSize: '300kb',
    },
  ]
}

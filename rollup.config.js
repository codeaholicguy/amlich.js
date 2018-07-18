import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import cleanUp from 'rollup-plugin-cleanup'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs'
    },
    {
      file: 'lib/index.es.js',
      format: 'es'
    }
  ],
  plugins: [
    cleanUp(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'env',
          {
            targets: {
              node: 'current'
            },
            modules: false
          }
        ]
      ],
      plugins: [
        'add-module-exports',
        'transform-object-rest-spread',
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-export-extensions'
      ]
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**', // Default: undefined
      sourceMap: false // Default: true
    })
  ]
}

import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'bin/commander.js',
  output: {
    file: 'dist/gat.js',
    format: 'cjs',
  },
  plugins: [
    commonjs({
      exclude: ['node_modules'],
      extensions: ['.js'],
    }),
  ]
}

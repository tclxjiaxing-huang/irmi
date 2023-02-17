import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'bin/commander.js',
  output: {
    file: 'dist/irmi.js',
    banner: '#!/usr/bin/env node',
    format: 'cjs',
  },
  plugins: [
    commonjs({
      exclude: ['node_modules'],
    }),
  ]
}

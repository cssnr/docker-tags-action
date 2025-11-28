import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

// noinspection JSUnusedGlobalSymbols
export default {
    input: 'src/index.ts',
    output: {
        esModule: true,
        file: 'dist/index.js',
        format: 'esm',
    },
    plugins: [commonjs(), nodeResolve({ preferBuiltins: true }), typescript()],
}

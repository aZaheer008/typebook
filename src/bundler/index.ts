import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';
import { fetchPlugin } from '../plugins/fetch-plugin';

export default async (rawcode : string) => {
  await esbuild.initialize({
    wasmURL: '/esbuild.wasm',
  }).then(() => {
    console.log("Esbuild initialized")
  });

  const result = await esbuild.build({
    entryPoints : ['index.js'],
    bundle: true,
    write: false,
    plugins: [
      unpkgPathPlugin(),
      fetchPlugin(rawcode)],
    define : {
      'process.env.NODE_ENV':'"production"',
      global:'window'
    }
  });

  return result.outputFiles[0].text;
};
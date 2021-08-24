import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

let connectionEstablished = false;

const bundle =  async (rawcode : string) => {
  if (!connectionEstablished){
    await esbuild.initialize({wasmURL: '/esbuild.wasm'});
  }
  try {
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
      },
      jsxFactory : '_React.createElement',
      jsxFragment : '_React.Fragment'
    });
    if (!connectionEstablished){
      if (result.outputFiles[0].text){
        connectionEstablished = true;
      }
    }
    return {
      code : result.outputFiles[0].text,
      err : ''
    };
  } catch (err){
    return {
      code :'',
      err: err.message
    };
  }
};

export default bundle;
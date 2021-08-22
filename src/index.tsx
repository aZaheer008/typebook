import * as esbuild from 'esbuild-wasm';
import { useState , useEffect } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {

  const [input, setInput] = useState('');
  const [code ,setCode] = useState('');

  const onClick = async () => {
    console.log(input);
 
    // let result = await esbuild.transform(input, {
    //   loader:'jsx',
    //   target:'es2015'
    // });

    const result = await esbuild.build({
      entryPoints : ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define : {
        'process.env.NODE_ENV':'"production"',
        global:'window'
      }
    });
    console.log("----result----",result)
 
    setCode(result.outputFiles[0].text);
  };

  useEffect(() => {
    esbuild.initialize({
      wasmURL: '/esbuild.wasm',
    }).then(() => {
      console.log("Esbuild initialized")
    });
  },[])
  
  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
};

ReactDOM.render(<App />,document.querySelector('#root'));
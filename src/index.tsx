import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useState , useEffect } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';
import { useRef } from 'react';

const App = () => {

  const ref= useRef<any>();
  const iframe= useRef<any>();
  const [input, setInput] = useState('');

  const onClick = async () => {
    console.log(input);
    iframe.current.srcdoc = html;
    const result = await esbuild.build({
      entryPoints : ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input)],
      define : {
        'process.env.NODE_ENV':'"production"',
        global:'window'
      }
    });
    console.log("----result----",result)
    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text,'*');
    console.log("-----iframe---",iframe);
  };

  const html = `
  <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message',(event) => {
          console.log("zaheer",event.data)
          try {
            eval(event.data);
          } catch (err){
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          }
        },false);
      </script>
    </body>
  </html>
  `;

  useEffect(() => {
    esbuild.initialize({
      wasmURL: '/esbuild.wasm',
    }).then(() => {
      console.log("Esbuild initialized")
    });
  },[])
  
  return (
    <div>
      <CodeEditor 
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe title="preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
    </div>
  )
};

ReactDOM.render(<App />,document.querySelector('#root'));
import './code-editor.css';
import './syntax.css';
import MonacoEditor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useState } from 'react';

interface CodeEditorProps {
  initialValue : string;
  onChange(value : string):void;
}

const CodeEditor : React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  // console.log("----initialValue---",initialValue)
  const [editorText, setEditorText] = useState(initialValue);
  const onChangeText = (value: any, monacoEditor:any) => {
    // console.log("----value---",value)
    setEditorText(value);
    onChange(value);
  }

  const onFormatClick = () => {
    const unformatted = editorText
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins:[parser],
      useTabs:false,
      semi: true,
      singleQuote:true
    }).replace(/\$/,'');
    onChange(formatted);
    setEditorText(formatted);
  }
  return (
    <div className="editor-wrapper">
      <button className="button button-format is-primary is-small" onClick={onFormatClick}>Format</button>
      <MonacoEditor
        onChange={onChangeText}
        value={editorText}
        theme="vs-dark" 
        language="javascript" 
        height="100%" 
        options={{
          wordWrap: 'on',
          minimap : { enabled : false },
          showUnused : false,
          folding : false,
          lineNumbersMinChars : 3,
          fontSize : 16 ,
          scrollBeyondLastLine : false,
          automaticLayout : true
        }}
      />
    </div>
  )
};

export default CodeEditor;
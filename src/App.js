import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...\nconst counter = 0;',
      textarea: '',
      addedText: null
    }
  }

  editorDidMount = (editor, monaco) => {
    editor.focus();
    
    this.editor = editor;
    this.monaco = monaco;
  }

  addCodeLensProvider = () => {
    const {addedText} = this.state;

    const selectChanges = (command) => this.editor.addCommand(1, () => {
      const {addedText} = this.state;
      let newText;
  
      if (command === 'current') {
        newText = addedText.oldValue;
      } else if (command === 'incoming') {
        newText = addedText.newValue;
      }
  
      this.setState({ code: newText, addedText: null });
    }, '');

    this.provider = this.monaco.languages.registerCodeLensProvider('javascript', {
      provideCodeLenses: function (model, token) {
        console.log('provideCodeLenses')
        return  [
          {
              range: { startLineNumber: 1 },
              id: 1,
              command: {
                  id: selectChanges('current'),
                  title: 'Accept Current Text',
              },
          }, {
              range: { startLineNumber: addedText.startPosition },
              id: 1,
              command: {
                  id: selectChanges('incoming'),
                  title: 'Accept Incoming Text',
              },
          }
        ];
      },
      resolveCodeLens: function (model, codeLens, token) {
        return codeLens;
      },
    });
  }

  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }

  onChangeInput = (e) => {
     this.setState({textarea: e.target.value})
  }

  onAddText = () => {
    const {code, textarea, addedText} = this.state;
    const newCode = `${code}\n${textarea}`
    this.setState({
      code: newCode, 
      textarea: '', 
      addedText: { 
        startPosition: code.split('\n').length + 1, oldValue: code, newValue: textarea
      }
    })
  }

  render() {
    const {code, textarea, addedText} = this.state;
    const options = {
      selectOnLineNumbers: true
    };

    if(addedText) {
      this.addCodeLensProvider();
    }
    if(!addedText && this.provider){
      this.provider.dispose();
      this.provider = null;
    }

    return (
      <div style={{display: 'flex'}}>
        <MonacoEditor
          width="800"
          height="600"
          language="javascript"
          theme="vs-dark"
          value={code}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
        <div style={{marginLeft: '30px'}}>
          <textarea style={{height: '100px', width: '300px'}} value={textarea} onChange={this.onChangeInput}/>
          <button onClick={this.onAddText}>Add</button>
        </div>
      </div>
    );
  }
}

export default App;

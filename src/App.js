import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import './App.css';

class App extends Component {
  decorator = [];

  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...\nconst counter = 0;',
      textarea: '',
      addedText: null
    }
  }

  componentDidUpdate(prevProps, prevState){
    const {addedText} = this.state;

    if(!prevState.addedText && addedText){
      this.decorator = this.editor.deltaDecorations(this.decorator, [{
        range: new monaco.Range(1,1,addedText.startPosition-1,1),
        options: {
          isWholeLine: true,
          className: 'greenDecorator',
        }
      }, {
        range: new monaco.Range(addedText.startPosition,1, addedText.startPosition + addedText.newValue.split('\n').length,1),
        options: {
          isWholeLine: true,
          className: 'blueDecorator',
        }
      }]);
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

    // this.decorator = this.editor.deltaDecorations(this.decorator, [{
    //   range: new monaco.Range(1,1,addedText.startPosition-1,1),
    //   options: {
    //     isWholeLine: true,
    //     className: 'greenDecorator',
    //   }
    // }, {
    //   range: new monaco.Range(addedText.startPosition,1, addedText.startPosition,1),
    //   options: {
    //     isWholeLine: true,
    //     className: 'blueDecorator',
    //   }
    // }]);

    this.provider = this.monaco.languages.registerCodeLensProvider('javascript', {
      provideCodeLenses: function (model, token) {
        return  [
          {
              range: { startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1},
              command: {
                  id: selectChanges('current'),
                  title: 'Select Current Text',
              },
          }, {
              range: { startLineNumber: addedText.startPosition, endLineNumber: addedText.startPosition, startColumn: 1, endColumn: 1 },
              command: {
                  id: selectChanges('incoming'),
                  title: 'Select Incoming Text',
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
    const {code, textarea} = this.state;
    this.setState({
      code: `${code}\n${textarea}`, 
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
console.log('addedText', addedText, this.provider);
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

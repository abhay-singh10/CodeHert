import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

const LANGUAGES = [
  { label: 'C++', value: 'cpp' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
];

const BOILERPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
  python: `def main():
    # Write your code here
    pass

if __name__ == '__main__':
    main()
`,
  java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`
};

const CodeEditor = ({ onRun, onSubmit, code, setCode, language, setLanguage, extraButton }) => {
  // Set C++ boilerplate on first mount if code is empty
  useEffect(() => {
    if (!code && language === 'cpp') {
      setCode(BOILERPLATES['cpp']);
    }
  }, []); // Only run on mount

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(BOILERPLATES[lang]);
  };

  return (
    <div className="code-editor-card">
      {/* Header Bar */}
      <div className="code-editor-header" style={{ padding: '0.25em 0.5em', minHeight: '32px', fontSize: '0.95em' }}>
        <span className="code-editor-title" style={{ fontSize: '1em' }}>
          <i className="bi bi-code-slash"></i>Code Editor
        </span>
        <select
          className="code-editor-select"
          value={language}
          onChange={e => handleLanguageChange(e.target.value)}
          style={{ fontSize: '0.95em', padding: '0.2em 0.5em', height: '28px' }}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>
      {/* Monaco Editor */}
      <div className="code-editor-body">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "off",
            fontFamily: 'Fira Mono, monospace',
            lineNumbers: 'on',
            roundedSelection: true,
            scrollbar: { vertical: 'auto', horizontal: 'auto' },
          }}
        />
      </div>
      {/* Run/Submit/AI Review Buttons */}
      <div className="code-editor-footer" style={{ padding: '0.25em 0.5em', minHeight: '32px', fontSize: '0.95em' }}>
        <button className="btn-run" style={{ fontSize: '0.95em', padding: '0.3em 1em' }} onClick={() => onRun(code, language)}>
          <i className="bi bi-play-fill"></i>Run
        </button>
        <button className="btn-submit" style={{ fontSize: '0.95em', padding: '0.3em 1em' }} onClick={() => onSubmit(code, language)}>
          <i className="bi bi-upload"></i>Submit
        </button>
        {extraButton && React.cloneElement(extraButton, { style: { ...(extraButton.props.style || {}), fontSize: '0.95em', padding: '0.3em 1em' } })}
      </div>
    </div>
  );
};

export default CodeEditor; 
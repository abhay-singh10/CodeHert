import React, { useState } from 'react';
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
  java: `
public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`
};

const CodeEditor = ({ onRun, onSubmit }) => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(BOILERPLATES['cpp']);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(BOILERPLATES[lang]);
  };

  return (
    <div className="card shadow-lg border-0 rounded-4" style={{ minHeight: 420, background: '#23272f' }}>
      {/* Header Bar */}
      <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white rounded-top-4" style={{ borderBottom: '1px solid #444' }}>
        <span className="fw-bold">
          <i className="bi bi-code-slash me-2"></i>Code Editor
        </span>
        <select
          className="form-select form-select-sm w-auto bg-dark text-white border-secondary"
          value={language}
          onChange={e => handleLanguageChange(e.target.value)}
          style={{ minWidth: 100 }}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>
      {/* Monaco Editor */}
      <div className="card-body p-0" style={{ background: '#23272f' }}>
        <MonacoEditor
          height="300px"
          language={language}
          value={code}
          onChange={setCode}
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
      {/* Run/Submit Buttons */}
      <div className="card-footer bg-dark d-flex justify-content-end gap-2 rounded-bottom-4">
        <button className="btn btn-outline-primary px-4" onClick={() => onRun(code, language)}>
          <i className="bi bi-play-fill me-1"></i>Run
        </button>
        <button className="btn btn-primary px-4" onClick={() => onSubmit(code, language)}>
          <i className="bi bi-upload me-1"></i>Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor; 
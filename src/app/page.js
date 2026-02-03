'use client';

import Editor from '@monaco-editor/react';
import { ArrowRight, Loader2, Code2, FileCode, Copy, Check, Zap } from 'lucide-react';
import { useState, useRef } from 'react'; 

export default function Home() {
  const [editorValue, setEditorValue] = useState('');
  const [convertedCode, setConvertedCode] = useState('// Hasil migrasi akan muncul di sini...');
  const [isLoading, setIsLoading] = useState(false); // Kita atur loading sendiri
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  // Fungsi Manual Fetch (Lebih Stabil)
  const handleRunConvert = async () => {
    if (!editorValue) return;
    
    setIsLoading(true);
    setConvertedCode('// Processing... (Wait a sec)'); // Kasih feedback ke user

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: editorValue }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);
      
      setConvertedCode(data.result); // Update editor kanan

    } catch (error) {
      console.error("Error:", error);
      setConvertedCode(`// Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Laraview</span>
          </div>
          <button onClick={scrollToEditor} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-all border border-slate-700">
            Try Demo
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Migrate Laravel to <br/> Next.js in Seconds.
        </h1>
        <div className="flex justify-center gap-4">
          <button onClick={scrollToEditor} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">
            Start Migrating <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* EDITOR SECTION */}
      <section ref={editorRef} className="py-10 px-4 md:px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          
          <div className="h-[600px] flex flex-col md:flex-row rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            {/* Kiri: Input */}
            <div className="flex-1 border-r border-slate-700 flex flex-col bg-[#1e1e1e]">
              <div className="bg-[#252526] px-4 py-3 text-xs text-slate-400 font-mono flex items-center gap-2 border-b border-slate-700">
                <FileCode size={14} className="text-red-500" /> Input: Laravel Controller (PHP)
              </div>
              
              <Editor
                height="100%"
                defaultLanguage="php"
                theme="vs-dark"
                value={editorValue}
                onChange={(value) => setEditorValue(value || '')} 
                options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
              />
            </div>

            {/* Kanan: Output */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
               <div className="bg-[#252526] px-4 py-3 text-xs text-slate-400 font-mono flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                   <FileCode size={14} className="text-blue-500" /> Output: Server Action (TS)
                </div>
                <div className="flex gap-3">
                   {/* Tombol Run */}
                   <button 
                    onClick={handleRunConvert}
                    disabled={isLoading || !editorValue}
                    className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={12} /> : <Zap size={12} fill="currentColor" />}
                    {isLoading ? 'Processing...' : 'Run Convert'}
                  </button>

                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs hover:text-white transition-colors text-slate-400">
                    {copied ? <Check size={12} className="text-green-500"/> : <Copy size={12}/>}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={convertedCode}
                options={{ minimap: { enabled: false }, fontSize: 14, readOnly: true, padding: { top: 16 } }}
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6 text-center text-slate-500 text-sm">
        Built with ❤️ by Team Lo for Gemini Hackathon
      </footer>
    </div>
  );
}
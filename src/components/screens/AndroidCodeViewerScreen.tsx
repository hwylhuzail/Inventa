import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidFile } from '../../data/androidSourceFiles';
import {
  Code,
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  ExternalLink,
  Smartphone,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface AndroidCodeViewerScreenProps {
  onBack: () => void;
}

export const AndroidCodeViewerScreen: React.FC<AndroidCodeViewerScreenProps> = ({
  onBack
}) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const fallbackCopy = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = selectedFile.content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Fallback copy failed', e);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(selectedFile.content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllBundle = () => {
    const bundleText = ANDROID_PROJECT_FILES.map((f) => {
      return `// ========================================================\n// FILE: ${f.path}\n// ========================================================\n\n${f.content}`;
    }).join('\n\n\n');

    const blob = new Blob([bundleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventa_android_project_bundle_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 pb-12 bg-[#0B0F19] text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Android Studio Kotlin Project</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              com.inventa.app · Jetpack Compose · Room · Target SDK 34
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Copy current file code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium"
            title="Download current file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">File</span>
          </button>
          <button
            onClick={handleDownloadAllBundle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-sm"
            title="Download all Android project files bundle"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Export All Files</span>
          </button>
        </div>
      </div>

      {/* File Tree Selector Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {ANDROID_PROJECT_FILES.map((file) => (
          <button
            key={file.path}
            onClick={() => setSelectedFile(file)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              selectedFile.path === file.path
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 opacity-80" />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      {/* Code Editor Preview Window */}
      <div className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col min-h-[460px]">
        {/* Editor Ribbon */}
        <div className="h-9 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="text-cyan-300 font-medium">{selectedFile.path}</span>
          <span className="text-[10px] uppercase text-slate-500">{selectedFile.category}</span>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-auto font-mono text-[11px] leading-relaxed text-slate-200 select-text">
          <pre className="whitespace-pre">{selectedFile.content}</pre>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-center justify-between">
        <span>Ready for Android Studio Hedgehog / Iguana / Koala import.</span>
        <span className="font-mono text-cyan-400">AGP 8.4+</span>
      </div>
    </div>
  );
};

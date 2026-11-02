import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import {
  Download,
  Trash2,
  FileCode,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

interface DataExportScreenProps {
  onDataWiped: () => void;
  onBack: () => void;
}

export const DataExportScreen: React.FC<DataExportScreenProps> = ({
  onDataWiped,
  onBack
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [showConfirmWipe, setShowConfirmWipe] = useState(false);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const jsonStr = StorageService.exportAllDataAsJson();
    downloadFile(jsonStr, `inventa_vault_${Date.now()}.json`, 'application/json');
    setDownloadNotice('JSON archive downloaded successfully.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleExportMarkdownBundle = () => {
    const inventions = StorageService.getInventions();
    const bundle = inventions
      .map((inv) => StorageService.exportInventionAsMarkdown(inv))
      .join('\n\n\n========================================\n\n\n');
    downloadFile(bundle, `inventa_engineering_reports_${Date.now()}.md`, 'text/markdown');
    setDownloadNotice('Markdown engineering bundle downloaded successfully.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleExecuteWipe = () => {
    StorageService.wipeAllData();
    setShowConfirmWipe(false);
    onDataWiped();
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 pb-12 bg-[#0B0F19] text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Data Export & Account Management
        </h2>
        <p className="text-xs text-slate-400">
          Full portability. Download, backup, or purge your laboratory records.
        </p>
      </div>

      {downloadNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Export Options */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Export Vault Records
        </h3>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <FileCode className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Complete JSON Vault Backup
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Raw machine-readable backup containing all inventions, bills of materials, completed milestone checks, and profile settings.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Markdown Engineering Dossier
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Formatted technical reports with prior art vectors, safety warnings, and component budgets suitable for documentation and git repositories.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportMarkdownBundle}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dangerous Account Deletion Zone */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Danger Zone
        </h3>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-rose-200 block">
                  Purge Vault & Reset Account
                </span>
                <p className="text-[11px] text-rose-300/80 leading-relaxed mt-0.5">
                  Irreversibly erases all saved inventions, prototype progress, and chat messages from this device.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmWipe(true)}
              className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold shrink-0 transition-colors"
            >
              Purge Vault
            </button>
          </div>
        </div>
      </div>

      {/* Wipe Confirmation Dialog */}
      {showConfirmWipe && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-rose-800 p-5 space-y-3 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Permanently Erase All Data?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This cannot be undone. All custom inventions, prototype checklists, and experimental notes will be wiped.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmWipe(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteWipe}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

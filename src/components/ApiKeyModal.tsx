import React, { useState, useEffect } from 'react';
import { Key, X, Eye, EyeOff, Info } from 'lucide-react';
import { getStoredConfig, saveStoredConfig, clearStoredConfig } from '../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (configured: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'claude' | 'gemini'>('claude');
  const [model, setModel] = useState('claude-3-5-sonnet-20241022');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getStoredConfig();
      setApiKey(cfg.apiKey);
      setProvider(cfg.provider);
      setModel(cfg.model);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      saveStoredConfig(provider, trimmed, model);
      onSave(true);
    } else {
      clearStoredConfig();
      onSave(false);
    }
    onClose();
  };

  const handleClear = () => {
    clearStoredConfig();
    setApiKey('');
    onSave(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-[#0B3C5D] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#FDB827]" />
            <h3 className="font-bold text-sm">Anthropic Claude / AI Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white text-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Provide your Anthropic API Key to enable{' '}
            <strong>live Claude 3.5 LLM calls</strong> for real-time speech evaluation and dynamic
            worksheet generation.{' '}
            <span className="block text-slate-400 mt-1">
              If blank, ShikshaSaathi AI seamlessly runs in{' '}
              <strong>Realistic Mock Mode</strong> for demos.
            </span>
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Anthropic API Key:
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full text-xs font-mono border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3282B8] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Key stays strictly in your browser sessionStorage.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Model Selection:
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3282B8] cursor-pointer"
            >
              <option value="claude-3-5-sonnet-20241022">
                claude-3-5-sonnet-20241022 (Recommended)
              </option>
              <option value="claude-3-haiku-20240307">
                claude-3-haiku-20240307 (Fast &amp; Low Cost)
              </option>
            </select>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <span>
              Calls use standard header: <code>anthropic-version: 2023-06-01</code> and{' '}
              <code>dangerouslyAllowBrowser: true</code>.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
          >
            Clear Key (Demo Mode)
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-xs text-slate-600 hover:bg-slate-200 font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-xs bg-[#0B3C5D] hover:bg-[#154c74] text-white font-bold px-4 py-1.5 rounded-lg shadow-sm cursor-pointer"
            >
              Save &amp; Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

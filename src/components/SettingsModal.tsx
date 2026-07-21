import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Monitor, Server, AlertCircle, Loader2, ShieldAlert, Cpu, Settings } from 'lucide-react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'motion/react';
import { getEffectiveRpcUrl } from '../contracts/config';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (t: 'dark' | 'light' | 'system') => void;
}

export function SettingsModal({ isOpen, onClose, theme, setTheme }: SettingsModalProps) {
  const [rpcUrl, setRpcUrl] = useState('');
  const [currentActiveRpc, setCurrentActiveRpc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const defaultRpc = 'https://bsc-testnet-rpc.publicnode.com';

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setCurrentActiveRpc(getEffectiveRpcUrl());
      const settingsStr = localStorage.getItem('orvix_settings');
      if (settingsStr) {
        try {
          const settings = JSON.parse(settingsStr);
          setRpcUrl(settings.rpcUrlTestnet || defaultRpc);
        } catch (e) {
          setRpcUrl(defaultRpc);
        }
      } else {
        setRpcUrl(defaultRpc);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const testRpcConnection = async (url: string) => {
    if (!url) return true;
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSave = async (customUrl?: string) => {
    setIsSaving(true);
    setErrorMsg('');

    const targetUrl = (customUrl !== undefined ? customUrl : rpcUrl).trim();

    // Test RPC connectivity
    if (targetUrl) {
      const isValid = await testRpcConnection(targetUrl);
      if (!isValid) {
        setErrorMsg('Failed to connect to RPC URL. Please verify the URL and your network connection.');
        setIsSaving(false);
        return;
      }
    }

    const settingsStr = localStorage.getItem('orvix_settings');
    let settings: any = {};
    if (settingsStr) {
      try {
        settings = JSON.parse(settingsStr);
      } catch (e) {}
    }

    const hasChanged = settings.rpcUrlTestnet !== targetUrl;

    settings = {
      ...settings,
      rpcUrlTestnet: targetUrl
    };
    localStorage.setItem('orvix_settings', JSON.stringify(settings));
    setIsSaving(false);
    onClose();

    if (hasChanged) {
      window.location.reload();
    }
  };

  const handleReset = async () => {
    setRpcUrl(defaultRpc);
    await handleSave(defaultRpc);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-zinc-950/95 dark:bg-zinc-950/95 border border-zinc-800 rounded-3xl w-full max-w-md p-6 sm:p-7 space-y-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold tracking-tight text-zinc-100 font-sans">App Settings</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* RPC Configuration Section */}
            <div className="space-y-4">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" /> RPC Configuration
              </label>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-400 block font-medium">RPC URL</span>
                  <input
                    type="text"
                    value={rpcUrl}
                    onChange={(e) => setRpcUrl(e.target.value)}
                    placeholder="e.g. https://bsc-testnet-rpc.publicnode.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all font-mono"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-400 block font-medium">Current RPC</span>
                  <div className="bg-zinc-900/50 border border-zinc-800/80 p-3 rounded-xl font-mono text-xs text-zinc-300 break-all leading-normal flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    {currentActiveRpc || defaultRpc}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  <button
                    onClick={handleReset}
                    disabled={isSaving}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl font-medium text-xs transition-colors cursor-pointer border border-zinc-800 disabled:opacity-50 text-center"
                  >
                    Reset Default
                  </button>
                  <button
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Network Section (Read-only) */}
            <div className="space-y-3.5 pt-2 border-t border-zinc-900">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" /> Network
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/40 border border-zinc-800/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Current Network</span>
                  <span className="text-sm font-semibold text-zinc-100 block">BSC Testnet</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Current Chain ID</span>
                  <span className="text-sm font-semibold text-zinc-100 block font-mono">97</span>
                </div>
              </div>
            </div>

            {/* Theme Selector Section */}
            <div className="space-y-3.5 pt-2 border-t border-zinc-900">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">Theme Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  disabled={isSaving}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
                  } disabled:opacity-50`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  disabled={isSaving}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
                  } disabled:opacity-50`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button
                  onClick={() => setTheme('system')}
                  disabled={isSaving}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    theme === 'system'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
                  } disabled:opacity-50`}
                >
                  <Monitor className="w-4 h-4" /> System
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Orvix Labs © 2026</span>
              <span className="text-zinc-600">Deterministic V2</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

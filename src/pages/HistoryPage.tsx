import React, { useState } from 'react';
import { Token, Page } from '../types';
import { ExternalLink } from 'lucide-react';
import { getExplorerUrl } from '../contracts/config';


interface HistoryPageProps {
  tokens: Token[];
  searchQuery?: string;
  setCurrentPage?: (p: Page) => void;
  onSelectToken?: (t: Token) => void;
}

export function HistoryPage({ tokens, searchQuery = '' }: HistoryPageProps) {
  const filteredTokens = tokens.filter(t => 
    !searchQuery || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.contract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-[#1e3a5f]/15">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">History</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Tokens that have graduated from Orvix New Alpha.</p>
        </div>
      </div>

      <div className="divide-y divide-[#1e3a5f]/15 border-t border-b border-[#1e3a5f]/15 pb-12">
        {filteredTokens.length > 0 ? (
          filteredTokens.map((t) => {
            const exitReason = t.exitType || 'Major Exchange';
            const bscscanUrl = `${getExplorerUrl()}/address/${t.contract}`;
            const dexscreenerUrl = `https://dexscreener.com/bsc/${t.contract}`;

            return (
              <div key={t.id} className="py-6 first:pt-4 last:pb-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {t.name} <span className="font-mono text-zinc-500 font-normal text-sm">({t.symbol})</span>
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border border-[#1e3a5f]/40 dark:border-[#1e3a5f]/60 text-zinc-700 dark:text-zinc-300">
                      {exitReason}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    Graduated {t.listedAt}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-sm">
                  {exitReason.toLowerCase().includes('v3') ? (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600 dark:text-zinc-400">V3 Migration</span>
                      <span className="text-zinc-400">→</span>
                      <a 
                        href={bscscanUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-500 dark:text-zinc-400 hover:underline inline-flex items-center gap-1 font-mono text-xs"
                      >
                        View Contract <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Listed on Major Exchange</span>
                      <span className="text-zinc-400">→</span>
                      <a 
                        href={bscscanUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-500 dark:text-zinc-400 hover:underline inline-flex items-center gap-1 font-mono text-xs"
                      >
                        Market Pair <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Website</span>
                    <span className="text-zinc-400">→</span>
                    <a 
                      href={bscscanUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-zinc-500 dark:text-zinc-400 hover:underline inline-flex items-center gap-1 font-mono text-xs"
                    >
                      Project Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600 dark:text-zinc-400">DexScreener</span>
                    <span className="text-zinc-400">→</span>
                    <a 
                      href={dexscreenerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-zinc-500 dark:text-zinc-400 hover:underline inline-flex items-center gap-1 font-mono text-xs"
                    >
                      Analytics Pair <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : searchQuery ? (
          <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400 font-sans">
            No history entries found matching your search.
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500 font-medium font-sans">
            No history entries yet
          </div>
        )}
      </div>
    </div>
  );
}

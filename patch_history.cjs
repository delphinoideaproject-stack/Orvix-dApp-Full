const fs = require('fs');
let content = fs.readFileSync('src/pages/HistoryPage.tsx', 'utf-8');

if (!content.includes("import { EmptyState }")) {
  content = content.replace(
    "import { ExternalLink } from 'lucide-react';",
    "import { ExternalLink, SearchX, History } from 'lucide-react';\nimport { EmptyState } from '../components/EmptyState';"
  );
}

const target = `{filteredTokens.length > 0 ? (
        <div className="divide-y divide-[#1e3a5f]/15">`;

const fullReplacement = `{filteredTokens.length > 0 ? (
        <div className="divide-y divide-[#1e3a5f]/15">`;

// I will just use full string replacement.

let targetFull = `{filteredTokens.length > 0 ? (
        <div className="divide-y divide-[#1e3a5f]/15">
          {filteredTokens.map((t) => {
            const exitReason = t.exitType || 'Major Exchange';
            const bscscanUrl = \`\${getExplorerUrl()}/address/\${t.contract}\`;
            const dexscreenerUrl = \`https://dexscreener.com/bsc/\${t.contract}\`;

            return (
              <div key={t.id} className="py-6 first:pt-0 last:pb-0 space-y-3">
                {/* Top line: Name (Symbol) and Graduated Date */}
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

                {/* Links list */}
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
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-400 text-sm">
          No graduated tokens yet.
        </div>
      )}`;

content = content.replace(/\{filteredTokens\.length > 0 \? \([\s\S]*?No graduated tokens yet\.\n\s*<\/div>\n\s*\)\}/,
`{filteredTokens.length > 0 ? (
        <div className="divide-y divide-[#1e3a5f]/15">
          {filteredTokens.map((t) => {
            const exitReason = t.exitType || 'Major Exchange';
            const bscscanUrl = \`\${getExplorerUrl()}/address/\${t.contract}\`;
            const dexscreenerUrl = \`https://dexscreener.com/bsc/\${t.contract}\`;

            return (
              <div key={t.id} className="py-6 first:pt-0 last:pb-0 space-y-3">
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
          })}
        </div>
      ) : searchQuery ? (
        <EmptyState 
          icon={SearchX} 
          title="No tokens found" 
          description="We couldn't find any tokens matching your search query in History."
        />
      ) : (
        <EmptyState 
          icon={History} 
          title="Belum ada riwayat token" 
          description="Token yang telah lulus dan masuk ke bursa utama akan dicatat di sini."
        />
      )}`);

fs.writeFileSync('src/pages/HistoryPage.tsx', content);
console.log('HistoryPage patched');

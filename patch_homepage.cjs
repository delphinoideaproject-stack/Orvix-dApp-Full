const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

// Add imports
if (!content.includes("import { EmptyState }")) {
  content = content.replace(
    "import { TokenLogo } from '../components/TokenLogo';",
    "import { TokenLogo } from '../components/TokenLogo';\nimport { EmptyState } from '../components/EmptyState';"
  );
}

// Add SearchX, Package (or Box)
content = content.replace(
  "import { ArrowUp, ArrowRight, Info, Globe, Send, Github, BookOpen, ExternalLink, Check, Copy, ChevronUp, Download, Share2, ChevronDown } from 'lucide-react';",
  "import { ArrowUp, ArrowRight, Info, Globe, Send, Github, BookOpen, ExternalLink, Check, Copy, ChevronUp, Download, Share2, ChevronDown, SearchX, Rocket, ArchiveX } from 'lucide-react';"
);

// Replace New Alpha empty state
const newAlphaTarget = `{filteredNewAlpha.length > 0 ? (
                filteredNewAlpha.map((t, index) => (
                  <TokenPosterCard 
                    key={\`\${t.id}-\${index}\`} 
                    token={t} 
                    index={index} 
                    onNavigate={setCurrentPage} 
                    onSelect={onSelectToken} 
                  />
                ))
              ) : null}

              {Array.from({ length: emptySlotsCount }).map((_, i) => (
                <motion.div 
                  key={\`empty-slot-\${i}\`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * (filteredNewAlpha.length + i) }}
                  onClick={() => setCurrentPage?.('SUBMIT')}
                  className="aspect-[3/4] border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl sm:rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-blue-600 group-hover:text-white text-zinc-500 flex items-center justify-center transition-colors mb-1.5">
                    <span className="text-base font-bold">+</span>
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300">Available Slot</div>
                  <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5">Submit Token</div>
                </motion.div>
              ))}`;

const newAlphaReplacement = `{filteredNewAlpha.length > 0 ? (
                <>
                  {filteredNewAlpha.map((t, index) => (
                    <TokenPosterCard 
                      key={\`\${t.id}-\${index}\`} 
                      token={t} 
                      index={index} 
                      onNavigate={setCurrentPage} 
                      onSelect={onSelectToken} 
                    />
                  ))}
                  {Array.from({ length: emptySlotsCount }).map((_, i) => (
                    <motion.div 
                      key={\`empty-slot-\${i}\`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 * (filteredNewAlpha.length + i) }}
                      onClick={() => setCurrentPage?.('SUBMIT')}
                      className="aspect-[3/4] border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl sm:rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors group shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-blue-600 group-hover:text-white text-zinc-500 flex items-center justify-center transition-colors mb-1.5">
                        <span className="text-base font-bold">+</span>
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300">Available Slot</div>
                      <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5">Submit Token</div>
                    </motion.div>
                  ))}
                </>
              ) : searchQuery ? (
                <div className="col-span-full">
                  <EmptyState 
                    icon={SearchX} 
                    title="No tokens found" 
                    description="We couldn't find any tokens matching your search query in New Alpha."
                  />
                </div>
              ) : (
                <div className="col-span-full">
                  <EmptyState 
                    icon={Rocket} 
                    title="Belum ada token yang listing" 
                    description="Jadilah yang pertama untuk meluncurkan token Anda di Orvix."
                    actionText="Submit Listing"
                    onAction={() => setCurrentPage?.('SUBMIT')}
                  />
                </div>
              )}`;
content = content.replace(newAlphaTarget, newAlphaReplacement);

// Replace Archive empty state
const archiveTarget = `{filteredArchive.length > 0 ? (
                filteredArchive.map((t, index) => {`;
const archiveTargetFull = `<div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-t border-b border-zinc-200 dark:border-zinc-800 pb-12">
              {filteredArchive.length > 0 ? (
                filteredArchive.map((t, index) => {
                  const isExpanded = expandedId === t.id;
                  return (
                    <motion.div 
                      key={t.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="py-4 transition-colors"
                    >
                      <div 
                        className="flex items-center justify-between cursor-pointer group py-2"
                        onClick={() => onSelectToken?.(t)}
                      >
                        {/* Left: Icon + Pair */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <TokenLogo tokenId={t.logo || t.id} className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                              {t.pair}
                              <span className="text-xs font-normal text-zinc-500">({t.name})</span>
                            </div>
                            <div className="text-xs text-zinc-400">{t.listedAt}</div>
                          </div>
                        </div>

                        {/* Middle: Current Price */}
                        <div className="text-right sm:text-left font-mono font-medium text-zinc-900 dark:text-zinc-100">
                          $\\{formatGlobalNumber(t.price)}
                        </div>

                        {/* Right: Swap Button + Arrow */}
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1.5 px-3 rounded-xl"
                            onClick={() => setCurrentPage?.('SWAP')}
                          >
                            Trade
                          </Button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(isExpanded ? null : t.id);
                            }}
                            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Toggle Details"
                          >
                            <ArrowRight className={\`w-4 h-4 transition-transform duration-200 \${isExpanded ? 'rotate-90 text-blue-500' : ''}\`} />
                          </button>
                        </div>
                      </div>

                      {/* Inline Expanded Detail View */}
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 p-6 rounded-2xl space-y-4 text-sm"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="text-xs font-semibold text-zinc-500">Contract</div>
                                <div className="relative group/tooltip inline-flex items-center">
                                  <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:flex flex-col gap-1 w-64 p-3 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-30 text-xs font-sans text-zinc-200 pointer-events-none">
                                    <span className="font-bold text-zinc-100">Smart Contract Address</span>
                                    <span className="text-zinc-400">Decentralized smart contract on BNB Chain governing token transfers, liquidity pools, and AMM V2 trading rules.</span>
                                    <span className="text-[11px] font-mono text-blue-400 break-all mt-0.5">{t.contract}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 break-all mb-2">{t.contract}</div>
                              <div className="flex gap-2">
                                <CopyButton text={t.contract} label="Copy" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800" />
                                <a href={\`\${getExplorerUrl()}/address/\${t.contract}\`} target="_blank" rel="noreferrer" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">BscScan</a>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-zinc-500 mb-1">Creator</div>
                              <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 break-all mb-2">{t.creator}</div>
                              <div className="flex gap-2">
                                <CopyButton text={t.creator} label="Copy" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800" />
                                <a href={\`\${getExplorerUrl()}/address/\${t.creator}\`} target="_blank" rel="noreferrer" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">BscScan</a>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-zinc-500 mb-1">AMM Version</div>
                              <div className="text-xs text-zinc-900 dark:text-zinc-100 font-medium">{t.ammVersion}</div>
                              <div className="mt-3">
                                <Button size="sm" variant="outline" className="text-xs" onClick={() => onSelectToken?.(t)}>
                                  Open Full Modal
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-zinc-500">
                  No archived tokens found matching your search.
                </div>
              )}
            </div>`;

// Wait, doing replace with full regex is safer for archive
content = content.replace(/\{filteredArchive\.length > 0 \? \([\s\S]*?No archived tokens found matching your search\.\n\s*<\/div>\n\s*\)\}/, 
`{filteredArchive.length > 0 ? (
                filteredArchive.map((t, index) => {
                  const isExpanded = expandedId === t.id;
                  return (
                    <motion.div 
                      key={t.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="py-4 transition-colors"
                    >
                      <div 
                        className="flex items-center justify-between cursor-pointer group py-2"
                        onClick={() => onSelectToken?.(t)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <TokenLogo tokenId={t.logo || t.id} className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                              {t.pair}
                              <span className="text-xs font-normal text-zinc-500">({t.name})</span>
                            </div>
                            <div className="text-xs text-zinc-400">{t.listedAt}</div>
                          </div>
                        </div>

                        <div className="text-right sm:text-left font-mono font-medium text-zinc-900 dark:text-zinc-100">
                          $\\{formatGlobalNumber(t.price)}
                        </div>

                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1.5 px-3 rounded-xl"
                            onClick={() => setCurrentPage?.('SWAP')}
                          >
                            Trade
                          </Button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(isExpanded ? null : t.id);
                            }}
                            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Toggle Details"
                          >
                            <ArrowRight className={\`w-4 h-4 transition-transform duration-200 \${isExpanded ? 'rotate-90 text-blue-500' : ''}\`} />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 p-6 rounded-2xl space-y-4 text-sm"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="text-xs font-semibold text-zinc-500">Contract</div>
                              </div>
                              <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 break-all mb-2">{t.contract}</div>
                              <div className="flex gap-2">
                                <CopyButton text={t.contract} label="Copy" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800" />
                                <a href={\`\${getExplorerUrl()}/address/\${t.contract}\`} target="_blank" rel="noreferrer" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">BscScan</a>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-zinc-500 mb-1">Creator</div>
                              <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 break-all mb-2">{t.creator}</div>
                              <div className="flex gap-2">
                                <CopyButton text={t.creator} label="Copy" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800" />
                                <a href={\`\${getExplorerUrl()}/address/\${t.creator}\`} target="_blank" rel="noreferrer" className="text-xs py-1 px-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">BscScan</a>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-zinc-500 mb-1">AMM Version</div>
                              <div className="text-xs text-zinc-900 dark:text-zinc-100 font-medium">{t.ammVersion}</div>
                              <div className="mt-3">
                                <Button size="sm" variant="outline" className="text-xs" onClick={() => onSelectToken?.(t)}>
                                  Open Full Modal
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              ) : searchQuery ? (
                <EmptyState 
                  icon={SearchX} 
                  title="No tokens found" 
                  description="We couldn't find any tokens matching your search query in Archive."
                />
              ) : (
                <EmptyState 
                  icon={ArchiveX} 
                  title="Belum ada token yang di-archive" 
                  description="Token yang sudah selesai masa tayang di New Alpha akan dipindahkan ke sini."
                />
              )}`);

fs.writeFileSync('src/pages/HomePage.tsx', content);
console.log('HomePage patched');

const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

const target = `{filteredNewAlpha.length > 0 ? (
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

const replacement = `{filteredNewAlpha.length > 0 ? (
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

if (content.includes("Belum ada token yang listing")) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/HomePage.tsx', content);
  console.log('Grid patched successfully.');
} else {
  console.log('Could not find the target string. Maybe it is formatted differently.');
}

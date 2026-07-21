const fs = require('fs');
let content = fs.readFileSync('src/pages/WatchlistPage.tsx', 'utf-8');

if (!content.includes("import { EmptyState }")) {
  content = content.replace(
    "import { Star, Download } from 'lucide-react';",
    "import { Star, Download, SearchX, ListVideo } from 'lucide-react';\nimport { EmptyState } from '../components/EmptyState';"
  );
}

const target = `{filteredTokens.length > 0 ? (
          filteredTokens.map((t, index) => (
            <TokenRow key={t.id} index={index} token={t} showSwap={true} onNavigate={setCurrentPage} onSelect={onSelectToken} />
          ))
        ) : (
          <div className="text-center py-20 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
            <p className="text-zinc-500">
              {watchlistTokens.length === 0 
                ? "Your watchlist is empty. Add tokens to track them here." 
                : "No tokens found matching your search."}
            </p>
          </div>
        )}`;

const replacement = `{filteredTokens.length > 0 ? (
          filteredTokens.map((t, index) => (
            <TokenRow key={t.id} index={index} token={t} showSwap={true} onNavigate={setCurrentPage} onSelect={onSelectToken} />
          ))
        ) : watchlistTokens.length === 0 ? (
          <EmptyState 
            icon={ListVideo} 
            title="Watchlist kamu masih kosong" 
            description="Tambahkan token ke watchlist untuk memantau performanya dengan mudah di sini."
          />
        ) : (
          <EmptyState 
            icon={SearchX} 
            title="No tokens found" 
            description="We couldn't find any tokens matching your search query in Watchlist."
          />
        )}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/WatchlistPage.tsx', content);
console.log('WatchlistPage patched');

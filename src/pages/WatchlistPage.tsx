import React from 'react';
import { Page, Token } from '../types';
import { TokenRow } from '../components/TokenRow';
import { mockTokens, mockArchivedTokens, mockHistoryTokens } from '../data';
import { useWatchlist } from '../hooks/useWatchlist';
import { Star, Download, SearchX, ListVideo } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { exportTokensToCSV } from '../lib/csvUtils';

const allTokens = [...mockTokens, ...mockArchivedTokens, ...mockHistoryTokens];

export function WatchlistPage({ 
  setCurrentPage,
  searchQuery = '',
  onSelectToken
}: { 
  setCurrentPage?: (p: Page) => void;
  searchQuery?: string;
  onSelectToken?: (t: Token) => void;
}) {
  const { watchlist } = useWatchlist();
  
  const watchlistTokens = allTokens.filter(t => watchlist.includes(t.id));
  
  const filteredTokens = watchlistTokens.filter(t => 
    !searchQuery || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.contract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            Watchlist
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 w-full">Your personalized list of tracked tokens.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 self-start sm:self-auto shrink-0" 
          onClick={() => exportTokensToCSV(filteredTokens, 'Watchlist')}
          disabled={filteredTokens.length === 0}
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTokens.length > 0 ? (
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
        )}
      </div>
    </div>
  );
}

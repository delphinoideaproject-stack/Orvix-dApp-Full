import React from 'react';
import { motion } from 'motion/react';
import { Token, Page } from '../types';
import { cn } from '../lib/utils';
import { formatGlobalNumber } from '../lib/formatNumber';

interface TokenPosterCardProps {
  token: Token;
  index?: number;
  onNavigate?: (page: Page) => void;
  onSelect?: (token: Token) => void;
}

export const TokenPosterCard: React.FC<TokenPosterCardProps> = ({
  token,
  index = 0,
  onNavigate,
  onSelect
}) => {
  const isPositive = token.priceChange >= 0;

  return (
    <motion.div
      onClick={() => onSelect?.(token)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min(index, 8) * 0.05 
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 aspect-[3/4] flex flex-col justify-between cursor-pointer group shadow-sm transition-all duration-300 hover:border-blue-500"
      )}
    >
      {/* Project Wallpaper (Cover Image) */}
      <img
        src={token.wallpaper || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80'}
        alt={token.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

      {/* Top badges / symbol */}
      <div className="relative z-10 p-2 min-[380px]:p-2.5 sm:p-3 flex flex-col min-[380px]:flex-row gap-1 min-[380px]:justify-between items-start min-[380px]:items-center">
        <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white truncate max-w-full">
          {token.symbol}
        </span>
        <span className={`text-[9px] min-[380px]:text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-md shrink-0 ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isPositive ? '+' : ''}{formatGlobalNumber(token.priceChange)}%
        </span>
      </div>

      {/* Bottom Overlay with Token Information */}
      <div className="relative z-10 p-2.5 min-[380px]:p-3 sm:p-4 flex flex-col justify-end space-y-1 sm:space-y-1.5 pb-2.5 min-[380px]:pb-3 sm:pb-4">
        <div>
          {/* Token Pair */}
          <div className="text-[10px] min-[380px]:text-xs sm:text-sm font-bold text-white truncate">{token.pair}</div>
          {/* Listed Time */}
          <div className="text-[9px] min-[380px]:text-[10px] sm:text-xs text-zinc-300 font-medium">Listed {token.listedAt}</div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          {/* Current Price */}
          <div className="text-[10px] min-[380px]:text-xs sm:text-sm font-mono font-bold text-white">${formatGlobalNumber(token.price)}</div>
        </div>
      </div>
    </motion.div>
  );
};

export const TokenPosterCardSkeleton: React.FC = () => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 aspect-[3/4] flex flex-col justify-between p-2.5 min-[380px]:p-3 sm:p-4 shadow-sm select-none"
      )}
    >
      {/* Top badges / symbol placeholders */}
      <div className="flex flex-col min-[380px]:flex-row justify-between items-start gap-1 animate-pulse">
        <div className="h-4 sm:h-5 w-10 sm:w-12 rounded-full bg-zinc-200 dark:bg-zinc-800/60" />
        <div className="h-4 sm:h-5 w-12 sm:w-16 rounded-full bg-zinc-200 dark:bg-zinc-800/60" />
      </div>

      {/* Bottom Overlay with Token Information placeholders */}
      <div className="flex flex-col space-y-2 animate-pulse mt-auto">
        <div>
          {/* Token Pair placeholder */}
          <div className="h-4 sm:h-5 w-20 sm:w-24 rounded bg-zinc-200 dark:bg-zinc-800/60" />
          {/* Listed Time placeholder */}
          <div className="h-3 sm:h-3.5 w-16 sm:w-20 rounded bg-zinc-200 dark:bg-zinc-800/60 mt-1.5" />
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Current Price placeholder */}
          <div className="h-3.5 sm:h-4 w-12 sm:w-14 rounded bg-zinc-200 dark:bg-zinc-800/60" />
        </div>
      </div>
    </div>
  );
};


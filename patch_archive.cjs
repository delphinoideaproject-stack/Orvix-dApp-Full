const fs = require('fs');

let content = fs.readFileSync('src/pages/ArchivePage.tsx', 'utf-8');

// Add imports
if (!content.includes("import { EmptyState }")) {
  content = content.replace(
    "import { TokenLogo } from '../components/TokenLogo';",
    "import { TokenLogo } from '../components/TokenLogo';\nimport { EmptyState } from '../components/EmptyState';"
  );
}

// Add SearchX, ArchiveX
content = content.replace(
  "import { ArrowRight, Info } from 'lucide-react';",
  "import { ArrowRight, Info, SearchX, ArchiveX } from 'lucide-react';"
);

// Replace Archive empty state
const target = `{filteredTokens.length > 0 ? (
          filteredTokens.map((t) => (
            <ArchiveRowItem 
              key={t.id}
              token={t}
              isExpanded={expandedId === t.id}
              onToggleExpand={() => setExpandedId(expandedId === t.id ? null : t.id)}
              onSelectToken={onSelectToken}
              setCurrentPage={setCurrentPage}
            />
          ))
        ) : (
          <div className="text-center py-20 text-zinc-500">
            No archived tokens found matching your search.
          </div>
        )}`;

const replacement = `{filteredTokens.length > 0 ? (
          filteredTokens.map((t) => (
            <ArchiveRowItem 
              key={t.id}
              token={t}
              isExpanded={expandedId === t.id}
              onToggleExpand={() => setExpandedId(expandedId === t.id ? null : t.id)}
              onSelectToken={onSelectToken}
              setCurrentPage={setCurrentPage}
            />
          ))
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
        )}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/ArchivePage.tsx', content);
console.log('ArchivePage patched');

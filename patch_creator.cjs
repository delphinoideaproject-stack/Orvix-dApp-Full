const fs = require('fs');
let content = fs.readFileSync('src/pages/CreatorPortalPage.tsx', 'utf-8');

// Remove mockTokens import
content = content.replace(
  "import { mockTokens } from '../data';",
  "// mockTokens removed"
);

// Add EmptyState import and Package
content = content.replace(
  "import { CheckCircle, AlertCircle, Send, Upload, X, Image as ImageIcon, Plus, Wand2, Loader2 } from 'lucide-react';",
  "import { CheckCircle, AlertCircle, Send, Upload, X, Image as ImageIcon, Plus, Wand2, Loader2, Package } from 'lucide-react';\nimport { EmptyState } from '../components/EmptyState';"
);

// Replace ProjectManager logic
const target = `  useEffect(() => {
    // For demo purposes, if wallet is connected, just assign them the first token in mockTokens
    // In reality, we would fetch tokens created by this wallet.
    const demoTokens = [mockTokens[0]];
    setMyTokens(demoTokens);
  }, [walletAddress]);

  if (myTokens.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
        You haven't submitted any projects yet.
      </div>
    );
  }`;

const replacement = `  useEffect(() => {
    // TODO: Fetch tokens created by this wallet address from backend
    // setMyTokens(fetchedTokens);
    setMyTokens([]);
  }, [walletAddress]);

  if (myTokens.length === 0) {
    return (
      <EmptyState 
        icon={Package} 
        title="Kamu belum membuat token apapun" 
        description="Silakan submit token baru Anda melalui form submission di atas untuk mulai."
      />
    );
  }`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/CreatorPortalPage.tsx', content);
console.log('CreatorPortalPage patched');

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/Button';
import confetti from 'canvas-confetti';

interface CreatorPortalPageProps {
  walletConnected: boolean;
  walletAddress?: string;
  onOpenWalletModal: () => void;
  onNavigate?: (page: any) => void;
}

export function CreatorPortalPage({
  walletConnected,
  walletAddress,
  onOpenWalletModal,
  onNavigate
}: CreatorPortalPageProps) {
  const [formData, setFormData] = useState({
    contractAddress: '',
    name: '',
    symbol: '',
    totalSupply: '',
    decimals: '18',
    website: '',
    logoUrl: '',
    xUrl: '',
    telegramUrl: '',
    githubUrl: '',
    description: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'contractAddress') {
      if (!value.trim()) {
        error = 'Contract address is required';
      } else if (!/^0x[a-fA-F0-9]{40}$/.test(value.trim())) {
        error = 'Invalid BSC contract address (must start with 0x and be 42 characters)';
      }
    } else if (name === 'name') {
      if (!value.trim()) {
        error = 'Token name is required';
      } else if (value.trim().length < 2) {
        error = 'Token name must be at least 2 characters';
      }
    } else if (name === 'symbol') {
      if (!value.trim()) {
        error = 'Token symbol is required';
      } else if (value.trim().length < 2) {
        error = 'Token symbol must be at least 2 characters';
      }
    } else if (name === 'totalSupply') {
      if (!value.trim()) {
        error = 'Total supply is required';
      } else if (isNaN(Number(value)) || Number(value) <= 0) {
        error = 'Total supply must be a positive number';
      }
    } else if (name === 'decimals') {
      if (!value.trim()) {
        error = 'Decimals value is required';
      } else {
        const val = Number(value);
        if (isNaN(val) || val < 0 || val > 36 || !Number.isInteger(val)) {
          error = 'Decimals must be an integer between 0 and 36';
        }
      }
    } else if (name === 'website') {
      if (!value.trim()) {
        error = 'Website URL is required';
      } else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value.trim())) {
        error = 'Please enter a valid URL (e.g. https://example.com)';
      }
    } else if (name === 'logoUrl') {
      if (!value.trim()) {
        error = 'Logo URL is required';
      } else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value.trim())) {
        error = 'Please enter a valid image URL';
      }
    } else if (name === 'xUrl' && value.trim()) {
      if (!/^https?:\/\/(www\.)?(x|twitter)\.com\/[a-zA-Z0-9_]{1,15}$/.test(value.trim())) {
        error = 'Please enter a valid X/Twitter profile URL';
      }
    } else if (name === 'telegramUrl' && value.trim()) {
      if (!/^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}$/.test(value.trim())) {
        error = 'Please enter a valid Telegram group or channel URL';
      }
    } else if (name === 'githubUrl' && value.trim()) {
      if (!/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?.*$/.test(value.trim())) {
        error = 'Please enter a valid GitHub URL';
      }
    } else if (name === 'description') {
      if (!value.trim()) {
        error = 'Description is required';
      } else if (value.trim().length < 20) {
        error = 'Please provide a more detailed description (at least 20 characters)';
      }
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
    if (!checked) {
      setErrors((prev) => ({ ...prev, agreeToTerms: 'You must accept the Terms of Service to submit' }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.agreeToTerms;
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      if (key !== 'agreeToTerms') {
        const error = validateField(key, formData[key as keyof typeof formData] as string);
        if (error) newErrors[key] = error;
      }
    });

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must accept the Terms of Service to submit';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate API Submission & Backend Integration
    setTimeout(() => {
      const randomId = 'ORV-' + Math.floor(100000 + Math.random() * 900000);
      setSubmissionId(randomId);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Save to local listings cache for representation
      const existingListingsRaw = localStorage.getItem('orvix_submissions') || '[]';
      try {
        const existingListings = JSON.parse(existingListingsRaw);
        existingListings.push({
          ...formData,
          id: randomId,
          status: 'PENDING_REVIEW',
          submittedAt: new Date().toISOString(),
          walletAddress
        });
        localStorage.setItem('orvix_submissions', JSON.stringify(existingListings));
      } catch (e) {
        console.error('Error saving submission:', e);
      }

      // Burst of confetti!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 9999
      });
    }, 2000);
  };

  if (!walletConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[70vh] max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col items-center"
        >
          {/* Custom SVG Icon as requested */}
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Creator Portal Access</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
            You must connect your wallet to access the Creator Portal, submit new tokens, and manage stories.
          </p>
          <Button onClick={onOpenWalletModal} variant="primary" size="lg" className="w-full sm:w-auto px-8">
            Connect Wallet
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {submitSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-zinc-900/40 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center max-w-2xl mx-auto my-6"
        >
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center rounded-full mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Submission Successful</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Your token has been submitted for verification. Below is your reference ID:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-8 max-w-xs mx-auto">
            {submissionId}
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
            The security and automated AMM V2 audit process takes between 12 to 24 hours. You can view progress or contact support if you have any questions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => setSubmitSuccess(false)} variant="outline">
              Submit Another Token
            </Button>
            <Button onClick={() => onNavigate?.('HOME')} variant="primary">
              Return to Home
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Creator Portal</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Connect your project with Orvix's automated audit and listing stream on BNB Smart Chain.
            </p>
          </div>

          {/* Connected address notification */}
          <div className="flex items-center justify-between p-4 bg-zinc-100/70 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Connected wallet address:
            </span>
            <span className="font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-800 dark:text-zinc-200">
              {walletAddress}
            </span>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Terms of Service Section (Left Sidebar/Card - Columns: 2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  Terms of Service
                </h3>

                <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">1. Verification Standard</h4>
                    <p>
                      Every submitted project must possess locked liquidity on PancakeSwap AMM V2 for at least 6 months, verified deployer credentials, and clean contract code.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">2. Security Audits</h4>
                    <p>
                      Honeypots, mint functions, extreme tax modifications (higher than 5%), or proxy contracts with unverified implementations will be automatically rejected.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">3. Deposit & Integrity</h4>
                    <p>
                      Submitting fake information, utilizing trademarked assets without authorization, or deploying malicious updates will result in permanent blacklist.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Submission Form Section (Right - Columns: 3) */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Token Submission Form
                </h3>

                <div className="space-y-4">
                  {/* Contract Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Token Contract Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contractAddress"
                      value={formData.contractAddress}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all font-mono"
                    />
                    {errors.contractAddress && <p className="text-xs text-red-500 mt-1">{errors.contractAddress}</p>}
                  </div>

                  {/* Name and Symbol Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Token Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Orvix Token"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Token Symbol <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        placeholder="e.g. ORV"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all uppercase"
                      />
                      {errors.symbol && <p className="text-xs text-red-500 mt-1">{errors.symbol}</p>}
                    </div>
                  </div>

                  {/* Supply and Decimals Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Total Supply <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="totalSupply"
                        value={formData.totalSupply}
                        onChange={handleInputChange}
                        placeholder="e.g. 100000000"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.totalSupply && <p className="text-xs text-red-500 mt-1">{errors.totalSupply}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Decimals <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="decimals"
                        value={formData.decimals}
                        onChange={handleInputChange}
                        placeholder="e.g. 18"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.decimals && <p className="text-xs text-red-500 mt-1">{errors.decimals}</p>}
                    </div>
                  </div>

                  {/* Website and Logo Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Website URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="e.g. https://orvix.io"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Logo Image URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleInputChange}
                        placeholder="e.g. https://orvix.io/logo.png"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.logoUrl && <p className="text-xs text-red-500 mt-1">{errors.logoUrl}</p>}
                    </div>
                  </div>

                  {/* Social links Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">X (Twitter) URL</label>
                      <input
                        type="url"
                        name="xUrl"
                        value={formData.xUrl}
                        onChange={handleInputChange}
                        placeholder="e.g. https://x.com/orvix"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.xUrl && <p className="text-xs text-red-500 mt-1">{errors.xUrl}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Telegram URL</label>
                      <input
                        type="url"
                        name="telegramUrl"
                        value={formData.telegramUrl}
                        onChange={handleInputChange}
                        placeholder="e.g. https://t.me/orvix"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.telegramUrl && <p className="text-xs text-red-500 mt-1">{errors.telegramUrl}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">GitHub URL</label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        placeholder="e.g. https://github.com/orvix"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all"
                      />
                      {errors.githubUrl && <p className="text-xs text-red-500 mt-1">{errors.githubUrl}</p>}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project, its utility, and the ecosystem vision..."
                      rows={4}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all resize-none leading-relaxed"
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                  </div>

                  {/* Agreement */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleCheckboxChange}
                        className="mt-1 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-zinc-950 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                        I confirm that all information provided is accurate and I agree to the Orvix verification terms, security parameters, and locked liquidity rules.
                      </span>
                    </label>
                    {errors.agreeToTerms && <p className="text-xs text-red-500 mt-1">{errors.agreeToTerms}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <Button type="submit" variant="primary" className="w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting to Verification Protocol...
                      </>
                    ) : (
                      'Submit Project'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

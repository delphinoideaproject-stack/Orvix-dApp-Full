import { Token } from './types';

const network = 'testnet';
const isTestnet = true;

export const mockTokensTestnet: Token[] = [];
export const mockArchivedTokensTestnet: Token[] = [];
export const mockHistoryTokensTestnet: Token[] = [];

export const mockTokensMainnet: Token[] = [];
export const mockArchivedTokensMainnet: Token[] = [];
export const mockHistoryTokensMainnet: Token[] = [];

export const mockTokens = isTestnet ? mockTokensTestnet : mockTokensMainnet;
export const mockArchivedTokens = isTestnet ? mockArchivedTokensTestnet : mockArchivedTokensMainnet;
export const mockHistoryTokens = isTestnet ? mockHistoryTokensTestnet : mockHistoryTokensMainnet;

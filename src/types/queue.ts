export interface TokenInfo {
  tokenId?: string;
  transactionId?: string;
  farmerName?: string;
  cropName?: string;
  estimatedQuantityQtl?: number;
  position?: number;
}

export interface ETADetails {
  estimatedWaitTimeMins?: number;
  estimatedServiceTime?: string; // ISO DateTime
}

export interface QueueState {
  mandiId: string;
  activeTokens?: (TokenInfo | number)[];
  currentServingToken?: TokenInfo | number;
  waitingCount?: number;
  averageServiceTimeMins?: number;
  lastUpdated?: string;
  lastUpdatedAt?: string;
}

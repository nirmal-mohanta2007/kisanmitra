import { ProcurementTransaction, ETAInfo, Centre, TransactionStatus } from '../types';

/**
 * Calculate ETA for a farmer based on queue position.
 * Uses explainable rule-based calculation.
 */
export function calculateETA(
  transaction: ProcurementTransaction,
  allTransactions: ProcurementTransaction[],
  centre: Centre
): ETAInfo {
  // Find active transactions at same centre that are ahead in queue
  const activeStatuses = [
    TransactionStatus.CHECKED_IN,
    TransactionStatus.WAITING,
    TransactionStatus.WEIGHING,
    TransactionStatus.QUALITY_CHECK,
  ];
  
  const tokensAhead = allTransactions.filter(
    (t) =>
      t.centreId === transaction.centreId &&
      t.id !== transaction.id &&
      t.tokenNumber < transaction.tokenNumber &&
      (activeStatuses.includes(t.status) || t.status === TransactionStatus.BOOKED)
  ).length;

  const avgServiceTime = centre.averageServiceTime;
  const currentDelay = centre.currentDelay;
  
  // Core formula: tokens_ahead * avg_service_time + current_delay
  const estimatedWaitMinutes = (tokensAhead * avgServiceTime) + currentDelay;
  
  // Recommended arrival: now + estimated wait - 15 min buffer
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + Math.max(0, estimatedWaitMinutes - 15) * 60000);
  const recommendedArrivalTime = arrivalTime.toISOString();

  // Build explainable reason
  const explanation = buildExplanation(tokensAhead, avgServiceTime, currentDelay, estimatedWaitMinutes);

  return {
    tokensAhead,
    averageServiceTimeMinutes: avgServiceTime,
    currentDelayMinutes: currentDelay,
    estimatedWaitMinutes,
    recommendedArrivalTime,
    explanation,
  };
}

function buildExplanation(
  tokensAhead: number,
  avgServiceTime: number,
  currentDelay: number,
  totalWait: number
): string {
  let explanation = '';
  if (tokensAhead === 0) {
    explanation = 'You are next in queue!';
  } else {
    explanation = `${tokensAhead} farmer${tokensAhead > 1 ? 's' : ''} ahead of you. `;
    explanation += `Centre is processing approximately ${Math.round(60 / avgServiceTime)} farmers per hour. `;
  }
  if (currentDelay > 0) {
    explanation += `There is currently a ${currentDelay}-minute delay at the centre. `;
  }
  if (totalWait > 0) {
    explanation += `Estimated wait: ${totalWait} minutes.`;
  }
  return explanation.trim();
}

/** Format arrival time as readable string like '11:30 AM' */
export function formatArrivalTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/** Format wait time as human readable string */
export function formatWaitTime(minutes: number): string {
  if (minutes < 1) return 'Less than a minute';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = Math.round(minutes % 60);
  if (remainingMins === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMins} min`;
}

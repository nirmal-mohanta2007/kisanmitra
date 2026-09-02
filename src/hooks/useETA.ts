import { useState, useEffect } from 'react';
import { ETAService } from '../features/eta/eta.service';

export const useETA = (tokenId?: string, mandiId?: string) => {
  const [etaText, setEtaText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenId && mandiId) {
      setLoading(true);
      ETAService.getETAForToken(tokenId, mandiId).then(explanation => {
        setEtaText(explanation);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [tokenId, mandiId]);

  return { etaText, loading };
};

import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

export type SpeechLanguage = 'hi' | 'or' | 'en';

type SpeechListener = (isSpeaking: boolean, speakingId?: string | null) => void;

class SpeechService {
  private activeSpeakingId: string | null = null;
  private listeners: Set<SpeechListener> = new Set();

  public addListener(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(isSpeaking: boolean, speakingId?: string | null) {
    this.listeners.forEach((listener) => {
      try {
        listener(isSpeaking, speakingId);
      } catch (e) {
        console.warn('Speech listener error:', e);
      }
    });
  }

  public getActiveId(): string | null {
    return this.activeSpeakingId;
  }

  public isSpeaking(): boolean {
    return this.activeSpeakingId !== null;
  }

  /**
   * Stop any active readout immediately
   */
  public async stop(): Promise<void> {
    this.activeSpeakingId = null;
    this.notify(false, null);

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // ignore web cancellation error
    }

    try {
      await Speech.stop();
    } catch {
      // ignore native stop error
    }
  }

  /**
   * Speak out text in the specified language ('hi' | 'or' | 'en')
   */
  public async speak(
    id: string,
    text: string,
    lang: SpeechLanguage = 'hi',
    onDone?: () => void
  ): Promise<void> {
    // If the same card is already speaking, tapping again will stop it
    if (this.activeSpeakingId === id) {
      await this.stop();
      return;
    }

    // Stop any existing speech before starting new one
    await this.stop();

    if (!text || text.trim().length === 0) return;

    this.activeSpeakingId = id;
    this.notify(true, id);

    const cleanup = () => {
      if (this.activeSpeakingId === id) {
        this.activeSpeakingId = null;
        this.notify(false, null);
      }
      onDone?.();
    };

    // Clean emojis and decorative symbols that could cause robotic stuttering in TTS
    const cleanedText = text
      .replace(/[🌾🌧️❄️☀️⚠️🚨✓↑→~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Map language tag
    let langCode = 'hi-IN';
    if (lang === 'en') {
      langCode = 'en-IN';
    } else if (lang === 'or') {
      // Many Android/iOS devices support or-IN or fallback to Indian accent
      langCode = 'or-IN';
    }

    // Try Web Speech API on Web platform if available
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.lang = langCode;
        utterance.rate = 0.92; // Slightly relaxed pace for clarity
        utterance.pitch = 1.0;

        // Check if Odia or Hindi voices are present
        const voices = window.speechSynthesis.getVoices?.() || [];
        const matchingVoice =
          voices.find((v) => v.lang.toLowerCase().includes(lang === 'or' ? 'or' : lang === 'hi' ? 'hi' : 'en')) ||
          voices.find((v) => v.lang.toLowerCase().includes('in'));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }

        utterance.onend = cleanup;
        utterance.onerror = cleanup;

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('Web speech failed, falling back to expo-speech:', err);
      }
    }

    // Fallback to Native Expo-Speech
    try {
      await Speech.speak(cleanedText, {
        language: langCode,
        pitch: 1.0,
        rate: 0.88, // Clear, paced cadence for rural comprehension
        onDone: cleanup,
        onStopped: cleanup,
        onError: () => {
          // If or-IN voice isn't present natively, gracefully fallback to hi-IN phonetics
          if (lang === 'or') {
            Speech.speak(cleanedText, {
              language: 'hi-IN',
              pitch: 1.0,
              rate: 0.88,
              onDone: cleanup,
              onStopped: cleanup,
              onError: cleanup,
            });
          } else {
            cleanup();
          }
        },
      });
    } catch (e) {
      console.warn('Speech.speak error:', e);
      cleanup();
    }
  }
}

export const speechService = new SpeechService();

/**
 * Global type augmentations for browser globals.
 */

export {};

declare global {
  interface Window {
    /** Injected Ethereum provider (MetaMask, etc.) */
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

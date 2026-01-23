import { generatePrivateKey } from "viem/accounts";

/**
 * Generates a random private key in a browser-compatible way.
 * Uses viem's built-in secure random generation.
 */
export const generateRandomPrivateKey = (): string => {
    return generatePrivateKey();
};

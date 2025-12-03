/**
 * Web Crypto API Encryption Utilities
 * 
 * Security Features:
 * - PBKDF2 for key derivation (100,000 iterations)
 * - AES-GCM for encryption
 * - Random salt and IV for each encryption
 * - Never logs sensitive data
 * 
 * ⚠️ SECURITY WARNING: This is for educational purposes only.
 * For production use, conduct a thorough security audit.
 */

export interface EncryptedData {
  ciphertext: string; // Base64 encoded
  salt: string; // Base64 encoded
  iv: string; // Base64 encoded
}

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16; // 128 bits
const IV_LENGTH = 12; // 96 bits (recommended for AES-GCM)

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate a random IV (Initialization Vector)
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Derive an AES-GCM key from a password using PBKDF2
 * 
 * @param password - User's password
 * @param salt - Random salt (must be stored with encrypted data)
 * @returns CryptoKey for AES-GCM encryption/decryption
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  // Convert password to key material
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive AES-GCM key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt mnemonic phrase using password
 * 
 * @param mnemonic - 12 or 24 word mnemonic phrase
 * @param password - User's password for encryption
 * @returns Encrypted data with salt and IV
 */
export async function encryptMnemonic(
  mnemonic: string,
  password: string
): Promise<EncryptedData> {
  try {
    // Generate random salt and IV
    const salt = generateSalt();
    const iv = generateIV();

    // Derive encryption key from password
    const key = await deriveKeyFromPassword(password, salt);

    // Encrypt mnemonic
    const encoder = new TextEncoder();
    const mnemonicBuffer = encoder.encode(mnemonic);

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      mnemonicBuffer
    );

    // Return encrypted data with metadata
    return {
      ciphertext: arrayBufferToBase64(ciphertext),
      salt: arrayBufferToBase64(salt),
      iv: arrayBufferToBase64(iv),
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt mnemonic. Please try again.');
  }
}

/**
 * Decrypt mnemonic phrase using password
 * 
 * @param encryptedData - Encrypted data with salt and IV
 * @param password - User's password for decryption
 * @returns Decrypted mnemonic phrase
 * @throws Error if password is incorrect or data is corrupted
 */
export async function decryptMnemonic(
  encryptedData: EncryptedData,
  password: string
): Promise<string> {
  try {
    // Convert base64 strings back to ArrayBuffers
    const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
    const salt = new Uint8Array(base64ToArrayBuffer(encryptedData.salt));
    const iv = new Uint8Array(base64ToArrayBuffer(encryptedData.iv));

    // Derive decryption key from password
    const key = await deriveKeyFromPassword(password, salt);

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt. Wrong password or corrupted data.');
  }
}

/**
 * Validate password strength
 * 
 * @param password - Password to validate
 * @returns true if password is strong enough
 */
export function validatePassword(password: string): {
  valid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    };
  }

  return { valid: true, message: 'Password is strong' };
}

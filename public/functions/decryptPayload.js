const crypto = require('crypto');

function decryptPayload(encryptedBase64, key) {
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  const iv = encrypted.slice(0, 12); // AES-GCM standard nonce length
  const tag = encrypted.slice(encrypted.length - 16);
  const ciphertext = encrypted.slice(12, encrypted.length - 16);

  const decipher = crypto.createDecipheriv('aes-256-gcm', crypto.createHash('sha256').update(key).digest(), iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString());
}
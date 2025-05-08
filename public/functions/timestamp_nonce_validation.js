const MAX_CLOCK_SKEW = 60; // seconds

function isValidTimestamp(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - timestamp) < MAX_CLOCK_SKEW;
}

const usedNonces = new Set(); // use Redis in production

function isValidNonce(nonce) {
  if (usedNonces.has(nonce)) return false;
  usedNonces.add(nonce);
  setTimeout(() => usedNonces.delete(nonce), 60 * 1000); // expire after 60 sec
  return true;
}
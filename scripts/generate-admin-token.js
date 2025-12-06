const crypto = require('crypto');

function generateToken() {
  const token = crypto.randomBytes(16).toString('hex');
  return token;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const token = generateToken();
const hashedToken = hashToken(token);

console.log('='.repeat(60));
console.log('ADMIN TOKEN GENERATOR');
console.log('='.repeat(60));
console.log('');
console.log('Your 32-character admin token (KEEP THIS SECRET):');
console.log('');
console.log(`  ${token}`);
console.log('');
console.log('SHA-256 hash to set as ADMIN_TOKEN_HASH environment variable:');
console.log('');
console.log(`  ${hashedToken}`);
console.log('');
console.log('='.repeat(60));
console.log('INSTRUCTIONS:');
console.log('='.repeat(60));
console.log('');
console.log('1. Copy the HASH value above');
console.log('2. Set it as the ADMIN_TOKEN_HASH secret in your environment');
console.log('3. Use the 32-character TOKEN to login at /admin/login');
console.log('');
console.log('IMPORTANT: Store the token securely. You cannot recover it later!');
console.log('='.repeat(60));

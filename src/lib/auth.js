'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ITERATIONS = 310000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

/**
 * Băm mật khẩu sử dụng PBKDF2.
 * @param {string} password
 */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');

  const derived = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
      if (err) {
        return reject(err);
      }
      resolve(key.toString('hex'));
    });
  });

  return `${salt}:${derived}`;
}

/**
 * Kiểm tra mật khẩu đầu vào với hash đã lưu.
 */
async function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) {
    return false;
  }

  const derived = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
      if (err) {
        return reject(err);
      }
      resolve(key.toString('hex'));
    });
  });

  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

/**
 * Ký JWT để xác thực cho client.
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

/**
 * Xác thực JWT từ client gửi lên.
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken
};

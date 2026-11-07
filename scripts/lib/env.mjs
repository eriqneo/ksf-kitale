// Shared config for the PocketBase admin scripts.
// Reads credentials from .env.local (never commit that file) or the process environment.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const i = line.indexOf('=');
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    out[key] = value;
  }
  return out;
}

const env = { ...readEnvFile(path.join(root, '.env')), ...readEnvFile(path.join(root, '.env.local')), ...process.env };

function required(name) {
  const value = env[name];
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local (see .env.example).`);
    process.exit(1);
  }
  return value;
}

export const PB_URL = (env.pockethost_url || env.VITE_PB_URL || 'https://ksfkitale.pockethost.io').replace(/\/+$/, '');
export const ADMIN_EMAIL = required('pockethost_admin_email');
export const ADMIN_PASS = required('pockethost_admin_password');

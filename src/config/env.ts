import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

/**
 * Single place for everything that changes between environments.
 * Override with environment variables, e.g. `BASE_URL=https://staging.example.com npm test`.
 */
export const env = {
  baseURL: process.env.BASE_URL ?? 'https://epicbet.com',
  headless: ['1', 'true'].includes(process.env.HEADLESS ?? ''),
  isCI: !!process.env.CI,
};

/** Per the assignment brief: test traffic identifies itself with this User-Agent suffix. */
export const TEST_TRAFFIC_MARKER = 'SisuTestAssignment';

/** Saved browser state (cookie-consent choice). One file per browser. */
export const storageStateFor = (browserName: string) => `playwright/.auth/${browserName}.json`;

export type Credentials = { email: string; password: string };

const CREDENTIALS_FILE = path.join(__dirname, '..', '..', 'credentials1.json');

/**
 * Login test data for an UNREGISTERED user.
 * CI: LOGIN_EMAIL / LOGIN_PASSWORD (repository secrets). Locally: the git-ignored credentials1.json.
 */
export function loadCredentials(): Credentials | undefined {
  const { LOGIN_EMAIL, LOGIN_PASSWORD } = process.env;
  if (LOGIN_EMAIL && LOGIN_PASSWORD) return { email: LOGIN_EMAIL, password: LOGIN_PASSWORD };
  if (existsSync(CREDENTIALS_FILE)) return JSON.parse(readFileSync(CREDENTIALS_FILE, 'utf-8'));
  return undefined;
}

export interface Credential {
  username: string;
  password: string;
}

const loadCredentials = (): Credential[] => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./credentials.json') as Credential[];
  } catch {
    throw new Error(
      'tests/data/credentials.json not found. Copy credentials.example.json → credentials.json and fill in your values.',
    );
  }
};

export const getTestUser = (): Credential => {
  const credentials = loadCredentials();
  const user = credentials[0];
  if (!user) throw new Error('No credentials found in credentials.json');
  return user;
};

export const getUserByUsername = (username: string): Credential => {
  const credentials = loadCredentials();
  const user = credentials.find((u) => u.username === username);
  if (!user) throw new Error(`User "${username}" not found in credentials.json`);
  return user;
};

export interface User {
  email?: string | null;
  pan_number?: string | null;
  phone: string; // This is our unique identifier
  capital_commitment?: string | null;
  checked?: string | null;
  onboarded?: boolean | null;
}

export interface FileUserData {
  fileName: string;
  users: User[];
}

export type UserDataStore = Record<string, User[]>;

export type DBError = Error | null;

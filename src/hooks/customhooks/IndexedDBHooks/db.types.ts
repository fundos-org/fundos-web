export interface User {
  email?: string | null;
  pan_number?: string | null;
  phone: number; // This is our unique identifier
  capital_commitment?: number | null;
  checked?: string | null;
  onboarded?: boolean | null;
}

export interface FileUserData {
  fileName: string;
  users: User[];
}

export type UserDataStore = Record<string, User[]>;

export type DBError = Error | null;

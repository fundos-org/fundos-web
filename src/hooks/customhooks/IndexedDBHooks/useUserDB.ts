import { useState, useEffect, useCallback } from 'react';
import { UserDBService } from './UserDBService';
import { User, DBError } from './db.types';

export const useUserDB = () => {
  const [dbService] = useState(() => new UserDBService());
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<DBError>(null);

  // Initialize DB on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        await dbService.initialize();
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to initialize database')
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initDB();
  }, [dbService]);

  const handleOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      try {
        setError(null);
        return await operation();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    []
  );

  const upsertUsers = useCallback(
    (fileName: string, users: User[]) =>
      handleOperation(() => dbService.upsertUsers(fileName, users)),
    [handleOperation, dbService]
  );

  const getUsers = useCallback(
    (fileName: string) => handleOperation(() => dbService.getUsers(fileName)),
    [handleOperation, dbService]
  );

  const getAllData = useCallback(
    () => handleOperation(() => dbService.getAllData()),
    [handleOperation, dbService]
  );

  const updateUserByPhone = useCallback(
    (phone: string, updates: Partial<User>) =>
      handleOperation(() => dbService.updateUserByPhone(phone, updates)),
    [handleOperation, dbService]
  );

  const deleteFile = useCallback(
    (fileName: string) => handleOperation(() => dbService.deleteFile(fileName)),
    [handleOperation, dbService]
  );

  const deleteUser = useCallback(
    (fileName: string, phone: string) =>
      handleOperation(() => dbService.deleteUser(fileName, phone)),
    [handleOperation, dbService]
  );

  const fileNames = useCallback(
    () => handleOperation(() => dbService.fileNames()),
    [handleOperation, dbService]
  );

  return {
    isInitializing,
    error,
    upsertUsers,
    getUsers,
    getAllData,
    fileNames,
    updateUserByPhone,
    deleteFile,
    deleteUser,
  };
};

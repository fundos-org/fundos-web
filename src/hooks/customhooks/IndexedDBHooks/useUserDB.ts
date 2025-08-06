import { useState, useEffect, useCallback } from 'react';
import { UserDBService } from './UserDBService';
import { User, DBError } from './db.types';

export const useUserDB = () => {
  const [dbService] = useState(() => new UserDBService());
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<DBError>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  // Initialize DB on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        await dbService.initialize();
        setError(null);
        // Fetch file names after DB init
        const names = await dbService.fileNames();
        setFileNames(names);
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
    async (fileName: string, users: User[]) => {
      await handleOperation(() => dbService.upsertUsers(fileName, users));
      const names = await dbService.fileNames();
      setFileNames(names);
    },
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
    async (fileName: string) => {
      await handleOperation(() => dbService.deleteFile(fileName));
      const names = await dbService.fileNames();
      setFileNames(names);
    },
    [handleOperation, dbService]
  );

  const deleteUser = useCallback(
    (fileName: string, phone: string) =>
      handleOperation(() => dbService.deleteUser(fileName, phone)),
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

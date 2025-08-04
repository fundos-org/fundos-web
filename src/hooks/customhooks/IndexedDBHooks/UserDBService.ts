/* eslint-disable prettier/prettier */
import { FileUserData, User, UserDataStore } from './db.types';

export class UserDBService {
    private readonly dbName: string = 'bulk-onboarding-user-db';
    private readonly storeName: string = 'userBulkFiles';
    private readonly dbVersion: number = 1;
    private db: IDBDatabase | null = null;

    public async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                reject(new Error(`Database error: ${request.error?.message}`));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'fileName' });
                }
            };
        });
    }

    private async ensureInitialized(): Promise<IDBDatabase> {
        if (!this.db) {
            await this.initialize();
        }
        return this.db as IDBDatabase;
    }

    public async upsertUsers(fileName: string, users: User[]): Promise<void> {
        const db = await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            const getRequest = store.get(fileName);

            getRequest.onsuccess = () => {
                const existingData: FileUserData | undefined = getRequest.result;
                const existingUsers: User[] = existingData?.users || [];

                // Merge users by phone number
                const userMap = new Map<number, User>();

                // Add existing users to map
                existingUsers.forEach(user => userMap.set(user?.phone, user));

                // Add/update with new users
                users.forEach(user => userMap.set(user.phone, user));

                const updatedUsers = Array.from(userMap.values());

                const putRequest = store.put({
                    fileName,
                    users: updatedUsers,
                });

                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    public async getUsers(fileName: string): Promise<User[]> {
        const db = await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(fileName);

            request.onsuccess = () => {
                const data: FileUserData | undefined = request.result;
                resolve(data?.users || []);
            };

            request.onerror = () => reject(request.error);
        });
    }

    public async getAllData(): Promise<UserDataStore> {
        const db = await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                const result: UserDataStore = {};
                const allData: FileUserData[] = request.result;

                allData.forEach(item => {
                    result[item.fileName] = item.users;
                });

                resolve(result);
            };

            request.onerror = () => reject(request.error);
        });
    }

    public async updateUserByPhone(
        phone: number,
        updates: Partial<User>
    ): Promise<void> {
        const db = await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = async () => {
                const allFiles: FileUserData[] = request.result;
                const updatePromises: Promise<void>[] = [];

                for (const fileData of allFiles) {
                    const userIndex = fileData.users.findIndex(
                        user => user.phone === phone
                    );

                    if (userIndex !== -1) {
                        const updatedUsers = [...fileData.users];
                        updatedUsers[userIndex] = {
                            ...updatedUsers[userIndex],
                            ...updates,
                        };

                        updatePromises.push(
                            new Promise((innerResolve, innerReject) => {
                                const updateRequest = store.put({
                                    fileName: fileData.fileName,
                                    users: updatedUsers,
                                });

                                updateRequest.onsuccess = () => innerResolve();
                                updateRequest.onerror = () => innerReject(updateRequest.error);
                            })
                        );
                    }
                }

                try {
                    await Promise.all(updatePromises);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    public async deleteFile(fileName: string): Promise<void> {
        const db = await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(fileName);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async deleteUser(fileName: string, phone: number): Promise<void> {
        const db = await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const getRequest = store.get(fileName);

            getRequest.onsuccess = () => {
                const fileData: FileUserData | undefined = getRequest.result;
                if (!fileData) {
                    resolve();
                    return;
                }

                const updatedUsers = fileData.users.filter(
                    user => user.phone !== phone
                );
                const putRequest = store.put({
                    fileName,
                    users: updatedUsers,
                });

                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }
}

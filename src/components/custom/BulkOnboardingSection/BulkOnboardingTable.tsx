import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/hooks/customhooks/IndexedDBHooks/db.types';
import { FC, useEffect, useState } from 'react';
import { memo } from 'react';

const BulkOnboardingTable: FC<{
  fileNames: string[];
  getUsers: (fileName: string) => Promise<User[]>;
}> = memo(({ fileNames, getUsers }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    setFiles(fileNames);
    setSelectedFile(fileNames[0] || null);
  }, [fileNames]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const userList = await getUsers(selectedFile ?? '');
        setUserList(userList);
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    };
    fetchUserList();
  }, [getUsers, selectedFile]);

  const handleChange = (value: string): void => {
    setSelectedFile(value);
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Bulk Onboarding User History</h2>
        {files.length > 0 ? (
          <Select onValueChange={handleChange} value={selectedFile ?? ''}>
            <SelectTrigger className="w-[400px] bg-white border border-gray-300 text-gray-700 rounded-lg">
              <SelectValue placeholder="Select File" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              {files?.map(filename => (
                <SelectItem key={filename} value={String(filename)} className="text-gray-900 hover:bg-gray-50 cursor-pointer">
                  {filename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-gray-500">No files available</span>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <TableHead className="font-semibold text-gray-900">Phone</TableHead>
            <TableHead className="font-semibold text-gray-900">Email</TableHead>
            <TableHead className="font-semibold text-gray-900">PAN Number</TableHead>
            <TableHead className="font-semibold text-gray-900 text-center">
              Capital Commitment
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Check Passed</TableHead>
            <TableHead className="font-semibold text-gray-900">Onboarded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList &&
            userList?.map((user, idx) => (
              <TableRow className="border-b border-gray-200 hover:bg-gray-50" key={idx + 1}>
                <TableCell className="font-medium text-gray-900">{user.phone}</TableCell>
                <TableCell className="font-medium text-gray-900">{user.email}</TableCell>
                <TableCell className="font-medium text-gray-900 capitalize">
                  {user.pan_number}
                </TableCell>
                <TableCell className="font-medium text-gray-900 text-center">
                  {user.capital_commitment}
                </TableCell>
                <TableCell className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.checked 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.checked ? 'Yes' : 'No'}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.onboarded 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.onboarded ? 'Yes' : 'No'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
});

export default BulkOnboardingTable;

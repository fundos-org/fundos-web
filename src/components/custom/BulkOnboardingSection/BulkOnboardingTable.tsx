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
    <div className="flex flex-col w-full border border-[#383739]">
      <div className="flex items-center justify-between p-4 bg-[#2A2A2B] border-b border-zinc-500">
        <h2 className="text-lg font-semibold">Bulk Onboarding User History</h2>
        {files.length > 0 ? (
          <Select onValueChange={handleChange} value={selectedFile ?? ''}>
            <SelectTrigger className="rounded-none w-[400px] cursor-pointer border border-[#383739] bg-black/40">
              <SelectValue placeholder="Select Sub-Admin" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              {files?.map(filename => (
                <SelectItem key={filename} value={String(filename)}>
                  {filename}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-gray-500">No files available</span>
        )}
      </div>
      <Table className="rounded-none">
        <TableHeader className="bg-[#2A2A2B]">
          <TableRow className="border-zinc-400/60">
            <TableHead className="text-zinc-400">Phone</TableHead>
            <TableHead className="text-zinc-400">Email</TableHead>
            <TableHead className="text-zinc-400">PAN Number</TableHead>
            <TableHead className="text-zinc-400 text-center">
              Capital Commitment
            </TableHead>
            <TableHead className="text-zinc-400">Check Passed</TableHead>
            <TableHead className="text-zinc-400">Onboarded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList &&
            userList?.map((user, idx) => (
              <TableRow className="border-[#2A2A2B]" key={idx + 1}>
                <TableCell className="font-medium">{user.phone}</TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell className="font-medium capitalize">
                  {user.pan_number}
                </TableCell>
                <TableCell className="font-medium text-center">
                  {user.capital_commitment}
                </TableCell>
                <TableCell className="font-medium">
                  {user.checked ? 'Yes' : 'No'}
                </TableCell>
                <TableCell className="font-medium">
                  {user.onboarded ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
});

export default BulkOnboardingTable;

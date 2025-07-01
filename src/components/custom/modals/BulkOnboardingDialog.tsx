import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { X, Pencil, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, memo, useEffect, useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const userSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid Email')
    .or(z.literal('').transform(() => undefined))
    .or(z.literal(null).transform(() => undefined)),
  panNumber: z
    .string()
    .min(1, 'PAN is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN')
    .or(z.literal('').transform(() => undefined))
    .or(z.literal(null).transform(() => undefined)),
  remark: z.string().optional(),
});

type UserData = {
  email: string | null | undefined;
  panNumber: string | null | undefined;
  remark?: string;
};

interface Props {
  data: UserData[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const BulkOnboardingDialog = memo(({ data, open, setOpen }: Props) => {
  const [rows, setRows] = useState<UserData[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setRows(
      data.map(row => ({
        ...row,
        remark: row.remark ?? '',
      }))
    );
    setSelected(data.map(() => true));
    setEditing({});
  }, [data]);

  const handleSelect = (idx: number) => {
    setSelected(prev => prev.map((val, i) => (i === idx ? !val : val)));
  };

  const handleInputChange = (
    idx: number,
    field: keyof UserData,
    value: string
  ) => {
    setRows(prev =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleEdit = (idx: number, field: keyof UserData) => {
    setEditing(prev => ({
      ...prev,
      [`${idx}-${field}`]: true,
    }));
  };

  const handleBlur = (idx: number, field: keyof UserData) => {
    setEditing(prev => ({
      ...prev,
      [`${idx}-${field}`]: false,
    }));
  };

  const handleDeleteRow = (idx: number) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
    setSelected(prev => prev.filter((_, i) => i !== idx));
  };

  const getValidation = (row: UserData) => {
    const safeRow = {
      ...row,
      email: row.email ?? '',
      panNumber: row.panNumber ?? '',
    };
    const result = userSchema.safeParse(safeRow);
    return {
      valid: result.success,
      errors: result.success ? {} : result.error.flatten().fieldErrors,
    };
  };

  const summary = rows.reduce(
    (acc, row) => {
      const { errors } = getValidation(row);
      if (!errors.email && !errors.panNumber) {
        acc.ready += 1;
      } else {
        acc.invalid += 1;
      }
      return { ...acc, total: acc.ready + acc.invalid };
    },
    { ready: 0, invalid: 0, total: 0 }
  );

  const handleConfirm = () => {
    const invalidRows = rows.filter(row => {
      const safeRow = {
        ...row,
        email: row.email ?? '',
        panNumber: row.panNumber ?? '',
      };
      return !userSchema.safeParse(safeRow).success;
    });

    if (invalidRows.length > 0) {
      toast.error('Please fix all invalid entries before confirming.');
      return;
    }

    // All valid
    console.log(rows);
    setOpen(false);
  };

  // ...styles...
  const fintechTable = 'min-w-full divide-y divide-[#232A36] text-sm';
  const fintechTh =
    'px-4 py-2 bg-[#232A36] text-left font-semibold text-[#B5B5B5]';
  const fintechTd = 'px-4 py-2 bg-[#181C23]';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideCloseButton={true}
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-6xl max-h-[90vh]"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl text-white flex items-center justify-between">
            Bulk Onboarding
            <DialogClose
              asChild
              className="border-[1px] border-[#383739] bg-[#242325]"
            >
              <span className="p-1">
                <X />
              </span>
            </DialogClose>
          </DialogTitle>
          <hr className="border-[#232A36] my-2" />
        </DialogHeader>

        {/* --- Professional summary bar --- */}
        <div className="flex flex-wrap gap-4 items-center justify-start mb-4">
          <div className="flex items-center gap-2 bg-[#232A36] px-8 py-4 text-gray-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            Total entries: <span className="text-white">{summary.total}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#232A36] px-8 py-4 text-green-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Ready to onboard:{' '}
            <span className="text-white">{summary.ready}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#232A36] px-8 py-4 text-red-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Invalid entries:{' '}
            <span className="text-white">{summary.invalid}</span>
          </div>
        </div>
        {/* --- End summary bar --- */}

        <div className="overflow-x-auto h-auto max-h-[50vh]">
          {rows.length > 0 ? (
            <table className={fintechTable}>
              <thead className="sticky top-[-1px] z-10">
                <tr>
                  <th className={fintechTh + ' w-10'}>
                    <span className="sr-only">Select</span>
                  </th>
                  <th className={fintechTh}>Email</th>
                  <th className={fintechTh}>PAN Number</th>
                  <th className={fintechTh}>Remark</th>
                  <th className={fintechTh + ' w-10'}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((user, idx) => {
                  const { errors } = getValidation(user);
                  const emailInvalid = !!errors.email;
                  const panInvalid = !!errors.panNumber;
                  const remark =
                    !user.email || !user.panNumber
                      ? 'Empty Value'
                      : emailInvalid
                        ? 'Invalid Email'
                        : panInvalid
                          ? 'Invalid PAN'
                          : 'Ready to onboard';

                  return (
                    <tr
                      key={idx}
                      className="rounded-none shadow border border-[#232A36]"
                    >
                      <td className={fintechTd + ' text-center'}>
                        <Checkbox
                          checked={selected[idx]}
                          onCheckedChange={() => handleSelect(idx)}
                        />
                      </td>
                      <td className={fintechTd + ' relative'}>
                        {emailInvalid ||
                        !user.email ||
                        editing[`${idx}-email`] ? (
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              className="rounded-none bg-[#232A36] text-[#F87171] border border-red-500 focus-visible:ring-0 focus-visible:border-red-400"
                              value={user.email ?? ''}
                              placeholder="Enter email"
                              onChange={e =>
                                handleInputChange(idx, 'email', e.target.value)
                              }
                              onBlur={() => handleBlur(idx, 'email')}
                            />
                            <button
                              type="button"
                              className="text-gray-400 hover:text-blue-400"
                              tabIndex={-1}
                              onMouseDown={e => {
                                e.preventDefault();
                                setEditing(prev => ({
                                  ...prev,
                                  [`${idx}-email`]: true,
                                }));
                              }}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{user.email}</span>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-blue-400"
                              onClick={() => handleEdit(idx, 'email')}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className={fintechTd + ' relative'}>
                        {panInvalid ||
                        !user.panNumber ||
                        editing[`${idx}-panNumber`] ? (
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              className="rounded-none bg-[#232A36] text-[#F87171] border border-red-500 focus-visible:ring-0 focus-visible:border-red-400"
                              value={user.panNumber ?? ''}
                              placeholder="Enter PAN"
                              onChange={e =>
                                handleInputChange(
                                  idx,
                                  'panNumber',
                                  e.target.value
                                )
                              }
                              onBlur={() => handleBlur(idx, 'panNumber')}
                            />
                            <button
                              type="button"
                              className="text-gray-400 hover:text-blue-400"
                              tabIndex={-1}
                              onMouseDown={e => {
                                e.preventDefault();
                                setEditing(prev => ({
                                  ...prev,
                                  [`${idx}-panNumber`]: true,
                                }));
                              }}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono tracking-wider">
                              {user.panNumber}
                            </span>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-blue-400"
                              onClick={() => handleEdit(idx, 'panNumber')}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className={fintechTd}>
                        <span
                          className={
                            remark === 'Ready to onboard'
                              ? 'text-green-400 font-semibold'
                              : 'text-red-400 font-semibold'
                          }
                        >
                          {remark}
                        </span>
                      </td>
                      <td className={fintechTd + ' text-center'}>
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-600"
                          onClick={() => handleDeleteRow(idx)}
                          title="Delete row"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No valid users to display.</p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            Showing {rows.length} users records
          </p>
        </div>
        <Button
          className="rounded-none text-black mx-auto"
          variant="outline"
          onClick={handleConfirm}
        >
          Confirm Onboarding
        </Button>
      </DialogContent>
    </Dialog>
  );
});

export default BulkOnboardingDialog;

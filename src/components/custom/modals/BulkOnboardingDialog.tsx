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
import { X, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, memo, useEffect, useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { BulkOnboardingUserData } from '@/constants/dashboardConstant';
import { useBulkOnboarding } from '@/hooks/customhooks/AdminHooks/useBulkOnboarding';

const userSchema = z.object({
  email: z
    .email('Invalid Email')
    .min(1, 'Email is required')
    .or(z.literal('').transform(() => undefined))
    .or(z.literal(null).transform(() => undefined)),
  pan_number: z
    .string()
    .min(1, 'PAN is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN')
    .or(z.literal('').transform(() => undefined))
    .or(z.literal(null).transform(() => undefined)),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .or(z.literal('').transform(() => undefined))
    .or(z.literal(null).transform(() => undefined)),
  capital_commitment: z
    .string()
    .min(1, 'Capital commitment is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid capital commitment')
    .or(z.literal('').transform(() => undefined))
    .or(z.literal(null).transform(() => undefined)),
  remark: z.string().optional(),
});

interface Props {
  data: BulkOnboardingUserData[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const fintechTable = 'min-w-full divide-y divide-[#232A36] text-sm';
const fintechTh =
  'px-4 py-2 bg-[#232A36] text-left font-semibold text-[#B5B5B5]';
const fintechTd = 'px-4 py-2 bg-[#181C23]';

const borderDanger =
  'text-[#F87171] border border-red-500 focus-visible:ring-0 focus-visible:border-red-400';
const borderNormal =
  'text-white border-[#383739] focus-visible:ring-0 focus-visible:border-blue-400';

const BulkOnboardingDialog = memo(({ data, open, setOpen }: Props) => {
  const [rows, setRows] = useState<BulkOnboardingUserData[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const { mutateAsync } = useBulkOnboarding();

  useEffect(() => {
    setRows(
      data.map(row => ({
        ...row,
        remark: row.remark ?? '',
      }))
    );
    setSelected(data.map(() => true));
    setInputErrors({});
  }, [data]);

  const handleSelect = (idx: number) => {
    setSelected(prev => prev.map((val, i) => (i === idx ? !val : val)));
  };

  const validateField = (
    field: keyof BulkOnboardingUserData,
    value: string
  ) => {
    const schema = userSchema.shape[field];
    const result = schema.safeParse(value || '');
    return result.success
      ? ''
      : result.error.issues[0]?.message || 'Invalid input';
  };

  const handleInputChange = (
    idx: number,
    field: keyof BulkOnboardingUserData,
    value: string
  ) => {
    setRows(prev =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

    // Validate in real-time and update inputErrors
    const error = validateField(field, value);
    setInputErrors(prev => ({
      ...prev,
      [`${idx}-${field}`]: error,
    }));
  };

  const handleBlur = (idx: number, field: keyof BulkOnboardingUserData) => {
    const value = rows[idx][field] ?? '';
    const error = validateField(field, value);
    if (!error) {
      setInputErrors(prev => ({
        ...prev,
        [`${idx}-${field}`]: '',
      }));
    } else {
      setInputErrors(prev => ({
        ...prev,
        [`${idx}-${field}`]: error,
      }));
    }
  };

  const handleDeleteRow = (idx: number) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
    setSelected(prev => prev.filter((_, i) => i !== idx));
    setInputErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${idx}-`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const getValidation = (row: BulkOnboardingUserData) => {
    const safeRow = {
      ...row,
      email: row.email ?? '',
      pan_number: row.pan_number ?? '',
      phone: row.phone ?? '',
      capital_commitment: row.capital_commitment ?? '',
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
      if (
        !errors.email &&
        !errors.pan_number &&
        !errors.phone &&
        !errors.capital_commitment
      ) {
        acc.ready += 1;
      } else {
        acc.invalid += 1;
      }
      return { ...acc, total: acc.ready + acc.invalid };
    },
    { ready: 0, invalid: 0, total: 0 }
  );

  const handleConfirm = async () => {
    const invalidRows = rows.filter(row => {
      const safeRow = {
        ...row,
        email: row.email ?? '',
        pan_number: row.pan_number ?? '',
        phone: row.phone ?? '',
        capital_commitment: row.capital_commitment ?? '',
      };
      return !userSchema.safeParse(safeRow).success;
    });

    if (invalidRows.length > 0) {
      toast.error('Please fix all invalid entries before confirming.');
      return;
    }
    const data = rows.map(({ remark, ...row }) => {
      void remark;
      return row;
    });
    const result = await mutateAsync(data);
    console.log(rows, result);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideCloseButton={true}
        className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-8xl"
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

        <div className="flex flex-wrap gap-4 items-center justify-start mb-4">
          <div className="flex items-center gap-2 bg-[#232A36] px-8 py-4 text-gray-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            Total entries: <span className="text-white">{summary.total}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#232A36] px-8 py-4 text-green-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Valid: <span className="text-white">{summary.ready}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#232A36] px-8 py-4 text-red-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Invalid entries:{' '}
            <span className="text-white">{summary.invalid}</span>
          </div>
        </div>

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
                  <th className={fintechTh}>Phone Number</th>
                  <th className={fintechTh}>Capital Commitment</th>
                  <th className={fintechTh}>Remark</th>
                  <th className={fintechTh + ' w-10'}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((user, idx) => {
                  const { errors } = getValidation(user);
                  const emailInvalid =
                    !!errors.email || !!inputErrors[`${idx}-email`];
                  const panInvalid =
                    !!errors.pan_number || !!inputErrors[`${idx}-pan`];
                  const phoneInvalid =
                    !!errors.phone || !!inputErrors[`${idx}-phone`];
                  const capitalInvalid =
                    !!errors.capital_commitment || !!inputErrors[`${idx}-cc`];
                  const remark = getRemark(user, {
                    emailInvalid,
                    panInvalid,
                    phoneInvalid,
                    capitalInvalid,
                  });

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
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              className={`rounded-none bg-[#232A36] ${
                                inputErrors[`${idx}-email`]
                                  ? borderDanger
                                  : borderNormal
                              }`}
                              value={user.email ?? ''}
                              placeholder="Enter email"
                              onChange={e =>
                                handleInputChange(idx, 'email', e.target.value)
                              }
                              onBlur={() => handleBlur(idx, 'email')}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={fintechTd + ' relative'}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              className={`rounded-none bg-[#232A36] ${
                                inputErrors[`${idx}-pan`]
                                  ? borderDanger
                                  : borderNormal
                              }`}
                              value={user.pan_number ?? ''}
                              placeholder="Enter PAN"
                              onChange={e =>
                                handleInputChange(
                                  idx,
                                  'pan_number',
                                  e.target.value
                                )
                              }
                              onBlur={() => handleBlur(idx, 'pan_number')}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={fintechTd + ' relative'}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              minLength={10}
                              maxLength={10}
                              className={`rounded-none bg-[#232A36] ${
                                inputErrors[`${idx}-phone`]
                                  ? borderDanger
                                  : borderNormal
                              }`}
                              value={user.phone ?? ''}
                              placeholder="Enter phone number"
                              onChange={e =>
                                handleInputChange(idx, 'phone', e.target.value)
                              }
                              onBlur={() => handleBlur(idx, 'phone')}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={fintechTd + ' relative'}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              className={`rounded-none bg-[#232A36] ${
                                inputErrors[`${idx}-cc`]
                                  ? borderDanger
                                  : borderNormal
                              }`}
                              value={user.capital_commitment ?? ''}
                              placeholder="Enter capital commitment"
                              onChange={e =>
                                handleInputChange(
                                  idx,
                                  'capital_commitment',
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                handleBlur(idx, 'capital_commitment')
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td className={fintechTd}>
                        <span
                          className={
                            remark === 'Valid Values'
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
                          className="text-red-400 hover:text-red-600 cursor-pointer"
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

const getRemark = (
  user: BulkOnboardingUserData,
  validationFlags: Record<string, boolean>
) => {
  if (
    !user.email ||
    !user.pan_number ||
    !user.phone ||
    !user.capital_commitment
  ) {
    return 'Empty Values';
  }

  if (validationFlags.emailInvalid) return 'Invalid Email';
  if (validationFlags.panInvalid) return 'Invalid PAN';
  if (validationFlags.phoneInvalid) return 'Invalid Phone';
  if (validationFlags.capitalInvalid) return 'Invalid CC';

  return 'Valid Values';
};

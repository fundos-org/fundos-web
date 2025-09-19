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
import { X, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useState,
} from 'react';
import { z } from 'zod';
import { BulkOnboardingUserData } from '@/constants/dashboardConstant';
import { useNotification } from '../NotificationProvider';
import { useBulkOnboarding } from '@/hooks/customhooks/AdminHooks/useBulkOnboarding';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const userSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid Email'),
  pan_number: z
    .string()
    .min(1, 'PAN is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  capital_commitment: z
    .string()
    .min(1, 'Capital commitment is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid capital commitment'),
  remark: z.string().optional(),
});

interface Props {
  data: BulkOnboardingUserData[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const fintechTable = 'min-w-full text-sm';
const fintechTh =
  'px-4 py-2 bg-gray-50 text-left font-semibold text-gray-900';
const fintechTd = 'px-4 py-2 bg-white';

const borderDanger =
  'text-red-600 border border-red-500 focus-visible:ring-0 focus-visible:border-red-400';
const borderNormal =
  'text-gray-900 border-gray-200 focus-visible:ring-0 focus-visible:border-blue-400';

const BulkOnboardingDialog = memo(({ data, open, setOpen }: Props) => {
  const [rows, setRows] = useState<BulkOnboardingUserData[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  
  const notification = useNotification();
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

  const validateField = (field: string, value: string) => {
    const schema =
      userSchema.shape[field as keyof Omit<BulkOnboardingUserData, 'remark'>];
    const result = schema.safeParse(value);
    return result.success
      ? ''
      : result.error.issues[0]?.message || 'Invalid input';
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      dataset: { idx },
      name: field,
      value,
    } = event.target;
    setRows(prev =>
      prev.map((row, i) =>
        i === Number(idx) ? { ...row, [field]: value } : row
      )
    );

    // Validate in real-time and update inputErrors
    const error = validateField(field, value);
    setInputErrors(prev => ({
      ...prev,
      [`${idx}-${field}`]: error,
    }));
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

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      {
        email: '',
        pan_number: '',
        phone: '',
        capital_commitment: '',
        remark: '',
      },
    ]);
    setSelected(prev => [...prev, true]);
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

  const getErrorMessages = (user: BulkOnboardingUserData) => {
    const { errors } = getValidation(user);
    const messages: string[] = [];

    Object.entries(errors).forEach(([field, fieldErrors]) => {
      if (fieldErrors) {
        messages.push(
          ...fieldErrors.map(
            msg =>
              `${field
                .replace('_', ' ')
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}: ${msg}`
          )
        );
      }
    });

    return messages;
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
      notification.error('Invalid Entries', 'Please fix all invalid entries before confirming.');
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
        className="bg-white border border-gray-200 rounded-lg shadow-xl sm:max-w-7xl max-h-[90vh] p-0 overflow-hidden"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader className="border-b border-gray-200 p-6">
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <div>Bulk Onboarding Review</div>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />
                  <span className="text-sm font-medium text-gray-700">
                    Total entries: <span className="font-bold text-gray-900">{summary.total}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
                  <span className="text-sm font-medium text-green-700">
                    Valid: <span className="font-bold text-green-800">{summary.ready}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                  <span className="text-sm font-medium text-red-700">
                    Invalid entries: <span className="font-bold text-red-800">{summary.invalid}</span>
                  </span>
                </div>
              </div>
            </div>
            <DialogClose
              asChild
              className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
            >
              <span className="p-2">
                <X className="w-5 h-5 text-gray-600" />
              </span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 p-6 bg-white overflow-y-auto">
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
                {rows.map((user, idx) => {
                  const { errors } = getValidation(user);
                  const emailInvalid =
                    !!errors.email || !!inputErrors[`${idx}-email`];
                  const panInvalid =
                    !!errors.pan_number || !!inputErrors[`${idx}-pan_number`];
                  const phoneInvalid =
                    !!errors.phone || !!inputErrors[`${idx}-phone`];
                  const capitalInvalid =
                    !!errors.capital_commitment ||
                    !!inputErrors[`${idx}-capital_commitment`];
                  const errorMessages = getErrorMessages(user);

                  return (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50"
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
                              className={`bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded-lg ${
                                emailInvalid ? borderDanger : borderNormal
                              }`}
                              value={user.email ?? ''}
                              placeholder="Enter email"
                              data-idx={idx}
                              name="email"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={fintechTd + ' relative'}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              className={`bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded-lg ${
                                panInvalid ? borderDanger : borderNormal
                              }`}
                              value={user.pan_number ?? ''}
                              placeholder="Enter PAN"
                              data-idx={idx}
                              name="pan_number"
                              onChange={handleInputChange}
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
                              className={`bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded-lg ${
                                phoneInvalid ? borderDanger : borderNormal
                              }`}
                              data-idx={idx}
                              name="phone"
                              value={user.phone ?? ''}
                              placeholder="Enter phone number"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={fintechTd + ' relative'}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Input
                              autoFocus
                              className={`bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded-lg ${
                                capitalInvalid ? borderDanger : borderNormal
                              }`}
                              data-idx={idx}
                              name="capital_commitment"
                              value={user.capital_commitment ?? ''}
                              placeholder="Enter capital commitment"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={fintechTd + ' text-center'}>
                        {errorMessages.length === 0 ? (
                          <CheckCircle
                            className="text-green-400 mx-auto"
                            size={18}
                          />
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle
                                  className="text-red-400 cursor-help mx-auto"
                                  size={18}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <ul className="list-disc pl-4 space-y-1">
                                  {errorMessages.map((msg, i) => (
                                    <li key={i}>{msg}</li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
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
            <p className="text-gray-500 text-center py-8">No valid users to display.</p>
          )}
          <p className="text-gray-600 text-sm mt-4">
            Showing {rows.length} user records
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-6 py-2.5 font-medium transition-colors"
            variant="outline"
            onClick={handleAddRow}
          >
            Add New Row
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-medium transition-colors"
            onClick={handleConfirm}
          >
            Confirm Onboarding
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default BulkOnboardingDialog;

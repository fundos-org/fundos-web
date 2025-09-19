import { Clipboard, Check, SquareArrowOutUpRight } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { AppEnums } from '@/constants/enums';

const ShortDetailsPopover = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
  };

  const sessionData = JSON.parse(
    sessionStorage.getItem(AppEnums.SUBADMIN_SESSION) || '{}'
  );
  const fields = [
    { label: 'Role', key: 'role', value: sessionData.role || '' },
    { label: 'Name', key: 'name', value: sessionData.name || '' },
    { label: 'Logo', key: 'logo', value: sessionData.logo || '' },
    {
      label: 'Invite Code',
      key: 'invite_code',
      value: sessionData.invite_code || '',
    },
    { label: 'Email', key: 'email', value: sessionData.email || '' },
    { label: 'Contact', key: 'contact', value: sessionData.contact || '' },
    { label: 'Username', key: 'username', value: sessionData.username || '' },
    { label: 'About', key: 'about', value: sessionData.about || '' },
    { label: 'App Link', key: 'app_link', value: sessionData.app_link || '' },
    { label: 'App Name', key: 'app_name', value: sessionData.app_name || '' },
  ];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex-1 cursor-pointer">
          <div className="flex gap-2 items-center">
            <h4 className="text-gray-900 font-medium capitalize">
              {sessionData?.name ?? 'User'}
            </h4>
            <SquareArrowOutUpRight className="text-gray-500 w-4 hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-sm text-gray-600">
            {sessionData?.invite_code ?? 'You dont need invite code 😉'}
          </p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-3xl max-h-[85vh] overflow-y-auto p-4">
        <AlertDialogHeader className="pb-3">
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Account Details
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            View your account details below. Click the copy icon to copy each value.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 py-2">
          {fields.map(({ label, key, value }) => (
            <div key={key} className="flex items-center gap-4">
              <label className="w-24 text-xs font-medium text-gray-600 uppercase tracking-wide flex-shrink-0">{label}</label>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={value}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 pr-10 rounded-lg text-sm focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(value, key)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-md transition-colors"
                  aria-label={`Copy ${label}`}
                >
                  {copiedField === key ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Clipboard size={14} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <AlertDialogFooter className="pt-3">
          <AlertDialogCancel className="cursor-pointer border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-4 py-2 font-medium transition-colors">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShortDetailsPopover;

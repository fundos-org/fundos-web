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
          <div className="flex gap-2">
            <h4 className="text-white font-medium capitalize">
              {sessionData?.name ?? 'User'}
            </h4>
            <SquareArrowOutUpRight className="text-gray-400 w-4 hover:text-white" />
          </div>
          <p className="text-sm text-gray-400">
            {sessionData?.invite_code ?? 'You dont need invite code 😉'}
          </p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 text-white border-gray-700 rounded-none min-w-2xl p-10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Account Details
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
            View your account details below. Click the copy icon to copy each
            value.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          {fields.map(({ label, key, value }) => (
            <div key={key} className="flex items-center gap-2">
              <label className="w-1/5 text-sm text-gray-300">{label}</label>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={value}
                  readOnly
                  className="w-full bg-gray-800 text-white border-none rounded-none px-3 py-2 text-sm focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(value, key)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full"
                  aria-label={`Copy ${label}`}
                >
                  {copiedField === key ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Clipboard size={16} className="text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer bg-gray-800 px-10 text-white hover:bg-gray-700 border-gray-700 rounded-none">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShortDetailsPopover;

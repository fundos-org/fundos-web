import { addMember } from '@/axioscalls/apiServices';
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppEnums } from '@/constants/enums';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotification } from '../NotificationProvider';

export default function AddMemberDialog() {
  const notification = useNotification();
  const [email, setEmail] = useState('');
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);
  const [session] = useState(() =>
    JSON.parse(sessionStorage.getItem(AppEnums.SUBADMIN_SESSION) || '{}')
  );

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmailValid = email.trim() !== '' && isValidEmail(email);

  // Clear invited email after 4 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (invitedEmail) {
      timeoutId = setTimeout(() => {
        setInvitedEmail(null);
      }, 6000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [invitedEmail]);

  const handleClick = async () => {
    const response = await addMember(email);
    if (!response) {
      notification.error('Invite Failed', 'Failed to send invite');
      setInvitedEmail(null);
    }
    if (response.message) {
      notification.success('Invite Sent', response.message);
      setInvitedEmail(email);
      setEmail(''); // Clear input after successful invite
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(session.invite_code)
      .then(() => {
        notification.success('Code Copied', 'Invite code copied to clipboard!');
      })
      .catch(() => {
        notification.error('Copy Failed', 'Failed to copy code.');
      });
  };

  return (
    <DialogContent
      className="bg-white border border-gray-200 rounded-lg shadow-xl sm:max-w-2xl max-h-[90vh] p-6"
      hideCloseButton={true}
      aria-describedby={undefined}
      onInteractOutside={e => e.preventDefault()}
    >
      <div className="text-gray-900">
        <DialogHeader className="border-b border-gray-200 pb-4 mb-6">
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
            Add Member
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

        {/* <div className="border-t border-zinc-700 mb-6" /> */}

        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Email Address
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                className={`font-medium px-6 py-3 rounded-lg transition-colors ${
                  isEmailValid 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleClick}
                disabled={!isEmailValid}
              >
                Send Invite
              </button>
            </div>
            {invitedEmail && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                Invite sent to {invitedEmail}
              </div>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500 my-6">
            <div className="border-t border-gray-200 flex-1"></div>
            <span className="px-3">OR</span>
            <div className="border-t border-gray-200 flex-1"></div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                  Invite Code
                </label>
                <p className="font-mono text-lg font-bold text-gray-900 tracking-wider">
                  {session.invite_code}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

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
import toast from 'react-hot-toast';

export default function AddMemberDialog() {
  const [email, setEmail] = useState('');
  const [copied] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);
  const [session] = useState(() =>
    JSON.parse(sessionStorage.getItem(AppEnums.SUBADMIN_SESSION) || '{}')
  );

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
      toast.error('Failed to send invite');
      setInvitedEmail(null);
    }
    if (response.message) {
      toast.success(response.message);
      setInvitedEmail(email);
      setEmail(''); // Clear input after successful invite
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(session.invite_code)
      .then(() => {
        toast.success('Code copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy code.');
      });
  };

  return (
    <DialogContent
      className="border-0 rounded-none bg-[#181C23] text-white sm:max-w-2xl min-h-[50vh] max-h-[90vh]"
      hideCloseButton={true}
      aria-describedby={undefined}
      onInteractOutside={e => e.preventDefault()}
    >
      <div className="text-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-3xl text-white flex items-center justify-between">
            Add member
            <DialogClose
              asChild
              className="border-[1px] border-[#383739] bg-[#242325] cursor-pointer"
            >
              <span className="p-1">
                <X />
              </span>
            </DialogClose>
          </DialogTitle>
          <hr className="border-[#232A36] my-2" />
        </DialogHeader>

        {/* <div className="border-t border-zinc-700 mb-6" /> */}

        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-1 tracking-wide">
            EMAIL
          </label>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-transparent border border-zinc-700 text-white p-2 outline-none"
            />
            <button
              className="bg-white text-black px-6 ml-2 font-semibold cursor-pointer"
              onClick={handleClick}
            >
              Invite
            </button>
          </div>
          {invitedEmail && (
            <div className="mt-2 text-sm text-emerald-500">
              ✓ Invite sent to {invitedEmail}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center text-sm text-zinc-500 mb-6">
          <div className="border-t border-zinc-700 w-full"></div>
          <span className="mx-2">OR</span>
          <div className="border-t border-zinc-700 w-full"></div>
        </div>

        <div className="flex items-center justify-between border border-zinc-700 p-4">
          <div>
            <p className="text-xs text-zinc-400 mb-1">INVITE CODE</p>
            <p className="font-bold text-lg tracking-wider">
              {session.invite_code}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="bg-white text-black px-4 py-2 font-medium transition hover:bg-zinc-200"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </DialogContent>
  );
}

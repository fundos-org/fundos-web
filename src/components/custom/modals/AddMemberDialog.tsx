import { addMember } from '@/axioscalls/apiServices';
import { DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AddMemberDialog() {
  const [email, setEmail] = useState('');
  const [copied] = useState(false);
  const [session] = useState(() => {
    return JSON.parse(sessionStorage.getItem('subadmindetails') || '{}');
  });

  const handleClick = async () => {
    const response = await addMember(session.subadmin_id, email);
    if (!response) {
      toast.error('Failed to send invite');
    }
    if (response.message) {
      toast.success(response.message);
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
    <DialogContent className="border-0 max-w-[550px] rounded-none bg-[#1a1a1a] text-white">
      <div className="text-white rounded-none shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Add member</h2>

        <div className="border-t border-zinc-700 mb-6" />

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
              className="bg-white text-black px-6 ml-2 font-semibold"
              onClick={handleClick}
            >
              Invite
            </button>
          </div>
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

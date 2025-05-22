import { DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';

export default function AddMemberDialog() {
  const [emails, setEmails] = useState('');
  const [copied, setCopied] = useState(false);
  const inviteCode = 'TY7664774';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <DialogContent className="border-0 max-w-[550px] rounded-none bg-[#1a1a1a] text-white">
      <div className="text-white rounded-none shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Add member</h2>

        <div className="border-t border-zinc-700 mb-6" />

        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-1 tracking-wide">
            EMAILS
          </label>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter emails"
              value={emails}
              onChange={e => setEmails(e.target.value)}
              className="flex-1 bg-transparent border border-zinc-700 text-white p-2 outline-none"
            />
            <button className="bg-gray-500 text-black px-4 ml-2 font-semibold">
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
            <p className="font-bold text-lg tracking-wider">{inviteCode}</p>
          </div>
          <button
            onClick={handleCopy}
            className="bg-white text-black px-4 py-2 font-medium transition hover:bg-zinc-200"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </DialogContent>
  );
}

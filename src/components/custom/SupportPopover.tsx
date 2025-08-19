import { HelpCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

const SupportPopover = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          aria-label="Log out"
          className="flex gap-3 hover:underline cursor-pointer"
        >
          <HelpCircle className="text-gray-400 hover:text-white" />
          Support
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 text-white border-gray-700 rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            fundos.services.com
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
            If you have any questions or concerns, please contact us via
            Whatsapp.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-800 px-10 text-white hover:bg-gray-700 border-gray-700 rounded-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="text-white hover:bg-slate-600 border border-[#383739] rounded-none cursor-pointer"
            asChild
          >
            {/* <a href="mailto:user.email.com">Send Email</a> */}
            <a
              href="https://wa.me/917406095777"
              target="_blank"
              rel="noopener noreferrer"
            >
              Whatsapp us
            </a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SupportPopover;

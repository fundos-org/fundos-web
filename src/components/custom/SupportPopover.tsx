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
          aria-label="Support"
          className="flex items-center gap-3 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          Support
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold text-gray-900">
            Need Help?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            If you have any questions or concerns, please contact us via WhatsApp. We're here to help!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-6 py-2.5 font-medium transition-colors">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2.5 font-medium transition-colors cursor-pointer"
            asChild
          >
            <a
              href="https://wa.me/917406095777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              WhatsApp Us
            </a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SupportPopover;

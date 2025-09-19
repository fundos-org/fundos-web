import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCommunicationEmails } from '@/hooks/customhooks/AdminHooks/useCommunicationEmails';
import { useEditCommunicationEmails } from '@/hooks/customhooks/AdminHooks/useEditCommunicationEmails';
import EmailEditor from './EmailEditor';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { useSubadminIds } from '@/hooks/customhooks/SubAdminsHooks/useSubadminIds';
import isThisSubadmin from '@/lib/isSubadmin';
import { useNotification } from '../NotificationProvider';

export type EmailTemplateKeys =
  | 'welcome_mail'
  | 'onboarding_mail'
  | 'consent_mail';

const CommunicationEmails: React.FC = () => {
  const { data: subadminIds, refetch: refetchIds } = useSubadminIds(false);
  const [subadminId, setSubAdminId] = useState<string | undefined>(
    subadminIds?.subadmins?.[0].subadmin_id
  );
  const [isSubadmin] = useState(isThisSubadmin);
  const [isRefreshing1, setIsRefreshing1] = useState<boolean>(false);
  const notification = useNotification();

  const {
    data: emails,
    isLoading,
    error,
  } = useCommunicationEmails(
    subadminId, 
    isSubadmin,
    () => {
      notification.success(
        'Data Loaded',
        'Email templates fetched successfully',
        { duration: 3000 }
      );
    },
    (error: Error) => {
      notification.error(
        'Loading Failed',
        `Failed to fetch email templates: ${error.message}`,
        { duration: 4000 }
      );
    }
  );

  const { mutate: updateEmail } = useEditCommunicationEmails(
    subadminId,
    () => {
      notification.success(
        'Template Updated',
        'Communication email template updated successfully',
        { duration: 4000 }
      );
    },
    (error: Error) => {
      notification.error(
        'Update Failed',
        error.message || 'Failed to update email template',
        { duration: 4000 }
      );
    }
  );

  if (isLoading) {
    return <div className="text-gray-600 p-4">Loading email templates...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">Error loading email templates</div>
    );
  }

  const emailTypes: { key: EmailTemplateKeys; label: string }[] = [
    { key: 'welcome_mail', label: 'Welcome Mail' },
    { key: 'onboarding_mail', label: 'Onboarding Mail' },
    { key: 'consent_mail', label: 'Consent & Drawdown Mail' },
  ];

  const handleSubAdminIdChange = (id: string) => setSubAdminId(id);
  const handleRefreshIds = async () => {
    setIsRefreshing1(true);
    try {
      await refetchIds();
    } finally {
      setTimeout(() => setIsRefreshing1(false), 500); // Small delay for better UX
    }
  };

  return (
    <>
      <div className="flex gap-3 mb-6">
        <Select onValueChange={handleSubAdminIdChange} value={subadminId ?? ''}>
          <SelectTrigger className="w-64 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg">
            <SelectValue placeholder="Select Sub-Admin" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {subadminIds?.subadmins?.map(subadmin => (
              <SelectItem
                className="text-gray-900 hover:bg-gray-50 cursor-pointer"
                key={subadmin?.subadmin_id}
                value={String(subadmin?.subadmin_id)}
              >
                {subadmin?.subadmin_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleRefreshIds}
          disabled={isRefreshing1}
          className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 rounded-lg px-3"
          title="Refresh data"
        >
          <RefreshCw
            className={`w-5 h-5 ${
              isRefreshing1 ? 'animate-spin' : ''
            } transition-transform duration-200`}
          />
        </Button>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        aria-label="Email templates accordion"
      >
        {emailTypes.map(({ key, label }, index) => (
          <AccordionItem
            key={key}
            value={`item-${index + 1}`}
            className="w-full border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {label}
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0">
              <EmailEditor
                mail={emails?.[key]}
                handleUpdateEmail={updateEmail}
                emailType={key}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default CommunicationEmails;

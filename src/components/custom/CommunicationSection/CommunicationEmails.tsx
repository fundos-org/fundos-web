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
import { AppEnums } from '@/constants/enums';

export type EmailTemplateKeys =
  | 'welcome_mail'
  | 'onboarding_mail'
  | 'consent_mail';

const returnBool = () => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const raw = subadminDetailsRaw ? JSON.parse(subadminDetailsRaw) : {};
  return raw?.role === 'subadmin';
};

const CommunicationEmails: React.FC = () => {
  const { data: subadminIds, refetch: refetchIds } = useSubadminIds(false);
  const [subadminId, setSubAdminId] = useState<string | undefined>(
    subadminIds?.subadmins?.[0].subadmin_id
  );
  const [isSubadmin] = useState(() => returnBool());
  const {
    data: emails,
    isLoading,
    error,
  } = useCommunicationEmails(subadminId, isSubadmin);
  const { mutate: updateEmail } = useEditCommunicationEmails(subadminId);
  const [isRefreshing1, setIsRefreshing1] = useState<boolean>(false);

  if (isLoading) {
    return <div className="text-white p-4">Loading email templates...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">Error loading email templates</div>
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
      <div className="flex mb-5">
        <Select onValueChange={handleSubAdminIdChange} value={subadminId ?? ''}>
          <SelectTrigger className="rounded-none w-[250px] cursor-pointer border border-[#383739] bg-black/40">
            <SelectValue placeholder="Select Sub-Admin" />
          </SelectTrigger>
          <SelectContent className="rounded-none bg-[#393738]">
            {subadminIds?.subadmins?.map(subadmin => (
              <SelectItem
                className="bg-[#2a2a2a] rounded-none text-white"
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
          className="rounded-none border border-[#383739] cursor-pointer"
          title="Refresh data"
        >
          <RefreshCw
            className={`w-5 h-5 text-zinc-400 ${
              isRefreshing1 ? 'animate-spin' : null
            } transition-transform duration-200 hover:text-zinc-300`}
          />
        </Button>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-2"
        aria-label="Email templates accordion"
      >
        {emailTypes.map(({ key, label }, index) => (
          <AccordionItem
            key={key}
            value={`item-${index + 1}`}
            className="w-full border-none px-5 pb-5 bg-[#383739]"
          >
            <AccordionTrigger className="cursor-pointer">
              {label}
            </AccordionTrigger>
            <AccordionContent>
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

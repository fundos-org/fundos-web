import CommunicationEmails from '@/components/custom/CommunicationSection/CommunicationEmails';
import { FC } from 'react';

const Communication: FC = () => {
  return (
    <>
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="fundos-dashboard-title text-gray-900">Communications</h1>
          <p className="fundos-dashboard-subtitle">
            Manage email templates and communication settings
          </p>
        </div>
      </header>

      <div className="mb-8">
        <CommunicationEmails />
      </div>
    </>
  );
};

export default Communication;

import CommunicationEmails from '@/components/custom/CommunicationSection/CommunicationEmails';
import { FC } from 'react';

const Communication: FC = () => {
  return (
    <>
      <h2 className="text-4xl">Communication</h2>
      <div className="mb-8"></div>
      <CommunicationEmails />
    </>
  );
};

export default Communication;

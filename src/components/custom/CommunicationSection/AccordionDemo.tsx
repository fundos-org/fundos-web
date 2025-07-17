import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import WelcomeEmailEditor from './WelcomeEmailEditor';
export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      <AccordionItem
        key="1"
        value={`item-${1}`}
        className="w-full border-none rounded-none px-5 pb-5 bg-[#383739] cursor-pointer"
      >
        <AccordionTrigger className="cursor-pointer">
          Welcome Mail
        </AccordionTrigger>
        <AccordionContent>
          <WelcomeEmailEditor
            welcome_mail={{
              subject: 'subject',
              body: 'lorem',
            }}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        key="2"
        value={`item-${2}`}
        className="w-full border-none rounded-none px-5 pb-5 bg-[#383739] cursor-pointer"
      >
        <AccordionTrigger className="cursor-pointer">
          Onboarding Mail
        </AccordionTrigger>
        <AccordionContent>
          <WelcomeEmailEditor
            welcome_mail={{
              subject: 'subject',
              body: 'lorem',
            }}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        key="3"
        value={`item-${3}`}
        className="w-full border-none rounded-none px-5 pb-5 bg-[#383739] cursor-pointer"
      >
        <AccordionTrigger className="cursor-pointer">
          Conscent & Drawdown Mail
        </AccordionTrigger>
        <AccordionContent>
          <WelcomeEmailEditor
            welcome_mail={{
              subject: 'subject',
              body: 'lorem',
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

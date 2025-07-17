import { stepsList } from '@/constants/dealsConstant';
import { Dispatch, FC, SetStateAction } from 'react';

type StepperDemoProps = {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
};
//text-green-600 border border-green-400 bg-green-100 completed css
//text-blue-700 bg-blue-100 border border-blue-300 in progress css
//text-gray-900 bg-gray-100 border border-gray-300 not yet started css
const StepperDemo: FC<StepperDemoProps> = ({ activeStep, setActiveStep }) => {
  return (
    <ol className="space-y-4 border-r border-[#393738]">
      {stepsList.map((step, idx) => {
        // Completed
        if (idx < activeStep) {
          return (
            <li key={step.index}>
              <div
                className="w-50 px-6 py-2 mr-6 bg-gray-800 border-green-800 text-green-400 cursor-pointer"
                role="status"
                onClick={() => setActiveStep(step.index)}
              >
                <div className="flex items-center justify-between">
                  <span className="sr-only">{step.label}</span>
                  <h3 className="font-medium">{`${step.index + 1}. ${step.label}`}</h3>
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </div>
              </div>
            </li>
          );
        }

        // In Progress
        if (idx === activeStep) {
          return (
            <li key={step.index}>
              <div
                className="w-50 px-6 py-2 mr-6  bg-gray-800 border-blue-800 text-blue-400 cursor-pointer"
                role="status"
                onClick={() => setActiveStep(step.index)}
              >
                <div className="flex items-center justify-between">
                  <span className="sr-only">{step.label}</span>
                  <h3 className="font-medium">{`${step.index + 1}. ${step.label}`}</h3>
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </div>
              </div>
            </li>
          );
        }

        // Not yet started
        return (
          <li key={step.index}>
            <div
              className="w-50 px-6 py-2 mr-6 bg-gray-800 border-gray-700 text-muted/10"
              role="status"
            >
              <div className="flex items-center justify-between">
                <span className="sr-only">{step.label}</span>
                <h3 className="font-medium">{`${step.index + 1}. ${step.label}`}</h3>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default StepperDemo;

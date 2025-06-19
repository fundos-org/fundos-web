import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
// import ImageInput from '../ImageUpload';
import { numberToIndianRupeesWords } from '@/lib/currencyToWords';
import FileInput from '../FileInput';

const Step4: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const pitchDeck = watch('pitchDeck');
  const pitchVideo = watch('pitchVideo');
  const currentValuation = watch('currentValuation');
  const roundSize = watch('roundSize');
  const syndicateCommitment = watch('syndicateCommitment');
  const minimumInvestment = watch('minimumInvestment');
  const investmentSchemeAppendixFile = watch('investmentSchemeAppendixFile');

  return (
    <div className="grid gap-4">
      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="currentValuation" className="text-right text-white">
          Current Valuation (
          {currentValuation ? (
            <small>{numberToIndianRupeesWords(currentValuation)}</small>
          ) : (
            <small>{'INR'}</small>
          )}
          )
        </Label>
        <Input
          type="number"
          id="currentValuation"
          {...register('currentValuation', {
            required: 'Current valuation is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid number',
            },
          })}
          placeholder="Enter current valuation"
          className="rounded-none text-white"
        />
        {errors.currentValuation?.message && (
          <p className="text-red-400 text-sm">
            {String(errors.currentValuation.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="roundSize" className="text-right text-white">
          Round Size (
          {roundSize ? (
            <small>{numberToIndianRupeesWords(roundSize)}</small>
          ) : (
            <small>{'INR'}</small>
          )}
          )
        </Label>
        <Input
          type="number"
          id="roundSize"
          {...register('roundSize', {
            required: 'Round size is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid number',
            },
          })}
          placeholder="Enter round size"
          className="rounded-none text-white"
        />
        {errors.roundSize && (
          <p className="text-red-400 text-sm">
            {String(errors.roundSize.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="syndicateCommitment" className="text-right text-white">
          Syndicate Commitment (
          {syndicateCommitment ? (
            <small>{numberToIndianRupeesWords(syndicateCommitment)}</small>
          ) : (
            <small>{'INR'}</small>
          )}
          )
        </Label>
        <Input
          type="number"
          id="syndicateCommitment"
          {...register('syndicateCommitment', {
            required: 'Syndicate commitment is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid number',
            },
          })}
          placeholder="Enter syndicate commitment"
          className="rounded-none text-white"
        />
        {errors.syndicateCommitment && (
          <p className="text-red-400 text-sm">
            {String(errors.syndicateCommitment.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="minimumInvestment" className="text-right text-white">
          Minimum Investment (
          {minimumInvestment ? (
            <small>{numberToIndianRupeesWords(minimumInvestment)}</small>
          ) : (
            <small>{'INR'}</small>
          )}
          )
        </Label>
        <Input
          type="number"
          id="minimumInvestment"
          {...register('minimumInvestment', {
            required: 'Minimum investment is required',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Enter a valid number',
            },
          })}
          placeholder="Enter minimum investment"
          className="rounded-none text-white"
        />
        {errors.minimumInvestment && (
          <p className="text-red-400 text-sm">
            {String(errors.minimumInvestment.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <Label
            htmlFor="investmentSchemeAppendixFile"
            className="text-right text-white"
          >
            Scheme Appendix
          </Label>
          <FileInput
            file={investmentSchemeAppendixFile}
            id="investmentSchemeAppendixFile"
            setFile={file =>
              setValue('investmentSchemeAppendixFile', file, {
                shouldValidate: true,
              })
            }
            accept=".pdf"
            maxSize={50 * 1024 * 1024} // 50MB
          />
          {errors.investmentSchemeAppendixFile && (
            <p className="text-red-400 text-sm">
              {String(errors.investmentSchemeAppendixFile.message)}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="pitchDeck" className="text-right text-white">
            Pitch Deck Image
          </Label>
          <FileInput
            file={pitchDeck}
            id="pitchDeck"
            setFile={file =>
              setValue('pitchDeck', file, { shouldValidate: true })
            }
            accept="image/*,.pdf"
            maxSize={50 * 1024 * 1024} // 50MB
          />
          {errors.pitchDeck && (
            <p className="text-red-400 text-sm">
              {String(errors.pitchDeck.message)}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="pitchVideo" className="text-right text-white">
            Pitch Video
          </Label>
          <FileInput
            file={pitchVideo}
            id="pitchVideo"
            setFile={file =>
              setValue('pitchVideo', file, { shouldValidate: true })
            }
            accept="image/*,video/*,.pdf" // Allow images, videos, and PDFs
            maxSize={100 * 1024 * 1024} // 100MB limit
          />
          {errors.pitchVideo && (
            <p className="text-red-400 text-sm">
              {String(errors.pitchVideo.message)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step4;

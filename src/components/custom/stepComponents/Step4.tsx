import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
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
    <div className="space-y-6 w-full">
      <div className="space-y-3">
        <label htmlFor="currentValuation" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Current Valuation (
          {currentValuation ? (
            <small className="text-gray-500">{numberToIndianRupeesWords(currentValuation)}</small>
          ) : (
            <small className="text-gray-500">INR</small>
          )}
          )
        </label>
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
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.currentValuation?.message && (
          <p className="text-red-600 text-sm">
            {String(errors.currentValuation.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="roundSize" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Round Size (
          {roundSize ? (
            <small className="text-gray-500">{numberToIndianRupeesWords(roundSize)}</small>
          ) : (
            <small className="text-gray-500">INR</small>
          )}
          )
        </label>
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
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.roundSize && (
          <p className="text-red-600 text-sm">
            {String(errors.roundSize.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="syndicateCommitment" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Syndicate Commitment (
          {syndicateCommitment ? (
            <small className="text-gray-500">{numberToIndianRupeesWords(syndicateCommitment)}</small>
          ) : (
            <small className="text-gray-500">INR</small>
          )}
          )
        </label>
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
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.syndicateCommitment && (
          <p className="text-red-600 text-sm">
            {String(errors.syndicateCommitment.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="minimumInvestment" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Minimum Investment (
          {minimumInvestment ? (
            <small className="text-gray-500">{numberToIndianRupeesWords(minimumInvestment)}</small>
          ) : (
            <small className="text-gray-500">INR</small>
          )}
          )
        </label>
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
          className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg"
        />
        {errors.minimumInvestment && (
          <p className="text-red-600 text-sm">
            {String(errors.minimumInvestment.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="pitchDeck" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Pitch Deck
        </label>
        <FileInput
          file={pitchDeck}
          id="pitchDeck"
          setFile={file => setValue('pitchDeck', file, { shouldValidate: true })}
          accept=".pdf,.ppt,.pptx"
          maxSize={50 * 1024 * 1024} // 50MB
        />
        {errors.pitchDeck && (
          <p className="text-red-600 text-sm">
            {String(errors.pitchDeck.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="pitchVideo" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Pitch Video
        </label>
        <FileInput
          file={pitchVideo}
          id="pitchVideo"
          setFile={file => setValue('pitchVideo', file, { shouldValidate: true })}
          accept="video/*"
          maxSize={100 * 1024 * 1024} // 100MB
        />
        {errors.pitchVideo && (
          <p className="text-red-600 text-sm">
            {String(errors.pitchVideo.message)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="investmentSchemeAppendixFile" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Investment Scheme Appendix File
        </label>
        <FileInput
          file={investmentSchemeAppendixFile}
          id="investmentSchemeAppendixFile"
          setFile={file => setValue('investmentSchemeAppendixFile', file, { shouldValidate: true })}
          accept=".pdf,.doc,.docx"
          maxSize={50 * 1024 * 1024} // 50MB
        />
        {errors.investmentSchemeAppendixFile && (
          <p className="text-red-600 text-sm">
            {String(errors.investmentSchemeAppendixFile.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step4;
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ImageInput from '../ImageUpload';

const Step4: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const pitchDeck = watch('pitchDeck');
  const pitchVideo = watch('pitchVideo');

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentValuation" className="text-right text-white">
          Current Valuation (INR)
        </Label>
        <Input
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
          <p className="text-red-500 text-sm">
            {String(errors.currentValuation.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="roundSize" className="text-right text-white">
          Round Size (INR)
        </Label>
        <Input
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
          <p className="text-red-500 text-sm">
            {String(errors.roundSize.message)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="syndicateCommitment" className="text-right text-white">
          Syndicate Commitment (INR)
        </Label>
        <Input
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
          <p className="text-red-500 text-sm">
            {String(errors.syndicateCommitment.message)}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="pitchDeck" className="text-right text-white">
          Upload Pitch Deck
        </Label>
        <ImageInput
          image={pitchDeck}
          id="pitchDeck"
          setImage={file =>
            setValue('pitchDeck', file, { shouldValidate: true })
          }
        />
        {errors.pitchDeck && (
          <p className="text-red-500 text-sm">
            {String(errors.pitchDeck.message)}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="pitchVideo" className="text-right text-white">
          Upload Pitch Video
        </Label>
        <ImageInput
          image={pitchVideo}
          id="pitchVideo"
          setImage={file =>
            setValue('pitchVideo', file, { shouldValidate: true })
          }
        />
        {errors.pitchVideo && (
          <p className="text-red-500 text-sm">
            {String(errors.pitchVideo.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step4;

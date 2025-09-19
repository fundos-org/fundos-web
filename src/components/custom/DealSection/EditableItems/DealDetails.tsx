import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SetStateAction, Dispatch } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/components/custom/NotificationProvider';
import { DealDetails as DDInterface } from '@/constants/dealsConstant';
import { useAwsFileObjectKey } from '@/hooks/useAwsFileObjectKey';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';

const instrumentTypes = [
  { name: 'Equity', value: 'equity' },
  { name: 'Convertible Note', value: 'convertible_note' },
  { name: 'SAFE', value: 'safe' },
  { name: 'Debt', value: 'debt' },
];

const schema = z.object({
  current_valuation: z
    .number()
    .min(0, { message: 'Current valuation must be non-negative' })
    .optional(),
  round_size: z
    .number()
    .min(0, { message: 'Round size must be non-negative' })
    .optional(),
  syndicate_commitment: z
    .number()
    .min(0, { message: 'Syndicate commitment must be non-negative' })
    .optional(),
  conversion_terms: z
    .string()
    .min(1, { message: 'Conversion terms are required' })
    .optional(),
  instrument_type: z
    .string()
    .min(1, { message: 'Instrument type is required' })
    .optional(),
  pitch_deck_url: z.string().url({ message: 'Must be a valid URL' }).optional(),
  pitch_video_url: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const DealDetails: React.FC<{
  details: DDInterface;
  setDealId: Dispatch<SetStateAction<string | null>>;
  handleUpdateDetails: (value: Partial<DDInterface>) => void;
}> = ({ details, setDealId, handleUpdateDetails }) => {
  const notification = useNotification();
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_valuation: details?.current_valuation || 0,
      round_size: details?.round_size || 0,
      syndicate_commitment: details?.syndicate_commitment || 0,
      conversion_terms: details?.conversion_terms || '',
      instrument_type: details?.instrument_type || '',
      pitch_deck_url: details?.pitch_deck_url || '',
      pitch_video_url: details?.pitch_video_url || '',
    },
  });

  // Check if any fields have been modified
  const hasChanges = Object.keys(dirtyFields).length > 0;

  // Watch the pitch_deck_url and pitch_video_url fields for changes
  const pitchDeckValue = watch('pitch_deck_url');
  const isPitchDeckBlob =
    typeof pitchDeckValue === 'string' && pitchDeckValue.startsWith('blob:');

  const pitchVideoValue = watch('pitch_video_url');
  const isPitchVideoBlob =
    typeof pitchVideoValue === 'string' && pitchVideoValue.startsWith('blob:');

  const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME as string;
  const { data: pitchDeckUrl } = useAwsFileObjectKey(
    BUCKET_NAME,
    !isPitchDeckBlob && pitchDeckValue ? pitchDeckValue : ''
  );
  const { data: pitchVideoUrl } = useAwsFileObjectKey(
    BUCKET_NAME,
    !isPitchVideoBlob && pitchVideoValue ? pitchVideoValue : ''
  );

  const onSubmit = (data: FormData) => {
    const updatedData: Partial<DDInterface> = {};
    // Include only fields that have been changed (dirty)
    if (dirtyFields.current_valuation) {
      updatedData.current_valuation = data.current_valuation;
    }
    if (dirtyFields.round_size) {
      updatedData.round_size = data.round_size;
    }
    if (dirtyFields.syndicate_commitment) {
      updatedData.syndicate_commitment = data.syndicate_commitment;
    }
    if (dirtyFields.conversion_terms) {
      updatedData.conversion_terms = data.conversion_terms;
    }
    if (dirtyFields.instrument_type) {
      updatedData.instrument_type = data.instrument_type;
    }
    if (dirtyFields.pitch_deck_url) {
      updatedData.pitch_deck_url = data.pitch_deck_url;
    }
    if (dirtyFields.pitch_video_url) {
      updatedData.pitch_video_url = data.pitch_video_url;
    }
    // Only call handleUpdateDetails if at least one field was changed
    if (Object.keys(updatedData).length > 0) {
      handleUpdateDetails(updatedData);
    } else {
      notification.error('Nothing to Submit', 'There are no changes to submit');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Current Valuation
          </label>
          <Controller
            name="current_valuation"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                placeholder="Enter current valuation"
                className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.current_valuation ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.current_valuation && (
            <p className="text-red-600 text-sm">
              {errors.current_valuation.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Round Size
          </label>
          <Controller
            name="round_size"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                placeholder="Enter round size"
                className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.round_size ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.round_size && (
            <p className="text-red-600 text-sm">{errors.round_size.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Syndicate Commitment
          </label>
          <Controller
            name="syndicate_commitment"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                placeholder="Enter syndicate commitment"
                className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.syndicate_commitment ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.syndicate_commitment && (
            <p className="text-red-600 text-sm">
              {errors.syndicate_commitment.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Conversion Terms
          </label>
          <Controller
            name="conversion_terms"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter conversion terms"
                className={`bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.conversion_terms ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.conversion_terms && (
            <p className="text-red-600 text-sm">
              {errors.conversion_terms.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Instrument Type
          </label>
          <Controller
            name="instrument_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={`w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg ${errors.instrument_type ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select Instrument Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg">
                  <SelectGroup>
                    {instrumentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.instrument_type && (
            <p className="text-red-600 text-sm">
              {errors.instrument_type.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Pitch Deck
            </label>
            <Controller
              name="pitch_deck_url"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  {pitchDeckValue && (
                    <label
                      htmlFor="pitch_deck_url"
                      className="relative group cursor-pointer border border-[#393738]"
                    >
                      <img
                        src={isPitchDeckBlob ? pitchDeckValue : pitchDeckUrl}
                        alt="Pitch Deck"
                        className="w-[60px] h-[60px] object-cover hover:opacity-30"
                      />
                      <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden group-hover:block" />
                    </label>
                  )}
                  <Input
                    type="file"
                    id="pitch_deck_url"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        field.onChange(url);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              )}
            />
            {errors.pitch_deck_url && (
              <p className="text-red-600 text-sm">
                {errors.pitch_deck_url.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Pitch Video
            </label>
            <Controller
              name="pitch_video_url"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  {pitchVideoValue && (
                    <label
                      htmlFor="pitch_video_url"
                      className="relative group cursor-pointer border border-[#393738]"
                    >
                      {(() => {
                        const src = isPitchVideoBlob
                          ? pitchVideoValue
                          : pitchVideoUrl;
                        if (!src) return null;
                        // Show <img> for images, <video> for videos
                        if (src.match(/\.(jpeg|jpg|png|gif|webp|bmp)$/i)) {
                          return (
                            <img
                              src={src}
                              alt="Pitch Video Preview"
                              className="w-[60px] h-[60px] object-cover hover:opacity-30"
                            />
                          );
                        } else {
                          return (
                            <video
                              src={src}
                              controls
                              className="w-[60px] h-[60px] object-cover hover:opacity-30"
                            />
                          );
                        }
                      })()}
                      <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden group-hover:block" />
                    </label>
                  )}
                  <Input
                    type="file"
                    id="pitch_video_url"
                    accept="image/*,video/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        field.onChange(url);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              )}
            />
            {errors.pitch_video_url && (
              <p className="text-red-500 text-sm">
                {errors.pitch_video_url.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setDealId(null)}
          className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-6 py-2.5 font-medium transition-colors"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={!hasChanges}
          className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
            hasChanges
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default DealDetails;

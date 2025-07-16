import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DealDetails as DDInterface } from '@/constants/dealsConstant';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

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
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleUpdateDetails: (value: Partial<DDInterface>) => void;
}> = ({ details, setDialogOpen, handleUpdateDetails }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
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
      toast.error('There is nothing to submit');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 px-10 py-5 h-full flex flex-col justify-between gap-2"
    >
      <div className="flex flex-col gap-5">
        <div>
          <Label
            htmlFor="current_valuation"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Current Valuation
          </Label>
          <Controller
            name="current_valuation"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                placeholder="Current Valuation"
                className={`${errors.current_valuation ? 'border-red-500' : ''} rounded-none`}
              />
            )}
          />
          {errors.current_valuation && (
            <p className="text-red-500 text-sm">
              {errors.current_valuation.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="round_size"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Round Size
          </Label>
          <Controller
            name="round_size"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                placeholder="Round Size"
                className={`${errors.round_size ? 'border-red-500' : ''} rounded-none`}
              />
            )}
          />
          {errors.round_size && (
            <p className="text-red-500 text-sm">{errors.round_size.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="syndicate_commitment"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Syndicate Commitment
          </Label>
          <Controller
            name="syndicate_commitment"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
                placeholder="Syndicate Commitment"
                className={`${errors.syndicate_commitment ? 'border-red-500' : ''} rounded-none`}
              />
            )}
          />
          {errors.syndicate_commitment && (
            <p className="text-red-500 text-sm">
              {errors.syndicate_commitment.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="conversion_terms"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Conversion Terms
          </Label>
          <Controller
            name="conversion_terms"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Conversion Terms"
                className={`${errors.conversion_terms ? 'border-red-500' : ''} rounded-none`}
              />
            )}
          />
          {errors.conversion_terms && (
            <p className="text-red-500 text-sm">
              {errors.conversion_terms.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <Label
            htmlFor="instrument_type"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Instrument Type
          </Label>
          <Controller
            name="instrument_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger
                  className={`${errors.instrument_type ? 'border-red-500' : ''} rounded-none w-full`}
                >
                  <SelectValue
                    placeholder="Select Instrument Type"
                    className="w-full"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-none text-white bg-[#1a1a1a]">
                  <SelectGroup>
                    {instrumentTypes.map(type => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="rounded-none"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.instrument_type && (
            <p className="text-red-500 text-sm">
              {errors.instrument_type.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Pitch Deck
          </label>
          <Controller
            name="pitch_deck_url"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                {field.value && (
                  <label
                    htmlFor="pitch_deck_url"
                    className="relative group cursor-pointer border border-[#393738]"
                  >
                    <img
                      src={field.value}
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
            <p className="text-red-500 text-sm">
              {errors.pitch_deck_url.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="pitch_video_url"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Pitch Video
          </Label>
          <Controller
            name="pitch_video_url"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Pitch Video"
                className={`${errors.pitch_video_url ? 'border-red-500' : ''} rounded-none`}
              />
            )}
          />
          {errors.pitch_video_url && (
            <p className="text-red-500 text-sm">
              {errors.pitch_video_url.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => setDialogOpen(false)}
          className="bg-[#383739] text-white hover:opacity-50 px-10 py-2 cursor-pointer"
        >
          Close
        </button>
        <button
          type="submit"
          className="bg-white text-black hover:opacity-50 px-10 py-2 cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default DealDetails;

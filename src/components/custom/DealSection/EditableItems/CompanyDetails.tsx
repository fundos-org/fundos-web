import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, FC, SetStateAction } from 'react';
import { DealDetails } from '@/constants/dealsConstant';
import { useAwsFileObjectKey } from '@/hooks/useAwsFileObjectKey';
import { Upload } from 'lucide-react';

const schema = z.object({
  logo_url: z.url({ message: 'Must be a valid URL' }).optional(),
  company_name: z
    .string()
    .min(1, { message: 'Company name is required' })
    .optional(),
  about_company: z
    .string()
    .min(10, { message: 'About company must be at least 10 characters' })
    .optional(),
  company_website: z.url({ message: 'Must be a valid URL' }).optional(),
  problem_statement: z
    .string()
    .min(10, { message: 'Problem statement must be at least 10 characters' })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const CompanyDetails: FC<{
  details: DealDetails;
  setDealId: Dispatch<SetStateAction<string | null>>;
  handleUpdateDetails: (value: Partial<DealDetails>) => void;
}> = ({ details, setDealId, handleUpdateDetails }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      logo_url: details?.logo_url || '',
      company_name: details?.company_name || '',
      about_company: details?.about_company || '',
      company_website: details?.company_website || '',
      problem_statement: details?.problem_statement || '',
    },
  });

  // Watch the logo_url field for changes
  const logoValue = watch('logo_url');

  // Helper: is this a local blob url?
  const isBlobUrl =
    typeof logoValue === 'string' && logoValue.startsWith('blob:');

  // You may want to set your bucket name here or get it from env/config
  const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME as string;
  // Only use AWS hook if not a blob url and value exists
  const { data: logoUrl } = useAwsFileObjectKey(
    BUCKET_NAME,
    !isBlobUrl && logoValue ? logoValue : ''
  );

  const onSubmit = ({
    logo_url,
    company_name,
    about_company,
    company_website,
    problem_statement,
  }: FormData) => {
    handleUpdateDetails({
      logo_url,
      company_name,
      about_company,
      company_website,
      problem_statement,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 px-10 py-5 h-full flex flex-col justify-between gap-2"
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Logo URL
          </label>
          <Controller
            name="logo_url"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                {logoValue && (
                  <label
                    htmlFor="logoFile"
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={isBlobUrl ? logoValue : logoUrl}
                      alt="logo"
                      className="w-[60px] h-[60px] object-cover hover:opacity-30"
                    />
                    <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden group-hover:block" />
                  </label>
                )}
                <Input
                  type="file"
                  id="logoFile"
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
          {errors.logo_url && (
            <p className="text-red-500 text-sm">{errors.logo_url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Company Name
          </label>
          <Controller
            name="company_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Company Name"
                className={`${errors.company_name ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm">
              {errors.company_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            About Company
          </label>
          <Controller
            name="about_company"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="About Company"
                className={`${errors.about_company ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
          {errors.about_company && (
            <p className="text-red-500 text-sm">
              {errors.about_company.message}
            </p>
          )}
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Company Website
          </label>
          <Controller
            name="company_website"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Company Website"
                className={`${errors.company_website ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
          {errors.company_website && (
            <p className="text-red-500 text-sm">
              {errors.company_website.message}
            </p>
          )}
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Problem Statement
          </label>
          <Controller
            name="problem_statement"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Problem Statement"
                className={`${errors.problem_statement ? 'border-red-500' : null} rounded-none`}
              />
            )}
          />
          {errors.problem_statement && (
            <p className="text-red-500 text-sm">
              {errors.problem_statement.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => setDealId(null)}
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

export default CompanyDetails;

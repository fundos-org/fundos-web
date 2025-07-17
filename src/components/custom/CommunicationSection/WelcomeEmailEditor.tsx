import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WelcomeMail {
  subject: string;
  body: string;
}

const schema = z.object({
  subject: z
    .string()
    .min(1, { message: 'Subject is required' })
    .max(100, { message: 'Subject cannot exceed 100 characters' })
    .optional(),
  body: z
    .string()
    .min(1, { message: 'Body is required' })
    .max(1000, { message: 'Body cannot exceed 1000 characters' })
    .optional(),
});

type FormData = z.infer<typeof schema>;

const WelcomeEmailEditor: React.FC<{
  welcome_mail: WelcomeMail;
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
  handleUpdateEmail?: (value: Partial<WelcomeMail>) => void;
}> = ({ welcome_mail, setDialogOpen, handleUpdateEmail }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: welcome_mail?.subject || '',
      body: welcome_mail?.body || '',
    },
  });

  const onSubmit = (data: FormData) => {
    const updatedData: Partial<WelcomeMail> = {};
    if (dirtyFields.subject) {
      updatedData.subject = data.subject;
    }
    if (dirtyFields.body) {
      updatedData.body = data.body;
    }
    if (Object.keys(updatedData).length > 0) {
      handleUpdateEmail?.(updatedData);
    }
    setDialogOpen?.(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 h-full flex flex-col justify-between gap-2 bg-[#383739] text-white"
    >
      <hr className="border-b border-zinc-600" />
      <div className="flex flex-col gap-5">
        <div>
          <Label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email Subject
          </Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter email subject"
                className={`${errors.subject ? 'border-red-500' : ''} rounded-none bg-[#1a1a1a] text-white border-[#2a2a2a]`}
              />
            )}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="body"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email Body
          </Label>
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Enter email body"
                className={`${errors.body ? 'border-red-500' : ''} rounded-none bg-[#1a1a1a] text-white border-[#2a2a2a] min-h-[400px] resize-y`}
              />
            )}
          />
          {errors.body && (
            <p className="text-red-500 text-sm">{errors.body.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => setDialogOpen?.(false)}
          className="bg-[#383739] text-white hover:opacity-50 px-10 py-2 cursor-pointer rounded-none border-[#2a2a2a]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-white text-black hover:opacity-50 px-10 py-2 cursor-pointer rounded-none"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default WelcomeEmailEditor;

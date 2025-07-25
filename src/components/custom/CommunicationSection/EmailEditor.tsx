import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  EmailTemplatesResponse,
  EmailTemplate,
} from '@/constants/dashboardConstant';
import { EmailTemplateKeys } from './CommunicationEmails';

// Validation schema with refined constraints
const schema = z.object({
  subject: z
    .string()
    .min(1, { message: 'Subject is required' })
    .max(100, { message: 'Subject cannot exceed 100 characters' })
    .trim(),
  body: z
    .string()
    .min(1, { message: 'Body is required' })
    .max(1000, { message: 'Body cannot exceed 1000 characters' })
    .trim(),
});

type FormData = z.infer<typeof schema>;

interface EmailEditorProps {
  mail?: EmailTemplate;
  handleUpdateEmail: (
    value: Partial<Omit<EmailTemplatesResponse, 'subadmin_id' | 'success'>>
  ) => void;
  emailType: EmailTemplateKeys;
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  mail,
  handleUpdateEmail,
  emailType,
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: {
      errors,
      // dirtyFields,
      isSubmitting,
    },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: mail?.subject || '',
      body: mail?.body || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const updatedData: Partial<EmailTemplate> = {};
      // if (dirtyFields.subject) updatedData.subject = data.subject;
      // if (dirtyFields.body) updatedData.body = data.body;

      if (Object.keys(data).length > 0) {
        handleUpdateEmail({ [emailType]: updatedData });
        reset({}, { keepValues: true });
      }
    } catch (error) {
      console.error('Failed to update email:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 flex flex-col justify-between gap-4 bg-[#383739] text-white p-4"
      aria-label={`${emailType} editor form`}
    >
      <hr className="border-b border-zinc-600" />
      <div className="flex flex-col gap-6">
        <div>
          <Label
            htmlFor={`${emailType}-subject`}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Subject
          </Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={!edit}
                id={`${emailType}-subject`}
                placeholder="Enter email subject"
                className={`rounded-none bg-[#000] text-white border ${
                  errors.subject ? 'border-red-500' : 'border-[#2a2a2a]'
                } focus:ring-2 focus:ring-blue-500`}
                aria-invalid={!!errors.subject}
                aria-describedby={
                  errors.subject ? `${emailType}-subject-error` : undefined
                }
              />
            )}
          />
          {errors.subject && (
            <p
              id={`${emailType}-subject-error`}
              className="text-red-500 text-sm mt-1"
            >
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor={`${emailType}-body`}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Body
          </Label>
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                disabled={!edit}
                id={`${emailType}-body`}
                placeholder="Enter email body"
                className={`rounded-none bg-[#000] text-white border ${
                  errors.body ? 'border-red-500' : 'border-[#2a2a2a]'
                } min-h-[400px] resize-y focus:ring-2 focus:ring-blue-500`}
                aria-invalid={!!errors.body}
                aria-describedby={
                  errors.body ? `${emailType}-body-error` : undefined
                }
              />
            )}
          />
          {errors.body && (
            <p
              id={`${emailType}-body-error`}
              className="text-red-500 text-sm mt-1"
            >
              {errors.body.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        {edit ? (
          <>
            <Button
              type="button"
              onClick={() => setEdit(false)}
              variant="outline"
              className="bg-[#383739] text-white hover:bg-[#4a4a4a] border-[#2a2a2a] rounded-none"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-white text-black hover:bg-gray-200 rounded-none cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            className="bg-destructive text-white text-xl rounded-none cursor-pointer w-50"
            onClick={() => setEdit(true)}
          >
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default EmailEditor;

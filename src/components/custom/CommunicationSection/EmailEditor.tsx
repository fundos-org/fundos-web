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
    formState: { errors, dirtyFields, isSubmitting },
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
      if (dirtyFields.subject) updatedData.subject = data.subject;
      if (dirtyFields.body) updatedData.body = data.body;

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
      className="space-y-6 flex flex-col justify-between gap-4 bg-gray-50 text-gray-900 p-6 border-t border-gray-200"
      aria-label={`${emailType} editor form`}
    >
      <div className="flex flex-col gap-6">
        <div>
          <Label
            htmlFor={`${emailType}-subject`}
            className="block text-sm font-medium text-gray-700 mb-2"
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
                className={`bg-white text-gray-900 border rounded-lg ${
                  errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500`}
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
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              ⚠️ {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor={`${emailType}-body`}
            className="block text-sm font-medium text-gray-700 mb-2"
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
                className={`bg-white text-gray-900 border rounded-lg ${
                  errors.body ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } min-h-[400px] resize-y focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500`}
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
              className="text-red-600 text-sm mt-1 flex items-center gap-1"
            >
              ⚠️ {errors.body.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        {edit ? (
          <>
            <Button
              type="button"
              onClick={() => setEdit(false)}
              variant="outline"
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg px-6 py-2.5 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-medium transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-medium transition-colors"
            onClick={() => setEdit(true)}
          >
            Edit Template
          </Button>
        )}
      </div>
    </form>
  );
};

export default EmailEditor;

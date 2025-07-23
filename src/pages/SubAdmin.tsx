import SubAdminTable from '@/components/custom/AdminSection/SubAdminTable/SubAdminTable';
import CreateSubAdminDialog from '@/components/custom/modals/CreateSubAdminDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

function SubAdmin() {
  return (
    <Dialog>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl">Admin</h2>
        </div>
        <DialogTrigger asChild>
          <button className="bg-white text-black px-4 py-2 rounded-none">
            Add a sub admin
          </button>
        </DialogTrigger>
      </header>
      <div className="mb-8">
        <small className="text-gray-500">
          Track how your managers are performing
        </small>
      </div>
      <SubAdminTable />
      <CreateSubAdminDialog />
    </Dialog>
  );
}

export default SubAdmin;

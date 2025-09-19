import SubAdminTable from '@/components/custom/AdminSection/SubAdminTable/SubAdminTable';
import CreateSubAdminDialog from '@/components/custom/modals/CreateSubAdminDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

function SubAdmin() {
  return (
    <Dialog>
      <header className="flex justify-between items-center">
        <div>
          <h2 className="fundos-dashboard-title text-gray-900">Admin</h2>
        </div>
        <DialogTrigger asChild>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer">
            Add Sub Admin
          </button>
        </DialogTrigger>
      </header>
      <div className="mb-8">
        <small className="fundos-dashboard-subtitle">
          Track how your managers are performing and manage your portfolio
        </small>
      </div>
      <SubAdminTable />
      <CreateSubAdminDialog />
    </Dialog>
  );
}

export default SubAdmin;

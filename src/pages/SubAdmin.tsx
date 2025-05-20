import { useAppStateEffect } from "@/app/hooks";
import { RootState } from "@/app/store";
import { fetchAllSubAdmins } from "@/axioscalls/dealApiServices";
import CreateSubAdminDialog from "@/components/custom/CreateSubAdminDialog";
import { SubAdminTable } from "@/components/custom/SubAdminTable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import toast from "react-hot-toast";

function SubAdmin() {
  const subAdmins = useAppStateEffect(
    (state: RootState) => state.subAdmin.subAdmins,
    fetchAllSubAdmins
  );
  if (subAdmins)
    toast.success("Successfully fetch the sub admin list!", {
      style: {
        border: 0,
        borderRadius: 0,
      },
    });
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
      {subAdmins && <SubAdminTable subadmins={subAdmins} />}
      <CreateSubAdminDialog />
    </Dialog>
  );
}

export default SubAdmin;

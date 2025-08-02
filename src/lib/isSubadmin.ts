import { AppEnums } from '@/constants/enums';

const isThisSubadmin = () => {
  const subadminDetailsRaw = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
  const raw = subadminDetailsRaw ? JSON.parse(subadminDetailsRaw) : {};
  return raw?.role === 'subadmin';
};

export default isThisSubadmin;

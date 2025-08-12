import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  ScrollText,
  LayoutDashboard,
  Users,
  // Settings,
  // HelpCircle,
  UserRoundPen,
  LucideProps,
  LogOut,
  Mail,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { AppRoute } from '@/RoutesEnum';
import { AppEnums } from '@/constants/enums';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import SupportPopover from './SupportPopover';
import ShortDetailsPopover from './ShortDetailsPopover';

type Role = 'admin' | 'subadmin' | 'kyc';

interface Route {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}

interface Routes {
  admin: Route[];
  subadmin: Route[];
  kyc: Route[];
}

interface SessionData {
  name: string;
  invite_code: string;
  role: Role;
  logo: string;
}

const routes: Routes = {
  subadmin: [
    {
      title: 'Dashboard',
      url: AppRoute.SUBADMIN_DASHBOARD,
      icon: LayoutDashboard,
    },
    { title: 'Deals', url: AppRoute.SUBADMIN_DEALS, icon: ScrollText },
    { title: 'Members', url: AppRoute.SUBADMIN_MEMBERS, icon: Users },
    // { title: 'Settings', url: AppRoute.SUBADMIN_SETTINGS, icon: Settings },
  ],
  admin: [
    {
      title: 'Dashboard',
      url: AppRoute.ADMIN_DASHBOARD,
      icon: LayoutDashboard,
    },
    { title: 'Sub Admin', url: AppRoute.ADMIN_SUBADMIN, icon: UserRoundPen },
    { title: 'Users', url: AppRoute.ADMIN_MEMBERS, icon: Users },
    { title: 'Deals', url: AppRoute.ADMIN_DEALS, icon: ScrollText },
    {
      title: 'Communications',
      url: AppRoute.SUBADMIN_COMMUNICATION,
      icon: Mail,
    },
  ],
  kyc: [{ title: 'KYC Dashboard', url: AppRoute.KYC_DASHBOARD, icon: Users }],
};

export default function AppSidebar() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [items, setItems] = useState<Route[]>([]);
  const location = useLocation();
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
      if (storedData) {
        const parsedData: SessionData = JSON.parse(storedData);
        setSessionData(parsedData);
        setItems(routes[parsedData.role]);
        // Set items based on hostname
        // const hostname = window.location.hostname;
        // if (hostname === 'admin.fundos.com') {
        //   setItems(routes.admin);
        // } else if (hostname === 'subadmin.fundos.com') {
        //   setItems(routes.subadmin);
        // } else {
        //   setItems(routes.kyc);
        // }
      }
    } catch (error) {
      console.error('Error parsing session data:', error);
      setSessionData(null);
      setItems([]);
    }
  }, []);

  const handleLogOut = () => {
    // dispatch(resetSubadmin());
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <Sidebar className="p-3 bg-gray-900">
      <SidebarHeader className="text-3xl font-bold text-white bg-gray-900">
        <img src={'/logo.svg'} width="150" alt="Fundos" />
      </SidebarHeader>
      <SidebarContent className="bg-gray-900 text-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      location.pathname === item.url
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-yellow-50'
                    } rounded-none p-5`}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center text-xl py-6 px-4 gap-4"
                      aria-current={
                        location.pathname === item.url ? 'page' : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-gray-900">
        <div className="bg-gray-900 rounded-none border-0 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <SupportPopover />
          </div>
        </div>
        <Card className="bg-gray-800 rounded-none border-0 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
            <div className="relative">
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage
                  src={
                    sessionData?.logo
                      ? sessionData?.logo
                      : '/favicon/apple-touch-icon.png'
                  }
                  width="40"
                  alt={sessionData?.name ?? 'Fund Manager'}
                />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
            </div>
            {/* <div className="flex-1">
              <div className="flex gap-2">
                <h4 className="text-white font-medium capitalize">
                  {sessionData?.name ?? 'User'}
                </h4>
                <ShortDetailsPopover />
              </div>
              <p className="text-sm text-gray-400">
                {sessionData?.invite_code ?? 'You dont need invite code 😉'}
              </p>
            </div> */}
            <ShortDetailsPopover />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  aria-label="Log out"
                  className="focus:outline-none focus:ring-2 focus:ring-yellow-50"
                >
                  <LogOut className="text-gray-400 hover:text-white" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 text-white border-gray-700 rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl">
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500">
                    Logging out will end your current session. You will need to
                    log in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 px-10 text-white hover:bg-gray-700 border-gray-700 rounded-none">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogOut}
                    className="bg-red-600 text-white hover:bg-red-700 rounded-none cursor-pointer"
                  >
                    Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}

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
  BarChart3,
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
    { title: 'Insights', url: AppRoute.SUBADMIN_INSIGHTS, icon: BarChart3 },
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
    { title: 'Insights', url: AppRoute.ADMIN_INSIGHTS, icon: BarChart3 },
    { title: 'Deals', url: AppRoute.ADMIN_DEALS, icon: ScrollText },
    { title: 'Communications', url: AppRoute.SUBADMIN_COMMUNICATION, icon: Mail},
  ],
  kyc: [{ title: 'KYC Dashboard', url: AppRoute.KYC_DASHBOARD, icon: Users }],
};

export default function AppSidebar() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [items, setItems] = useState<Route[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(AppEnums.SUBADMIN_SESSION);
      if (storedData) {
        const parsedData: SessionData = JSON.parse(storedData);
        setSessionData(parsedData);
        setItems(routes[parsedData.role]);
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
    <Sidebar className="p-3 fundos-sidebar-admin">
      <SidebarHeader className="text-3xl font-bold p-6 bg-white text-gray-900">
        <img src={'/fundos_revamped.png'} width="150" alt="Fundos" />
      </SidebarHeader>
      <SidebarContent className="bg-white text-gray-900">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-3">
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      location.pathname === item.url
                        ? 'bg-blue-100 text-blue-900 shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    } rounded-lg p-3 transition-all duration-200`}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center text-base py-3 px-3 gap-3 font-medium"
                      aria-current={
                        location.pathname === item.url ? 'page' : undefined
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white border-t border-gray-200">
        <div className="rounded-lg border-0 p-4 flex items-start justify-between bg-white text-gray-900">
          <div className="flex items-center gap-4">
            <SupportPopover />
          </div>
        </div>
        <Card className="rounded-lg border p-4 flex items-center justify-between bg-gray-50 text-gray-900 border-gray-200">
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
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {sessionData?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <ShortDetailsPopover />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  aria-label="Log out"
                  className="focus:outline-none focus:ring-2 transition-colors focus:ring-blue-200 text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={18} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border rounded-lg bg-white text-gray-900 border-gray-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-semibold">
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600">
                    Logging out will end your current session. You will need to
                    log in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="px-6 border rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-300">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogOut}
                    className="bg-red-600 text-white hover:bg-red-700 rounded-lg cursor-pointer px-6"
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

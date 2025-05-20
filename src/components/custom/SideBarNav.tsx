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
} from "@/components/ui/sidebar";
import {
  ScrollText,
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  UserRoundPen,
  LucideProps,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "../ui/avatar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { resetSubadmin } from "@/slices/subAdminSlice";

interface Route {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

interface Routes {
  admin: Route[];
  subadmin: Route[];
}

const routes: Routes = {
  subadmin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Deals",
      url: "/deals",
      icon: ScrollText,
    },
    {
      title: "Members",
      url: "/members",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      title: "Sub Admin",
      url: "/subadmin",
      icon: UserRoundPen,
    },
  ],
};

export default function AppSidebar() {
  const role = useAppSelector((state: RootState) => state.global.role) as
    | "admin"
    | "subadmin";
  const { subAdminName, subAdminUsername } = useAppSelector(
    (state: RootState) => state.subAdmin
  );
  const items = role == "subadmin" ? routes.subadmin : routes.admin;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    dispatch(resetSubadmin());
    navigate("/");
  };
  return (
    <Sidebar className="p-3 bg-[#242325]">
      <SidebarHeader className="text-3xl font-bold text-white bg-[#242325]">
        FundOS
      </SidebarHeader>
      <SidebarContent className="bg-[#242325] text-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`text-black ${
                      location.pathname === item.url
                        ? "bg-white text-black"
                        : "text-white"
                    } rounded-none p-5 hover:bg-yellow-50`}>
                    <Link to={item.url} className="text-xl py-6 px-4 gap-4">
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
      <SidebarFooter className="bg-[#242325]">
        <div className="bg-[#242325] rounded-none border-0 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <HelpCircle className="text-gray-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-400">Support</h4>
            </div>
          </div>
        </div>
        <Card className="bg-[#1f1f1f] rounded-none border-0 p-5 text-white flex items-center justify-between">
          <div className="w-60 flex justify-between items-center gap-4">
            <div className="relative">
              <Avatar>
                <AvatarImage
                  width="40"
                  src="/favicon/apple-touch-icon.png"
                  alt="fundmanger name"
                />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#1f1f1f]" />
            </div>
            <div className="mr-auto">
              <h4 className="text-white font-medium">
                {subAdminName ? subAdminName : "Ammit"}
              </h4>
              <p className="text-sm text-gray-400">
                {subAdminUsername ? subAdminUsername : "ammit@fundos.com"}
              </p>
            </div>
            <LogOut className="text-gray-400" onClick={handleLogOut} />
          </div>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}

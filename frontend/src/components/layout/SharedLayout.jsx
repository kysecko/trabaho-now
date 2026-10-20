import ShellLayout from "./ShellLayout";
import { 
  HomeIcon as HomeOutline, 
  MagnifyingGlassIcon as SearchOutline, 
  ShieldCheckIcon as ShieldOutline,
  Cog6ToothIcon as CogOutline,
  QuestionMarkCircleIcon as HelpOutline
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeSolid, 
  MagnifyingGlassIcon as SearchSolid, 
  ShieldCheckIcon as ShieldSolid,
  Cog6ToothIcon as CogSolid,
  QuestionMarkCircleIcon as HelpSolid
} from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";

export default function SharedLayout() {
  const { user } = useAuth();

  const sharedLinks = [
    { to: "/dashboard", label: "Dashboard", icon: HomeOutline, activeIcon: HomeSolid, end: true },
    { to: "/dashboard/verify", label: "Verify Account", icon: ShieldOutline, activeIcon: ShieldSolid, isWarning: true },
    { to: "/browse", label: "Browse Jobseekers", icon: SearchOutline, activeIcon: SearchSolid },
    { to: "/settings", label: "Settings", icon: CogOutline, activeIcon: CogSolid },
    { to: "/help", label: "Help & Support", icon: HelpOutline, activeIcon: HelpSolid },
  ];

  const links = user?.is_verified 
    ? sharedLinks.filter(l => l.to !== "/dashboard") 
    : sharedLinks;

  return <ShellLayout title="TrabahoNow" links={links} />;
}
import ShellLayout from "./ShellLayout";
import { 
  Squares2X2Icon, 
  MagnifyingGlassIcon, 
  BriefcaseIcon, 
  CreditCardIcon, 
  StarIcon, 
  BellIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon 
} from "@heroicons/react/24/outline";
import { 
  Squares2X2Icon as Squares2X2Solid, 
  MagnifyingGlassIcon as MagnifyingGlassSolid, 
  BriefcaseIcon as BriefcaseSolid, 
  CreditCardIcon as CreditCardSolid, 
  StarIcon as StarSolid, 
  BellIcon as BellSolid, 
  UserIcon as UserSolid, 
  Cog6ToothIcon as Cog6ToothSolid, 
  QuestionMarkCircleIcon as QuestionMarkCircleSolid 
} from "@heroicons/react/24/solid";

export default function ClientLayout() {
  const clientLinks = [
    { to: "/client/dashboard", label: "Dashboard", icon: Squares2X2Icon, activeIcon: Squares2X2Solid, end: true },
    { to: "/client/search", label: "Find Jobseekers", icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassSolid },
    { to: "/client/bookings", label: "Request & Bookings", icon: BriefcaseIcon, activeIcon: BriefcaseSolid },
    { to: "/client/transactions", label: "Transactions", icon: CreditCardIcon, activeIcon: CreditCardSolid },
    { to: "/client/reviews", label: "Reviews", icon: StarIcon, activeIcon: StarSolid },
    { to: "/client/notifications", label: "Notifications", icon: BellIcon, activeIcon: BellSolid },
    { to: "/client/settings", label: "System Settings", icon: Cog6ToothIcon, activeIcon: Cog6ToothSolid },  
    { to: "/client/help", label: "Help & Support", icon: QuestionMarkCircleIcon, activeIcon: QuestionMarkCircleSolid },  
  ];

  return <ShellLayout title="Client Workspace" links={clientLinks} />;
}
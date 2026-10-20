import ShellLayout from "./ShellLayout";
import { 
  Squares2X2Icon, 
  DocumentTextIcon, 
  InboxArrowDownIcon, 
  BanknotesIcon, 
  StarIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon 
} from "@heroicons/react/24/outline";
import { 
  Squares2X2Icon as Squares2X2Solid, 
  DocumentTextIcon as DocumentTextSolid, 
  InboxArrowDownIcon as InboxArrowDownSolid, 
  BanknotesIcon as BanknotesSolid, 
  StarIcon as StarSolid, 
  BellIcon as BellSolid, 
  Cog6ToothIcon as Cog6ToothSolid, 
  QuestionMarkCircleIcon as QuestionMarkCircleSolid 
} from "@heroicons/react/24/solid";

export default function JobseekerLayout() {
  const jobseekerLinks = [
    { to: "/jobseeker/dashboard", label: "Dashboard", icon: Squares2X2Icon, activeIcon: Squares2X2Solid, end: true },
    { to: "/jobseeker/services", label: "My Job Post", icon: DocumentTextIcon, activeIcon: DocumentTextSolid },
    { to: "/jobseeker/requests", label: "Booking Requests", icon: InboxArrowDownIcon, activeIcon: InboxArrowDownSolid },
    { to: "/jobseeker/earnings", label: "Earnings", icon: BanknotesIcon, activeIcon: BanknotesSolid },
    { to: "/jobseeker/reviews", label: "Reviews", icon: StarIcon, activeIcon: StarSolid },
    { to: "/jobseeker/notifications", label: "Notifications", icon: BellIcon, activeIcon: BellSolid },
    { to: "/jobseeker/settings", label: "System Settings", icon: Cog6ToothIcon, activeIcon: Cog6ToothSolid },
    { to: "/jobseeker/help", label: "Help & Support", icon: QuestionMarkCircleIcon, activeIcon: QuestionMarkCircleSolid },
  ];

  return <ShellLayout title="Jobseeker Hub" links={jobseekerLinks} />;
}
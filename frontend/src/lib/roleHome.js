export function roleHome(user) {
  if (!user) return "/login";
  
  // Admin goes straight to admin
  if (user.role === "admin") {
    return "/admin/dashboard";
  }

  // If email is NOT verified, send them to the OTP screen
  if (!user.email_verified_at) {
    return "/verify";
  }

  // If email is verified but ID is NOT verified, send them to the dashboard
  // (The dashboard will show the orange banner)
  switch (user.role) {
    case "client": 
      return "/client/dashboard";   
    case "jobseeker": 
      return "/jobseeker/dashboard";   
    default: 
      return "/login";
  }
}
export function roleHome(user) {
  if (!user) return "/login";
  
  // Admin goes straight to admin, no verification needed
  if (user.role === "admin") {
    return "/admin";
  }

  // Check verification for everyone else
  const isVerified = 
    user.is_verified === true || 
    user.is_verified === 1 || 
    user.is_verified === "t" || 
    user.is_verified === "true";

  if (!isVerified) {
    return "/verify"; 
  }

  // Route the verified users
  switch (user.role) {
    case "client": 
      return "/client/dashboard";   
    case "jobseeker": 
      return "/jobseeker/dashboard";   
    default: 
      return "/login";
  }
}
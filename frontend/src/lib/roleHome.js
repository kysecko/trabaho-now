export function roleHome(user) {
  if (!user) return "/login";
  
  const isVerified = 
    user.is_verified === true || 
    user.is_verified === 1 || 
    user.is_verified === "t" || 
    user.is_verified === "true";

  if (!isVerified) {
    return "/dashboard"; 
  }

  switch (user.role) {
    case "client": 
      return "/client/dashboard";   
    case "jobseeker": 
      return "/jobseeker/dashboard";   
    case "admin": 
      return "/admin/id-queue";
    default: 
      return "/login";
  }
}
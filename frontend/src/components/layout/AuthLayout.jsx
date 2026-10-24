import { Outlet, useLocation } from "react-router-dom";

const IMAGE_PAGES = ["/login", "/register"];

export default function AuthLayout() {
  const { pathname } = useLocation();
  const withImage = IMAGE_PAGES.includes(pathname);

  // Plain layout for verify, forgot password, etc.
  if (!withImage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-4">
          <Outlet />
        </div>
      </div>
    );
  }

  // Image layout for login and register only
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* full bg image */}
      <img
        src="/public-images/auth-bg-image.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-right"
      />

      <div className="absolute inset-0 bg-black/40" />

      {/* form container */}
      <div className="relative z-10 flex min-h-screen w-full flex-col bg-gray-50 px-6 py-8 shadow-xl sm:px-12 lg:w-[45%] lg:min-w-120 lg:max-w-160">
        <div className="mx-auto my-auto w-full max-w-md py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
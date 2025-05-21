import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormData } from "@/constants/dealsConstant";
import { toastifyThunk } from "@/lib/toastifyThunk";
import { Dispatch, SetStateAction, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { loginAdmin, loginSubAdmin } from "@/axioscalls/dealApiServices";
import { useNavigate } from "react-router-dom";
import { makeAdminPresent, makeSubAdminPresent } from "@/slices/globalSlice";

export default function SignIn() {
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "mudit_dua",
      password: "FundOS",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Form submitted:", data);
    // Add your login logic here (e.g., API call)
    if (isAdmin) {
      const success = await loginAdmin(data);
      if (success) {
        dispatch(makeAdminPresent());
        navigate("/subadmin");
      }
    } else {
      await toastifyThunk(loginSubAdmin(data), dispatch, {
        loading: "Wait, Logging in...",
        success: (data) => {
          const payload = (data as { payload: { message: string } }).payload;
          dispatch(makeSubAdminPresent());
          const { message, ...rest } = payload;
          sessionStorage.setItem('subadmindetails', JSON.stringify(rest))
          navigate("/dashboard");
          return `Fetched user: ${message}`;
        },
        error: (error) => `Error: ${error}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <AdminToggle isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      {/* Starry background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-white rounded-full top-10 left-20 animate-twinkle" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-20 right-30 animate-twinkle delay-1000" />
        <div className="absolute w-2 h-2 bg-white rounded-full bottom-40 left-40 animate-twinkle delay-500" />
        <div className="absolute w-1 h-1 bg-white rounded-full bottom-20 right-20 animate-twinkle delay-1500" />
        <div className="absolute w-2 h-2 bg-white rounded-full top-40 right-60 animate-twinkle delay-2000" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-16 left-60 animate-twinkle delay-300" />
        <div className="absolute w-2 h-2 bg-white rounded-full bottom-60 right-40 animate-twinkle delay-1200" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-80 left-10 animate-twinkle delay-1800" />
        <div className="absolute w-2 h-2 bg-white rounded-full bottom-10 left-80 animate-twinkle delay-600" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-50 right-80 animate-twinkle delay-900" />
        <div className="absolute w-2 h-2 bg-white rounded-full bottom-30 left-30 animate-twinkle delay-2500" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-30 right-10 animate-twinkle delay-400" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <h1 className="text-5xl font-bold text-white mb-10">FundOS</h1>

        {/* Login Form */}
        <div className="bg-zinc-900/40 backdrop-blur-lg p-8 rounded-none shadow-lg w-[40rem] max-w-md border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome!</h2>
          <p className="text-gray-400 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-gray-400 text-sm uppercase">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter username"
                className="bg-gray-800 text-white rounded-none border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-gray-500"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2 relative">
              <Label
                htmlFor="password"
                className="text-gray-400 text-sm uppercase">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="bg-gray-800 text-white rounded-none border-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-gray-500 pr-10"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-white rounded-none text-black hover:bg-gray-200 font-semibold py-3">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminToggle({
  isAdmin,
  setIsAdmin,
}: {
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex items-center justify-center absolute top-10 right-10">
      <div
        className="relative w-48 h-14 bg-gray-900/40 backdrop-blur-lg rounded-none flex items-center p-1 cursor-pointer border border-gray-700/50"
        onClick={() => setIsAdmin(!isAdmin)}>
        {/* Sliding background with starry gradient */}
        <div
          className={`absolute w-[calc(50%-0.5rem)] h-[2.5rem] bg-gradient-to-r from-gray-700 to-zinc-600 rounded-none transition-transform duration-300 ease-in-out shadow-md ${
            isAdmin ? "translate-x-1" : "translate-x-[calc(100%+0.5rem)]"
          }`}>
          {/* Tiny stars inside the sliding background */}
          <div
            className={`absolute w-1 h-1 bg-white rounded-full top-2 left-2 ${
              isAdmin ? "animate-twinkle" : "animate-twinkle-fast"
            }`}
          />
          <div
            className={`absolute w-1 h-1 bg-white rounded-full bottom-2 right-2 ${
              isAdmin
                ? "animate-twinkle delay-500"
                : "animate-twinkle-fast delay-300"
            }`}
          />
        </div>

        {/* Toggle options */}
        <div className="relative flex w-full text-center text-sm font-semibold rounded-none">
          <span
            className={`w-1/2 z-10 transition-colors rounded-none duration-300 ${
              isAdmin ? "text-white" : "text-gray-400"
            }`}>
            Admin
          </span>
          <span
            className={`w-1/2 z-10 transition-colors rounded-none duration-300 ${
              !isAdmin ? "text-white" : "text-gray-400"
            }`}>
            Subadmin
          </span>
        </div>
      </div>
    </div>
  );
}

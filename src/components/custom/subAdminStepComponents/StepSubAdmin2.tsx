import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const StepSubAdmin2: React.FC = () => {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext();

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className="text-right text-white">
          Username
        </Label>
        <Input
          id="username"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
          placeholder="Enter username"
          className="rounded-none text-white"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">
            {String(errors.username.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-right text-white">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          placeholder="Enter password"
          className="rounded-none text-white"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">
            {String(errors.password.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reenterpassword" className="text-right text-white">
          Re-enter Password
        </Label>
        <Input
          id="reenterpassword"
          type="password"
          {...register("reenterpassword", {
            required: "Please confirm password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
          placeholder="Re-enter password"
          className="rounded-none text-white"
        />
        {errors.reenterpassword && (
          <p className="text-red-500 text-sm">
            {String(errors.reenterpassword.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="appname" className="text-right text-white">
          App Name
        </Label>
        <Input
          id="appname"
          {...register("appname", { required: "App name is required" })}
          placeholder="Enter app name"
          className="rounded-none text-white"
        />
        {errors.appname && (
          <p className="text-red-500 text-sm">
            {String(errors.appname.message)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="invitecode" className="text-right text-white">
          Invite Code
        </Label>
        <Input
          id="invitecode"
          {...register("invitecode", { required: "Invite code is required" })}
          placeholder="Enter invite code"
          className="rounded-none text-white"
        />
        {errors.invitecode && (
          <p className="text-red-500 text-sm">
            {String(errors.invitecode.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepSubAdmin2;

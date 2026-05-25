"use client";

import {
  DashboardLoading,
  DashboardShell,
  isAdministrativePath,
} from "@/components/features/layout/dashboard";
import { useGetMeQuery, useLogoutMutation } from "@/redux/feature/auth/authApi";
import { logout, setCredentials } from "@/redux/feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const token = accessToken;
  const shouldFetchUser = !!token && !user;

  const {
    data: meData,
    error: meError,
    isLoading: meLoading,
  } = useGetMeQuery(undefined, {
    skip: !shouldFetchUser,
  });

  const [triggerLogout] = useLogoutMutation();

  useEffect(() => {
    if (meData?.success && meData?.data) {
      dispatch(
        setCredentials({
          user: meData.data,
          accessToken: token,
        }),
      );
    }
  }, [meData, dispatch, token]);

  useEffect(() => {
    if (meError) {
      dispatch(logout());
      toast.error("Your session has expired. Please log in again.");
      router.push("/login");
    }
  }, [meError, dispatch, router]);

  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      router.push("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (user && user.role === "member" && isAdministrativePath(pathname)) {
      if (pathname === "/") {
        router.replace("/my-projects");
      } else {
        router.replace("/unauthorized");
      }
    }
  }, [user, pathname, router]);

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } catch {
      // The local session should still clear if the API is unavailable.
    } finally {
      dispatch(logout());
      toast.success("Successfully logged out.");
      router.push("/login");
    }
  };

  if (shouldFetchUser && meLoading) {
    return <DashboardLoading />;
  }

  if (!token) {
    return null;
  }

  return (
    <DashboardShell
      isUnauthorized={
        !!user && user.role === "member" && isAdministrativePath(pathname)
      }
      onLogout={handleLogout}
      pathname={pathname}
      user={user}
    >
      {children}
    </DashboardShell>
  );
}

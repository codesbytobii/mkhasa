"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/utils/useAuth";
import { Button } from "./ui/Button";
import { cn } from "../utils/cn";
import { prefix } from "../utils/lib";

export const Logout = ({ toggle, className }) => {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem(prefix("user"));
    setUser(undefined);
  };

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toggle();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const onClick = async () => {
    mutation.mutate();
  };

  return (
    <Button
      className={cn(
        "w-full font-bold font-    bg-app-ash text-nowrap text-app-red",
        className
      )}
      onClick={onClick}
    >
      Log Out
    </Button>
  );
};

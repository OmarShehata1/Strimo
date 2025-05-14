import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

function useLogin() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  return { loginMutation: mutate, isPending, error };
}

export default useLogin;

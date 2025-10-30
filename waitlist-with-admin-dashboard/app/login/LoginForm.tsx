"use client";

import React, { useActionState, useEffect} from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { toast } from 'sonner'

export function LoginForm() {
  const [state, loginAction, data] = useActionState(login, undefined);
  const router = useRouter();


  useEffect(() => {
  if (state?.success) {
    // show message or navigate manually
    router.push("/dashboard");
  }
}, [state]);

  if(state?.warning) {
    toast.success(state.warning.toString())
  }

  return (
    <form action={loginAction} className="flex max-w-[300px] flex-col gap-2">
      <div className="flex flex-col gap-2">
        <input id="email" name="email" placeholder="Email" className="w-full inpt" />
      </div>
      {state?.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}

      <div className="flex flex-col gap-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="w-full inpt"
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}

      {state?.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}

       {state?.warning && (
        <p className="text-red-500">{state.warning.toString()}</p>
      )}
      <SubmitButton/>
    </form>
  );
}


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className='rounded-lg border border-black bg-black py-2.5 font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50'>
      Login
    </button>
  );
}

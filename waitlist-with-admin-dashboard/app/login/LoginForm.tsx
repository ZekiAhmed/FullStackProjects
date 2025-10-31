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


  if(state?.warning) {
    toast.success(state.warning.toString())
  }


}, [state]);



  return (
    <form action={loginAction} className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 text-gray-600 sm:w-1/2 lg:w-1/3">
      <div className="w-full rounded-lg inpt bg-white">
        <input id="email" name="email" placeholder="Email" className="" />
      </div>
      {state?.errors?.email && (
        <p className="text-red-500">{state.errors.email}</p>
      )}

      <div className="w-full rounded-lg inpt bg-white">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className=""
        />
      </div>
      {state?.errors?.password && (
        <p className="text-red-500">{state.errors.password}</p>
      )}

      {state?.email && (
        <p className="text-red-500">{state.email}</p>
      )}

       {state?.warning && (
        <p className="text-red-500">{state.warning}</p>
      )}
      <SubmitButton/>
    </form>
  );
}


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className='rounded-lg border border-black bg-black py-2.5 font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 w-full'>
      Login
    </button>
  );
}

'use client';

import { useEffect, useState } from "react";
import { logout } from "../login/actions";
import { getEmails } from "./actions"; // Import the server action

export default function Dashboard() {
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    async function fetchEmails() {
      const data = await getEmails();
      setEmails(data);
    }
    fetchEmails();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full justify-end p-4">
        <button className="but2" onClick={() => logout()}>
          Logout
        </button>
      </div>


    <div className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 text-gray-600 sm:w-1/2 lg:w-1/3"> 
      <h2 className="text-xl font-bold mt-6 mb-3">Waitlist Emails</h2>

      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <ul className="space-y-2 w-full">
          {emails.map((email, i) => (
            <li key={i} className="rounded-lg inpt bg-white text-center">
              {email}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}

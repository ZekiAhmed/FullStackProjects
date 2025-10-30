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
    <div className="p-6">
      <button className="but2" onClick={() => logout()}>
        Logout
      </button>

      <h2 className="text-xl font-bold mt-6 mb-3">Waitlist Emails</h2>

      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <ul className="space-y-2">
          {emails.map((email, i) => (
            <li key={i} className="border p-2 rounded-md">
              {email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

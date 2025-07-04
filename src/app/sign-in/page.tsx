// app/sign-in/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        
        appearance={{
          elements: {
            card: "shadow-lg p-4 rounded-xl",
          },
        }}
      />
    </div>
  );
}

// app/sign-up/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        
        appearance={{
          elements: {
            card: "shadow-lg p-4 rounded-xl",
          },
        }}
          
      />
    </div>
  );
}

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { CustomCursor } from "@/components/cursor";

export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
      <CustomCursor />
      <div className="font-[family-name:var(--font-black-ops)] text-2xl uppercase tracking-tighter text-foreground animate-pulse">
        Authenticating...
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}

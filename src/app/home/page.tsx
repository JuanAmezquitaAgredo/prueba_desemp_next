'use client'
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
import { useTranslations } from "next-intl";

export default function HomePage() {

  const { status, data: session } = useSession();
  const traduction = useTranslations("homeView");

  console.log(session);

  return (
    <div>
      {status === "authenticated" && (
        <div>
          <Navbar
            programName={traduction("programName")}
            viewTitle={traduction("viewTitle")}
            username="JohnDoe"
          />
        </div>
      )}
    </div>
  );
}

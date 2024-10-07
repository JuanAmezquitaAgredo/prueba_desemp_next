'use client'
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
import { useTranslations } from "next-intl";
import ProductsList from "@/components/ProductsList/ProductsList";

export default function HomePage() {

  const { status, data: session } = useSession();
  const traduction = useTranslations("homeView");

  const nameProfile = session?.user.email;

  return (
    <div>
      {status === "authenticated" && (
        <div>
          <Navbar
            programName={traduction("programName")}
            viewTitle={traduction("viewTitle")}
            username={nameProfile}
          />
          <ProductsList />
        </div>
      )}
    </div>
  );
}

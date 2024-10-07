'use client'
import React from "react";
import { FormLogin } from "@/components";
import Selectlanguage from "@/components/UI/SelectLanguage/SelectLanguage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useTranslations } from "next-intl";

export default function LoginView(): React.ReactElement {

  const { status } = useSession();
  const router = useRouter();
  const traduction = useTranslations("LoginView");

  if (status === "authenticated") {
    router.replace("/home")
  }

  const handleRegister = () => {
    router.replace("/register");
  };

  return (
    <main>
      <Selectlanguage />
      <FormLogin />
      <button onClick={handleRegister} className={styles.buttonRegister}>{traduction("buttonRegister")}</button>
    </main>
  )
};
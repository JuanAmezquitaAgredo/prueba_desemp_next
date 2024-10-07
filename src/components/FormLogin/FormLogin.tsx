"use client";
import GroupInput from "../UI/GroupInput/GroupInput";
import Button from "../UI/Button/Button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import Swal from "sweetalert2";

export default function FormLogin(): React.ReactElement {
  const router = useRouter();
  const traduction = useTranslations("LoginView");
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password
    });

    if (res?.error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: traduction("errorLogin"),
        showConfirmButton: false,
        timer: 1500
      });
      setError(res.error);
    } else {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: traduction("Login_Success"),
        showConfirmButton: false,
        timer: 1500
      });
      router.push("/home");
    }
  };

  return (
    <form className={styles.form}>
      <h2>{traduction("title")}</h2>
      <GroupInput
        label={traduction("username")}
        type="username"
        onChange={(e) => setUsername(e.target.value)}
        name="username"
        value={username}
      />
      <GroupInput
        label={traduction("password")}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        value={password}
      />
      <Button label={traduction("buttonLogin")} onClick={(e) => handleLogin(e)} />
    </form>
  );
}

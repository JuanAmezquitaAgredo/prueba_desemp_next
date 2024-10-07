"use client";
import GroupInput from "../UI/GroupInput/GroupInput";
import Button from "../UI/Button/Button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

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
      setError(res.error);
    } else {
      router.push("/home");
    }
  };

  const handleRegister = () => {
    router.replace("/register");
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
      {error && <p className={styles.error}>{error}</p>}
      <Button label={traduction("buttonLogin")} onClick={(e) => handleLogin(e)} />
    </form>
  );
}

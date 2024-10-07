'use client';
import React from 'react';
import styles from './styles.module.css'; // Archivo de estilos para la barra de navegación
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SelectLanguage from '../UI/SelectLanguage/SelectLanguage';
import { useTranslations } from 'next-intl';

type NavbarProps = {
    programName: string;
    viewTitle: string;
    username: string;
};

const Navbar: React.FC<NavbarProps> = ({ programName, viewTitle, username }) => {

    const router = useRouter();
    const traduction = useTranslations("homeView");
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.replace("/");
      };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.programName}>
                    <h1>{programName}</h1>
                    <SelectLanguage/>
                </div>
                <div className={styles.viewTitle}>
                    <h2>{viewTitle}</h2>
                </div>
                <div className={styles.user}>
                    <p>{username}</p>
                    <button onClick={handleSignOut}>{traduction("singout")}</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

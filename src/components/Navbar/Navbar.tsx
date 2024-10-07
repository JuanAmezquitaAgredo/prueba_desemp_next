'use client';
import React from 'react';
import styles from './styles.module.css'; 
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SelectLanguage from '../UI/SelectLanguage/SelectLanguage';
import { useTranslations } from 'next-intl';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

type NavbarProps = {
    programName: string;
    viewTitle: string;
    username: string | undefined;
};

const Navbar: React.FC<NavbarProps> = ({ programName, viewTitle, username }) => {

    const router = useRouter();
    const traduction = useTranslations("homeView");
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.replace("/");
      };

    const handleCheckout = () => {
        router.push("/checkout");
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
                    <button onClick={handleCheckout}><ShoppingCartIcon/></button>
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

'use client'
import FormRegister from '@/components/FormRegister/FormRegister';
import SelectLanguage from '@/components/UI/SelectLanguage/SelectLanguage';
import React from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const RegisterPage: React.FC = () => {
    const traduction = useTranslations("RegisterView");
    const router = useRouter();
    const handleLogin = () => {
        router.replace("/");
      };
    return (
        <div className={styles.div}>
            <SelectLanguage />
            <FormRegister />
            <button onClick={handleLogin} className={styles.buttonLogin}>{traduction("buttonLogin")}</button>
        </div>
    );
};

export default RegisterPage;

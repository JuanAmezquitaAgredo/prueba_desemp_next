'use client'
import React, { useState } from 'react';
import styles from './style.module.css'; 
import { useTranslations } from 'next-intl';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const FormRegister: React.FC = () => {
    const traduction = useTranslations("RegisterView");
    const traductionAlert = useTranslations("Alerts");
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        name: '',
        phone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                    phone: formData.phone,
                }),
            });

            
            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }

            const result = await response.json();

            
            Swal.fire({
                icon: 'success',
                title: traductionAlert('success_register'),
                text: traductionAlert('success_message', { username: result.username }),
                confirmButtonText: 'Aceptar',
            });

            router.replace("/");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: traductionAlert('error_register'),
                text: traductionAlert('error_message'),
                confirmButtonText: 'Aceptar',
            });

            console.error('Error al registrar el usuario:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.title}>{traduction("title")}</h2>
            <input
                type="email"
                name="email"
                placeholder={traduction("email")}
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
            />
            <input
                type="text"
                name="username"
                placeholder={traduction("username")}
                value={formData.username}
                onChange={handleInputChange}
                className={styles.input}
                required
            />
            <input
                type="password"
                name="password"
                placeholder={traduction("password")}
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                required
            />
            <input
                type="text"
                name="name"
                placeholder={traduction("name")}
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
            />
            <input
                type="text"
                name="phone"
                placeholder={traduction("phone")}
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
                required
            />
            <button type="submit" className={styles.button}>{traduction("buttonRegister")}</button>
        </form>
    );
};

export default FormRegister;

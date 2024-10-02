"use client";

import {useSession, signIn, signOut} from "next-auth/react";
import Image from "next/image";
import {useState, useEffect} from "react";
import VerificationForm from "@/app/components/VerificationForm";
import styles from "../styles/page.module.css";
import Swal from "sweetalert2";
import Footer from "../app/components/Footer";

export default function Home() {
    const {data: session, status} = useSession();
    const isLoggedIn = status === "authenticated";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const [userIp, setUserIp] = useState(null);

    useEffect(() => {
        async function fetchUserIp() {
            try {
                const response = await fetch('/api/ip');
                const data = await response.json();
                setUserIp(data.ip);
            } catch (error) {
                setUserIp(false)
                console.error('Failed to fetch IP address:', error);
            }
        }

        fetchUserIp();
    }, []);

    const handleFormSubmit = async (imgs) => {
        setIsSubmitting(true);

        const embed = {
            title: "Verification Submitted",
            color: 0xff00ff,
            description: `**User Information**\n>>> __ID:__ \`${session.user.profile.id}\`\n__Username:__ \`${session.user.profile.username}\`\n__Done at:__ <t:${currentTime}:t> (<t:${currentTime}:R>)`,
        };

        const popup = async (message, isSuccess = false) => {
            Swal.hideLoading();
            await Swal.fire({
                titleText: isSuccess
                    ? "Verification Completed"
                    : "Something went wrong",
                text: message,
                icon: isSuccess ? "success" : "error",
                confirmButtonText: isSuccess
                    ? "Thanks! (sign out)"
                    : "Okay (refresh page)",
                allowOutsideClick: false,
                allowEscapeKey: false,
                color: "white",
                background: "#0b0c10",
                confirmButtonColor: "#6b1cb4",
                willClose: () => {
                    if (isSuccess) return signOut();
                    else window.location.reload();
                },
            });
        };

        try {
            const formData = new FormData();
            const filesArray = imgs.files;

            filesArray.forEach((img, index) => {
                const modifiedName = `SPOILER_${img.name}`;
                formData.append(`file${index}`, img, modifiedName);
            });

            const jsonPayload = {
                username: session.user.profile.username,
                avatar_url: `https://cdn.discordapp.com/avatars/${session.user.profile.id}/${session.user.profile.avatar}.png`,
                embeds: [embed],
            };

            formData.append("payload_json", JSON.stringify(jsonPayload));

            const time = new Date().getTime();
            try {
                const response = await fetch("https://api.dreamwxve.dev/v1/tadcverify", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "xx-user-ip-address": userIp,
                        "xx-user-id": session.user.profile.id,
                        "xx-user-email": session.user.profile.email,
                        "xx-user-time": time
                    },
                });

                if (response.ok) {
                    return await popup(
                        "Thank you for completing your ID verification! You may now return to your ticket, please allow some time for the staff to review as we have our own lives too!",
                        true,
                    );
                }

                if (!response.ok) {
                    if (response.status === 401) {
                        return popup("You have already verified before. If this is a mistake, contact dreamwxve or a staff member.", false);
                    } else {
                        return await popup(
                            "Hm, seems like the API is having issues. Please try again later.",
                            false,
                        );
                    }
                }
            } catch (e) {
                return popup(`Something weird happened: ${e.message}`)
            }
        } catch (e) {
            return await popup(`Hm, something odd happened: ${e.message}`, false);
        }
    };

    if (!isLoggedIn) {
        return (
            <>
                <title>TADC - Verification</title>
                <main className={styles.main}>
                    <Image
                        src="https://cdn.discordapp.com/icons/1270424450248216607/a_83811da161dfd073b751ba0dc2b58fce.gif?size=4096"
                        alt="Guild Icon"
                        width={200}
                        height={200}
                        className={`${styles.guildIcon} ${styles.pushUp}`}
                        unoptimized
                        priority
                    />
                    <h1 className={`${styles.guildName} ${styles.pushUp}`}>
                        The After Dark Collective
                    </h1>
                    <h2 className={styles.title}>ID Verification</h2>
                    <p className={styles.newDesc}>
                        By verifying you agree to the following:
                    </p>
                    <ul className={styles.linkList}>
                        <li>
                            <a
                                href="https://github.com/Dreamwxve/Dreamwxve/wiki/Terms-and-Conditions-of-Use"
                                className={styles.footerLink}
                            >
                                Terms of Serivce
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/Dreamwxve/Dreamwxve/wiki/Privacy-Policy"
                                className={styles.footerLink}
                            >
                                Privacy Policy
                            </a>
                        </li>
                    </ul>
                    <button
                        className={styles.loginButton}
                        onClick={() => signIn("discord")}
                    >
                        Begin Verification
                    </button>
                    <p className={styles.newDesc1}>
                        If you have any questions about this process
                        <br/>
                        please contact Dreamwxve
                    </p>
                    <Footer/>
                </main>
            </>
        );
    }

    return (
        <>
            <title>TADC - Verification</title>
            {isSubmitting ? null : (
                <main className={styles.main}>
                    <div className={styles.appealFormContainer}>
                        <h2>Age Verification Form</h2>
                        <div className={styles.userInfo}>
                            <img
                                src={`https://cdn.discordapp.com/avatars/${session.user.profile.id}/${session.user.profile.avatar}.png`}
                                alt="Profile Picture"
                                className={styles.profilePic}
                            />
                            <p>Logged in as: {session.user.profile.username}</p>
                        </div>
                        <VerificationForm
                            onSubmit={handleFormSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                    <Footer/>
                </main>
            )}
        </>
    );
}

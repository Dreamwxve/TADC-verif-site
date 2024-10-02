import styles from "../../styles/page.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          © 2024{" "}
          <a href="https://dreamwxve.dev" className={styles.footerLink}>
            Dreamwxve
          </a>{" "}
          | Created for{" "}
          <a
            href="https://discord.com/invite/PCHwFnjE7Z"
            className={styles.footerLink}
          >
            The After Dark Collective
          </a>{" "}
          | v0.1.0
        </div>
        <div className={styles.links}>
          <a
            href="https://github.com/Dreamwxve/Dreamwxve/wiki/Terms-and-Conditions-of-Use"
            className={styles.footerLink}
          >
            Terms of Service
          </a>
          <a
            href="https://github.com/Dreamwxve/Dreamwxve/wiki/Privacy-Policy"
            className={styles.footerLink}
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </>
  );
}

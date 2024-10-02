import { useState } from "react";
import { signOut } from "next-auth/react";
import styles from "../../styles/page.module.css";
import Swal from "sweetalert2";

export default function VerificationForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({ files: [] });

  const errPopup = async (message, isSuccess = false, reload = false) => {
    Swal.hideLoading();
    await Swal.fire({
      titleText: isSuccess ? "Verification Completed" : "Something went wrong",
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

  const handleChange = (e) => {
    const { files } = e.target;
    const selectedFiles = Array.from(files);
    const modifiedFiles = selectedFiles.map((file) => {
      const newFileName = `SPOILER_${file.name}`;
      return new File([file], newFileName, { type: file.type });
    });

    setFormData((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...modifiedFiles],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.showLoading();

    const { files } = formData;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      return errPopup("All files must be images");
    } else if (files.length < 2) {
      return errPopup("You need to upload 2 files");
    } else if (validFiles.length > 2) {
      return errPopup("You can only upload 2 files");
    }

    return onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="files" className={styles.label}>
          Upload your ID (2 images)
          <p className={styles.fileDescription}>
            <strong>1.</strong> Take a picture of your ID and make sure to blank
            everything but your birthdate and face.
            <br />
            <strong>2.</strong> Take a selfie next to your ID (censor out all
            sensitive info except photo and DOB)
          </p>
        </label>
        <input
          type="file"
          id="files"
          name="files"
          className={`${styles.fileInput} ${styles.inputField}`}
          accept="image/*"
          required
          multiple
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className={`${styles.submitButton} ${isSubmitting ? styles.disabled : ""}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Please wait..." : "Submit!"}
      </button>
      <button
        type="button"
        className={styles.logoutButton}
        onClick={() => signOut()}
      >
        Log Out
      </button>
    </form>
  );
}

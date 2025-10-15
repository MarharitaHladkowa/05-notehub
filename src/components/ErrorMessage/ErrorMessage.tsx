import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string | null;
}
export default function ErrorMessage({ message }: ErrorMessageProps) {
  const displayMessage =
    message || "An unexpected error occurred. Please try again later.";

  return <p className={css.text}>{displayMessage}</p>;
}

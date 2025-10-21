import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

const modalRoot =
  document.getElementById("modal-root") ||
  (() => {
    const div = document.createElement("div");
    div.id = "modal-root";
    document.body.appendChild(div);
    return div;
  })();

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Тип для дочерних элементов (текст, JSX, числа и т.д.)
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      // Якщо вікно закрите, нічого не робимо
      return;
    }

    // --- 1. Керування прокруткою ---
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // --- 2. Обробник ESC ---
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);

    // --- 3. Функція очищення (CLEANUP) ---
    return () => {
      // Відновлюємо прокрутку
      document.body.style.overflow = originalOverflow;
      // Видаляємо обробник клавіатури
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);
  // ------------------------------------------------------------------

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={css.modal}
        // Остановка всплытия, чтобы клик внутри модального окна не закрывал его
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия (X) */}
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Закрыть модальное окно"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    modalRoot // DOM-элемент, куда будет рендериться этот JSX (за пределами App)
  );
}

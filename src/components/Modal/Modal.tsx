import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom"; // 1. Импортируем createPortal
import css from "./Modal.module.css";

// ------------------------------------------------------------------
// Находим или создаем корневой элемент для портала вне основного DOM.
// Это нужно, чтобы модальное окно всегда было поверх всего содержимого.
// ------------------------------------------------------------------
const modalRoot =
  document.getElementById("modal-root") ||
  (() => {
    const div = document.createElement("div");
    div.id = "modal-root";
    document.body.appendChild(div);
    return div;
  })();
// ------------------------------------------------------------------

/**
 * Описывает пропсы для компонента модального окна.
 * @param isOpen Состояние открытия/закрытия модального окна.
 * @param onClose Функция, вызываемая для закрытия модального окна.
 * @param children Содержимое, отображаемое внутри модального окна (ReactNode - это любой элемент React).
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Тип для дочерних элементов (текст, JSX, числа и т.д.)
}

/**
 * Универсальный компонент модального окна.
 * Обеспечивает рендеринг через портал в document.body.
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Эффект для обработки закрытия по клавише ESC
  useEffect(() => {
    if (!isOpen) {
      // Если модальное окно закрыто, обработчик не нужен
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Регистрируем обработчик события клавиатуры
    window.addEventListener("keydown", handleEscape);

    // Функция очистки: удаляем обработчик при размонтировании
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]); // Зависимости: перезапуск эффекта при изменении состояния открытия

  if (!isOpen) {
    return null;
  }

  // Обработка закрытия при клике на фон (backdrop)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Проверяем, что клик был именно по фону (target === currentTarget),
    // а не по контенту внутри модального окна.
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ------------------------------------------------------------------
  // 2. Возвращаем результат createPortal
  // ------------------------------------------------------------------
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

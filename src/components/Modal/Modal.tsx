import { useEffect, type ReactNode } from "react";

/**
 * Описывает пропсы для компонента модального окна.
 * @param isOpen Состояние открытия/закрытия модального окна.
 * @param onClose Функция, вызываемая для закрытия модального окна.
 * @param children Содержимое, отображаемое внутри модального окна.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Используем ReactNode для типизации содержимого
}

/**
 * Универсальный компонент модального окна.
 * Обеспечивает центрирование, затемнение фона, и закрытие по Esc или клику вне контента.
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Эффект для обработки закрытия по клавише ESC
  useEffect(() => {
    if (!isOpen) {
      // Если модальное окно закрыто, не регистрируем обработчик
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Регистрируем обработчик события клавиатуры
    window.addEventListener("keydown", handleEscape);

    // Функция очистки: удаляем обработчик при размонтировании или изменении isOpen/onClose
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]); // Зависимости: перезапуск эффекта при изменении состояния открытия

  if (!isOpen) {
    return null;
  }

  // Обработка закрытия при клике на фон (backdrop)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Проверяем, что клик был именно по фону (а не по контенту внутри)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Фиксированный оверлей, занимает весь экран, z-index высокий
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      // Добавляем role="dialog" и aria-modal для доступности
      role="dialog"
      aria-modal="true"
    >
      {/* Контейнер модального окна */}
      <div
        className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-full transform 
                           transition-all duration-300 ease-out scale-100 opacity-100 relative"
        // Остановка всплытия, чтобы клик внутри модального окна не закрывал его
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100"
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

        {/* Основное содержимое, передаваемое через children */}
        {children}
      </div>
    </div>
  );
}

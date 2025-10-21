import React from "react";
import css from "./SearchBox.module.css";

// 1. Змінено назву інтерфейсу на SearchBoxProps
interface SearchBoxProps {
  // 2. Пропс value зроблено опціональним (?)
  value?: string;
  // Колбек onSearch залишається обов'язковим
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Використовуємо новий інтерфейс
export default function SearchBox({ value = "", onSearch }: SearchBoxProps) {
  // Встановлюємо значення за замовчуванням ("") для value у деструктуризації,
  // якщо воно опціональне і не передане, щоб уникнути помилок.

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={onSearch}
      // Використовуємо value замість defaultValue, щоб компонент був керованим (controlled)
      // Якщо ви хочете використовувати defaultValue, тоді у App.tsx не передавайте value=""
      value={value}
      aria-label="Search notes"
    />
  );
}

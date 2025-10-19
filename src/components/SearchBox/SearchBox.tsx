import React from "react";
import css from "./SearchBox.module.css";

// ИСПРАВЛЕНИЕ 1: Добавляем пропс 'value' в интерфейс Props
interface Props {
  value: string; // Новое поле для привязки значения из App.tsx
  onSearch: (search: string) => void;
}

export default function SearchBox({ value, onSearch }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
      value={value}
      aria-label="Search notes"
    />
  );
}

import React from "react";
import css from "./SearchBox.module.css";

// ИСПРАВЛЕНИЕ 1: Добавляем пропс 'value' в интерфейс Props
interface Props {
  value: string; // Новое поле для привязки значения из App.tsx
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value, onSearch }: Props) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={onSearch}
      defaultValue={value}
      aria-label="Search notes"
    />
  );
}

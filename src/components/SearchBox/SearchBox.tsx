import React from "react";
import css from "./SearchBox.module.css";

interface Props {
  value: string;
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

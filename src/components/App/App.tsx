import React from "react";
import css from "./App.module.css";
import NoteForm from "../NoteForm/NoteForm";
export default function App() {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <NoteForm />
        {/* Компонент SearchBox */}
        {/* Пагінація */}
        {/* Кнопка створення нотатки */}
      </header>
    </div>
  );
}

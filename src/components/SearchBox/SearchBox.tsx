import { type FC } from "react";
import css from "./SearchBox.module.css";

/**
 * Описывает пропсы для компонента SearchBox.
 * @param value Текущее значение поиска (мгновенное значение из App.tsx).
 * @param onSubmit Функция, вызываемая при изменении поля ввода,
 * которая обновляет мгновенное состояние в App.tsx.
 */
interface SearchBoxProps {
  value: string;
  onSubmit: (newSearch: string) => void;
}

/**
 * Компонент текстового поля для поиска.
 * Вся логика отложенной отправки (debounce) вынесена в App.tsx.
 * Этот компонент просто обеспечивает мгновенное обновление родительского состояния.
 */
const SearchBox: FC<SearchBoxProps> = ({ value, onSubmit }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Мгновенно передаем новое значение родительскому компоненту (App.tsx)
    onSubmit(event.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Пошук нотаток..."
      value={value}
      onChange={handleChange}
      aria-label="Пошук нотаток"
    />
  );
};

export default SearchBox;

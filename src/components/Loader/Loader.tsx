import css from "./loader.module.css";

export default function Loader() {
  return (
    <div className={css.loaderContainer}>
      <div className={css.spinner}></div>
    </div>
  );
}

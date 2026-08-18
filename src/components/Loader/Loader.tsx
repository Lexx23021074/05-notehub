import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loaderWrapper}>
      <p className={css.text}>Loading notes, please wait...</p>
    </div>
  );
}

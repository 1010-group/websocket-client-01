import { IoMdColorPalette } from "react-icons/io";

const themes = ["default", "luxury", "retro", "synthwave", "silk", "sunset"];

const ThemeSwitcher = ({ theme, setTheme }) => (
  <div className="dropdown dropdown-left">
    {/* Кнопка */}
    <label
      tabIndex={0}
      className="btn w-12 h-12 min-h-0 p-0 rounded-full bg-base-100 border border-primary shadow-md hover:bg-primary/10 flex items-center justify-center"
    >
      <IoMdColorPalette className="text-2xl text-base-content" />
    </label>

    {/* Выпадающее меню */}
    <ul
      tabIndex={0}
      className="dropdown-content z-[999] menu bg-base-100 rounded-box w-44 p-2 shadow-md shadow-primary"
    >
      <div className="join join-vertical w-full">
        {themes.map((t) => (
          <input
            key={t}
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label={t}
            value={t}
            onChange={(e) => setTheme(e.target.value)}
            checked={theme === t}
          />
        ))}
      </div>
    </ul>
  </div>
);

export default ThemeSwitcher;

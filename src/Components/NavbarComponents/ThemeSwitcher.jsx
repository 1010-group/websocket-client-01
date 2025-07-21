import { IoMdColorPalette } from "react-icons/io";

const themes = ["default", "luxury", "retro", "synthwave", "silk", "sunset"];

const ThemeSwitcher = ({ theme, setTheme }) => (
    <div className="dropdown dropdown-start">
        <div tabIndex={0} role="button" className="btn m-1 w-20 h-10"><IoMdColorPalette className="text-2xl text-primary"/></div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-45 p-2 shadow-md shadow-primary">
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
                    />
                ))}
            </div>
        </ul>
    </div>
);

export default ThemeSwitcher;

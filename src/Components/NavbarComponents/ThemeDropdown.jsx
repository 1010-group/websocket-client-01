import React, { useState, useEffect } from 'react';

const themes = [
    'Default',
    'Coffee',
    'luxury',
    'synthwave',
    'aqua',
    'light',
    'cmyk',
];

const ThemeDropdown = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="dropdown dropdown-start">
            <div tabIndex={0} role="button" className="btn m-1 w-24 h-10 capitalize">{theme}</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-md z-[999] max-h-96 overflow-y-auto">
                <div className="join join-vertical w-full ">
                    {themes.map((t) => (
                        <input
                            key={t}
                            type="radio"
                            name="theme-buttons"
                            className="btn btn-box theme-controller join-item capitalize"
                            aria-label={t}
                            value={t}
                            onClick={() => setTheme(t)}
                            checked={theme === t}
                        />
                    ))}
                </div>
            </ul>
        </div>
    );
};

export default ThemeDropdown;

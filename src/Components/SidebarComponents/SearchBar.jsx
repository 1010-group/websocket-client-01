import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
    const { path } = useLocation();
    return (
        <div className="flex justify-center items-center flex-col ">
            <label className="input mb-1 flex items-center gap-2 bg-base-200 rounded-full p-2 w-full shadow-md shadow-primary">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input
                    type="search"
                    required
                    placeholder="Search"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </label>
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-bordered">
                <Link
                    to="/favorites"
                    className={`tab ${path === '/favorites' ? 'tab-active' : ''}`}
                >
                    Favorites
                </Link>
                <Link
                    to="/game"
                    className={`tab ${path === '/game' ? 'tab-active' : ''}`}
                >
                    Games
                </Link>
                <Link
                    to="/shop"
                    className={`tab ${path === '/shop' ? 'tab-active' : ''}`}
                >
                    Shop
                </Link>
                <Link
                    to="/inventory"
                    className={`tab ${path === '/inventory' ? 'tab-active' : ''}`}
                >
                    Inventory
                </Link>
            </div>
        </div>
    );
};

export default SearchBar
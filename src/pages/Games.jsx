import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GamesNavbar from '../Components/GamesNavbar';
import {  FaTimes, FaRegCircle, FaUser, FaKeyboard } from 'react-icons/fa';


const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      name: 'Hangman',
      description: 'Guess the word before the stickman is complete. Fun and educational!',
      route: '/game/hangman',
      icon: <FaUser  className="text-5xl text-error" />,
    },
    {
      name: 'Tic Tac Toe',
      description: 'Get three in a row to win. A classic game for all ages!',
      route: '/game/tic-tac-toe',
      icon: (
        <div className="flex gap-2 text-4xl text-primary">
          <FaTimes />
          <FaRegCircle />
        </div>
      ),
    },
    {
      name: 'Typer',
      description: 'Test your typing speed and accuracy.',
      route: '/game/typer',
      icon: <FaKeyboard  className="text-5xl text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-sm px-4 py-3">
        <div className="flex justify-between items-center flex-row-reverse">
          <GamesNavbar />
          <button onClick={() => navigate(-1)} className="btn btn-outline btn-error">
            Назад
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary">🎮 Choose a Game</h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {games.map((game) => (
            <div
              key={game.name}
              className="relative group w-80 p-1 rounded-3xl bg-gradient-to-tr from-primary to-secondary  shadow-2xl hover:shadow-[0_0_25px_5px_rgba(99,102,241,0.5)] transition-all duration-300"
            >
              <div className="bg-base-200/70 backdrop-blur-xl rounded-3xl h-full w-full p-5 flex flex-col justify-between">
                <div className="flex justify-center items-center h-40 mb-4">
                  {game.icon}
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-extrabold text-primary mb-2 tracking-wide">{game.name}</h2>
                  <p className="text-base-content text-sm mb-4">{game.description}</p>
                </div>

                <Link to={game.route}>
                  <button className="btn w-full bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-md hover:scale-105 transition-transform duration-300">
                    🚀 Play Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;

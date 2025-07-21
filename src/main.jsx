import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { registerSW } from 'virtual:pwa-register'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import PrivateRouter from "./guard/PrivateRouter.jsx"
import Favorites from "./pages/Favorites.jsx";
import { toast, ToastContainer } from "react-toastify";  // <-- добавил ToastContainer
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import Chat from "./pages/Chat.jsx"
import Games from "./pages/Games.jsx";
import HangmanGame from "./Games/HangMan.jsx";
import TicTacToe from "./Games/TicTacToe.jsx";
import NotFound from "./pages/NotFound.jsx";
import Typer from "./Games/Typer.jsx";
import Shop from "./pages/Shop.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRouter>
        <App />
      </PrivateRouter>
    ),
    children: [
      {
        path: "chat/:chatId",
        element: <Chat />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "game",
        element: <Games />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/game",
    element: <Games />,
  },
  {
    path: "/game/hangman",
    element: <HangmanGame />,
  },
  {
    path: "/game/tic-tac-toe",
    element: <TicTacToe />,
  },
  {
    path: "/game/typer",
    element: <Typer />,
  },
  {
    path: "*",
    element: <NotFound />
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </PersistGate>
  </Provider>
);

registerSW({ immediate: true })

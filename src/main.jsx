import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import PrivateRouter from "./guard/PrivateRouter.jsx"
import Chat from "./pages/Chat.jsx";
import Favorites from "./pages/Favorites.jsx";
import { toast, ToastContainer } from "react-toastify";  // <-- добавил ToastContainer
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

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
        path: "chat/:id",
        element: <Chat />,
      },
      {
        path: "favorites",
        element: <Favorites />,
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

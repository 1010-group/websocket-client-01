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
  Link,
} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import PrivateRouter from "./guard/PrivateRouter.jsx"
import Chat from "./pages/Chat.jsx";
import Favorites from "./pages/Favorites.jsx";
import { toast, ToastContainer } from "react-toastify";  // <-- добавил ToastContainer
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { FaCheck } from "react-icons/fa";

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
  {
    path: "/togirlandi",
    element: <div className="flex flex-col justify-center items-center h-screen text-4xl font-bold gap-4 text-success ">
      <div class="animate-bounce flex items-center gap-2">
        <span>Togirlandi</span>
        <span><FaCheck /></span>
      </div>
      <div>
        <Link class="/" className="btn btn-primary ">
          <span className="">Bosh sahifaga qaytish</span>
        </Link>
      </div>
    </div>,
  }
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

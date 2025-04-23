import { createBrowserRouter } from "react-router";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserList />
  },
  {
    path: "/create",
    element: <UserForm />
  },
  {
    path: "/edit/:id",
    element: <UserForm />
  }
])
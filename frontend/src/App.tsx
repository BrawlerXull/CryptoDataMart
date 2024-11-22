import { Toaster } from "react-hot-toast";
import IndexPage from "./pages/Index.js";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DashboardPage from "./pages/Dashboard.js";
import AddDatasetPage from "./components/AddDataSet.js";
import Community from "./components/Community.js";
import PrivateRoute from "./components/PrivateRoute.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<IndexPage />} />
      <Route path="/dashboard">
        <Route index element={<DashboardPage />} />
        <Route path="add-dataset" element={<PrivateRoute element={<AddDatasetPage />} />} />
      </Route>
      <Route path="/community">
        <Route index element={<Community />} />
      </Route>
    </Route>
  )
);

function App() {

  return (
    <>
      <RouterProvider router={router} future={{ v7_startTransition: true }}/>
      <Toaster />
    </>
  )
}

export default App

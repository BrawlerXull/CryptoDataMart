import { Toaster } from "react-hot-toast";
import IndexPage from "./pages/Index.js";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DashboardPage from "./pages/Dashboard.js";
import AddDatasetPage from "./pages/AddDataSet.js";
import PrivateRoute from "./components/PrivateRoute.js";
import DatasetPage from "./pages/DatasetPage.js";
import Community from "./pages/Community.js";
import PlayGroundPage from "./pages/PlayGroundPage.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<IndexPage />} />
      <Route path="/dashboard">
        <Route index element={<DashboardPage />} />
        <Route path="add-dataset" element={<PrivateRoute element={<AddDatasetPage />} />} />
        <Route path="dataset/:id" element={<DatasetPage />}/>
      </Route>
      <Route path="/community">
        <Route index element={<Community />} />
      </Route>
      <Route path="/playground">
        <Route index element={<PlayGroundPage />} />
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

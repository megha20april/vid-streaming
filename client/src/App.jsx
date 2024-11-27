import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Player from "./components/Player";
import Upload from "./components/Upload";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="player/:key" element={<Player />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

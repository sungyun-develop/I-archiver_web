import "./App.css";
import Home from "./routes/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CaData from "./routes/CaData";
import RWfiles from "./routes/RWfiles";
import Nms from "./routes/Nms";
import ArchiverMon from "./routes/ArchiverMon";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div>
        <Link to="/archiver">
          <h1>Go to archiver test</h1>
        </Link>
        <Link to="/ca">
          <h1> Go to CA test</h1>
        </Link>
        <Link to="/read&write">
          <h1> Go to file test</h1>
        </Link>
        <Link to="/nms">
          <h1> Go to Network test</h1>
        </Link>
        <Link to="/archiverStatus">
          <h1> Go to archiver status</h1>
        </Link>
      </div>
      <Routes>
        <Route path="/archiver" element={<Home />} />
        <Route path="/ca" element={<CaData />} />
        <Route path="/read&write" element={<RWfiles />} />
        <Route path="/nms" element={<Nms />} />
        <Route path="/archiverStatus" element={<ArchiverMon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

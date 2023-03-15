import "./App.css";
import Home from "./routes/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CaData from "./routes/CaData";

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
      </div>
      <Routes>
        <Route path="/archiver" element={<Home />} />
        <Route path="/ca" element={<CaData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

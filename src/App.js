import "./App.css";
import Home from "./routes/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CaData from "./routes/CaData";
import RWfiles from "./routes/RWfiles";
import Nms from "./routes/Nms";
import ArchiverMon from "./routes/ArchiverMon";
import KomacHome from "./routes/KomacHome";
import NoeventTable from "./components/noeventtable/NoeventTable";
import AlarmMon from "./routes/AlarmMon";
import Manual from "./routes/Manual";
import ChartTest from "./routes/ChartTest";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div>
        <Link to="/alarm">
          <h1> Go to alarm status</h1>
        </Link>
        <Link to="/archiver">
          <h1>Go to archiver test</h1>
        </Link>
        <Link to="/ca">
          <h1> Go to CA test</h1>
        </Link>
        <Link to="/read&write">
          <h1> Go to file test</h1>
        </Link>
        <Link to="/">
          <h1> Go to Home</h1>
        </Link>
        <Link to="/archiverStatus">
          <h1> Go to archiver status</h1>
        </Link>
        <Link to="/chartTest">
          <h1> Go to zoomable chart</h1>
        </Link>
      </div>
      <Routes>
        <Route path="/alarm/*" element={<AlarmMon />} />
        <Route path="/archiver" element={<Home />} />
        <Route path="/ca" element={<CaData />} />
        <Route path="/read&write" element={<RWfiles />} />
        <Route path="/" element={<KomacHome />} />
        <Route path="/archiverStatus/*" element={<ArchiverMon />} />
        <Route path="/archiverStatus/noEvent" element={<NoeventTable />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/chartTest" element={<ChartTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

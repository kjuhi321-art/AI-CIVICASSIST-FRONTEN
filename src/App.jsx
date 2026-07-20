import Result from "./pages/Result";
import Loading from "./pages/Loading";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CitizenForm from "./pages/CitizenForm";

function App() {
  return (
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/citizen-form" element={<CitizenForm />} />
  <Route path="/loading" element={<Loading />} />
  <Route path="/result" element={<Result />} />
</Routes>
  );
}

export default App;
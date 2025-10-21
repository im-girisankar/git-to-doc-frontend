import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GeneratePage from "./pages/GeneratePage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/preview/:jobId" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

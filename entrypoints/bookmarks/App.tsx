import { HashRouter, Routes, Route } from "react-router-dom";

import useTheme from "@/hooks/useTheme";

import About from "./pages/About";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/settings" element={<Settings theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Items } from "./Items";
import { ItemDetail } from "./ItemDetail";

function App() {
  return (
    <Router basename="/myreactpractice_deploy">
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
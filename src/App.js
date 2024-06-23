import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SingleVideoComponent from "./components/SingleVideoComponent";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<SingleVideoComponent />} />
      </Routes>
    </>
  )
}

export default App;
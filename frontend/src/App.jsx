import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";
import Trip from "./components/Trip";
import Error from "./components/Error";
import Book from "./components/Book";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/trip/:id" element={<Trip />} />
        <Route path="/book/:id" element={<Book />} />
        <Route
          path="*"
          element={<Error error="Nie znaleziono strony o podanym adresie!" />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

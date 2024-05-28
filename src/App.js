import "./App.css";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useToken from "./services/useToken";
import StudentBookingRequest from "./pages/student/StudentBookingRequest";

function App() {
  const { token, setToken, removeToken } = useToken();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              token={token}
              setToken={setToken}
              removeToken={removeToken}
            />
          }
        >
          <Route index element={<Home token={token} setToken={setToken} />} />
          <Route path="/student-booking" element={<StudentBookingRequest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

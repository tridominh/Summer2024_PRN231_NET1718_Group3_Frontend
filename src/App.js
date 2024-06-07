import "./App.css";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useToken from "./services/useToken";
import { Login } from "./component/Login";
import { StudentHome } from "./pages/StudentHome";
import { Profile } from "./pages/Profile";
import { ProfileTutor } from "./pages/ProfileTutor";
import { TutorHome } from "./pages/TutorHome";
import StudentBookingRequest from "./pages/student/StudentBookingRequest";
import PrivateRoute from "./services/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ModeratorHome } from "./pages/ModeratorHome";
import Features from "./pages/Features";
import StudentRequestsPage from "./pages/student/StudentRequestsPage.jsx";
import { BrowseBooking } from "./pages/tutor/BrowseBooking";
import { SchedulePage } from "./pages/student/SchedulePage";

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
          <Route
            path="Profile"
            element={<Profile token={token} setToken={setToken} />}
          />
          <Route
            path="tutor-home"
            element={<TutorHome token={token} setToken={setToken} />}
          />
          <Route
            path="ProfileTutor"
            element={<ProfileTutor token={token} setToken={setToken} />}
          />
          <Route
            path="student-home"
            element={<StudentHome token={token} setToken={setToken} />}
          />
          <Route path="/student/booking" element={<StudentBookingRequest />} />
          <Route path="/student/requests" element={<StudentRequestsPage />} />
          <Route
            path="/schedule"
            element={
              <PrivateRoute roles={["Student","Tutor"]}>
                <SchedulePage/>
              </PrivateRoute>
            }
          ></Route>
          {/*Tutor paths*/}
          <Route
            path="Features"
            element={<Features token={token} setToken={setToken} />}
          />
          <Route
            path="/tutor/request"
            element={
              <PrivateRoute role="Tutor">
                <BrowseBooking/>
              </PrivateRoute>
            }
          ></Route>

          <Route
            path="/about"
            element={
              <PrivateRoute role="Tutor">
                <ProfileTutor token={token} setToken={setToken} />
              </PrivateRoute>
            }
          ></Route>
          {/*Admin paths*/}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/*Moderator paths*/}
          <Route
            path="/manage-credential"
            element={
              <PrivateRoute role="Moderator">
                <ModeratorHome />
              </PrivateRoute>
            }
          />{" "}
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

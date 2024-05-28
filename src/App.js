import logo from './logo.svg';
import './App.css';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useToken from './services/useToken';
import { Login } from './component/Login';
import { StudentHome } from './pages/StudentHome';
import {Profile} from './pages/Profile';
import { ProfileTutor } from './pages/ProfileTutor';
import { TutorHome } from './pages/TutorHome';


function App() {

  const { token, setToken, removeToken } = useToken();

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout token={token} setToken={setToken} removeToken={removeToken}/>}>
                <Route index element={<Home token={token} setToken={setToken}/>}/>
            <Route path="Profile" element={<Profile token={token} setToken={setToken}/>} />
            <Route path="ProfileTutor" element={<ProfileTutor token={token} setToken={setToken}/>} />
            <Route path="student-home" element={<StudentHome token={token} setToken={setToken}/>} />
            <Route path="tutor-home" element={<TutorHome token={token} setToken={setToken}/>} />
            </Route>
            <Route path="login" element={<Login />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useToken from './services/useToken';
import { Login } from './component/Login';
import { StudentHome } from './pages/StudentHome';

function App() {

  const { token, setToken, removeToken } = useToken();

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout token={token} setToken={setToken} removeToken={removeToken}/>}>
                <Route index element={<Home token={token} setToken={setToken}/>}/>
            </Route>
            <Route path="student-home" element={<StudentHome token={token} setToken={setToken}/>} />
            <Route path="login" element={<Login />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;

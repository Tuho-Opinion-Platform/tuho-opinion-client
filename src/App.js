import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Opinions from './pages/Opinions';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import OpinionDetails from './pages/OpinionDetails';
import EditOpinion from './components/EditOpinion';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/opinions' element={ <Opinions />}/>
        <Route path='/signup' element={ <SignUpPage />} />
        <Route path='/login' element={ <LoginPage />} />
        <Route path='/opinions/:opinionId' element={ <OpinionDetails />} />
        <Route path='/opinions/edit/:opinionId' element={ <EditOpinion />} />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Opinions from './pages/Opinions';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import OpinionDetails from './pages/OpinionDetails';
import EditOpinion from './components/EditOpinion';
import CreateComment from './components/CreateComment';
import Pdf from './pages/Pdf';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={ <Opinions />}/>
        <Route path='/opinions' element={ <Opinions />}/>
        <Route path='/signup' element={ <SignUpPage />} />
        <Route path='/login' element={ <LoginPage />} />
        <Route path='/opinions/:opinionId' element={ <OpinionDetails />} />
        <Route path='/opinions/edit/:opinionId' element={ <EditOpinion />} />
        <Route path='/opinions/:opinionId/comments' element={ <CreateComment />} />
        <Route path='/pdf-file' element={<Pdf />}/>
      </Routes>
    </div>
  );
}

export default App;
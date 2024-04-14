import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from './common/Feed';
import Navbar from './common/Navbar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SingIn';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
        <Route path='/' element={<PrivateRoute />}>
            <Route path='/' element={<Feed />} />
          </Route>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/*' element={<NotFound />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;

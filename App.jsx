import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import LiveMapViewer from './eta/eta';
import SeatAllocationForm from './Admin/adding';
import Intro from './intro/intro';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Book from './book/book';
import Login from "./login/login";
import TransitmateButtons from "./home/home";
import Profile from './profile/profile';
import WelcomeScreen from './intro/welcome';
import AdminPanel from './Admin/admin';
import ChangeRouteForm from './Admin/function/alter';
import SignupPage from './login/signup';
import ShareLocation from './live/live';
import Loader from './Loader/Loader';
import ReceiveLocation from './eta/eta';
import 'leaflet/dist/leaflet.css';
import { messaging, getToken, onMessage } from './firebaseConfig';
import AdLoginPage from './Admin/adlog';
import SelectRoute01 from './Select/SelectRoute01';
import SelectRoute from './Select/SelectRoute';

// Socket.IO connection
const socket = io('http://localhost:5000'); // Flask server URL

function App() {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Handle Socket.IO response
  useEffect(() => {
    socket.on('response', (data) => {
      console.log('Response from server:', data);
      setResponse(data);
    });

    return () => {
      socket.off('response');
    };
  }, []);

  const handleAllocateSeat = (userData) => {
    socket.emit('allocate_seat', userData); // Send data to Flask
  };

  useEffect(() => {
    // Request notification permission (same as before)
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/home" element={<TransitmateButtons />} />
          <Route path="/book" element={<Book handleAllocateSeat={handleAllocateSeat} />} />
          <Route path="/locate" element={<LiveMapViewer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/alter" element={<ChangeRouteForm />} />
          <Route path="/live" element={<ShareLocation />} />
          <Route path="/eta" element={<ReceiveLocation />} />
          <Route path="/add" element={<SeatAllocationForm />} />
          <Route path="/adlog" element={<AdLoginPage />} />
          <Route path="/livetrans" element={<SelectRoute />} />
          <Route path="/viewloc" element={<SelectRoute01 />} />
        </Routes>
      </div>
      {response && <div>{response.message}</div>} {/* Display server response */}
    </Router>
  );
}

export default App;

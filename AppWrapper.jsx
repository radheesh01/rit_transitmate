import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FancyLoader from './components/FancyLoader'; // Import the loader
import FullMap from './eta/eta';
import Intro from './intro/intro';
import Book from './book/book';
import Login from "./login/login";
import TransitmateButtons from "./home/home";
import Profile from './profile/profile';
import Boards from './routes/boards';
import WelcomeScreen from './intro/welcome';
import AdminPanel from './Admin/admin';
import ChangeRouteForm from './Admin/function/alter';
import SignupPage from './login/signup';
import ShareLocation from './live/live';

function AppWrapper() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading delay (3 seconds)
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Reset loading on page route changes
    if (!loading) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, []); // This effect runs on every page transition (route change)

  if (loading) {
    return <FancyLoader />;  // Show loader while loading
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/home" element={<TransitmateButtons />} />
          <Route path="/book" element={<Book />} />
          <Route path="/locate" element={<FullMap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/viewing" element={<Boards />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/alter" element={<ChangeRouteForm />} />
          <Route path="/live" element={<ShareLocation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWrapper;
import { useNavigate } from "react-router-dom";
import { FaCrown, FaMobileAlt, FaGraduationCap } from "react-icons/fa";
import "./intro.css";

const Intro = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    document.getElementById(path).classList.add("clicked");
    setTimeout(() => navigate(path), 500);
  };

  return (
    <div className="container">
      <h1>WELCOME</h1>
      <h2>To RIT TRANSITMATE</h2>
      <div className="button-group">
        <div
          id="/adlog"
          className="role-button"
          onClick={() => handleClick("/adlog")}
        >
          <FaCrown className="icon" />
          <p>ADMIN</p>
        </div>
        <div
          id="/livetrans"
          className="role-button"
          onClick={() => handleClick("/livetrans")}
        >
          <FaMobileAlt className="icon" />
          <p>USER</p>
        </div>
        <div
          id="/login"
          className="role-button"
          onClick={() => handleClick("/login")}
        >
          <FaGraduationCap className="icon" />
          <p>STUDENT</p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
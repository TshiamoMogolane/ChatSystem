
import { Link } from 'react-router-dom';
export default function LoginForm() {

  return (

    <div className="login-container">
      <h4 className="text-left mb-2 ">Welcome</h4>
      <form>
        <input type="text" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Log In</button>

        {/* Forgot password link right below the button */}
        <div className="text-left mt-1.5">
          <Link to="/forgot-password" style={{ fontSize: '0.9rem' }}>
            Forgot password?
          </Link>
        </div>
      </form>
    </div>

  );
}
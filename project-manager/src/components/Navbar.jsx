import { Link } from 'react-router-dom';
import '../Scss/components/Navbar.scss';

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/help">Help</Link>
    </nav>
  );
};

export default Navbar;

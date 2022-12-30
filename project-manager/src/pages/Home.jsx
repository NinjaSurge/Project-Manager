import '../Scss/pages/Home.scss';

// Components
import ListProjects from '../components/ListProjects';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='home'>
      <h1>Home</h1>
      <ListProjects />
      <Link to={'/new/project'}>New Project</Link>
    </div>
  );
};

export default Home;

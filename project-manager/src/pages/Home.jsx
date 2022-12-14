import '../Scss/pages/Home.scss';

// Components
import ListProjects from '../components/ListProjects';

const Home = () => {
  return (
    <div className="home">
      <h1>Home</h1>
      <ListProjects />
    </div>
  );
};

export default Home;

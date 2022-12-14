import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ListProjects = () => {
  const [projectList, setProjectList] = useState(null);

  useEffect(() => {
    fetch('/api/projects', { method: 'GET' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch data');
        }
        return res.json();
      })
      .then((data) => {
        setProjectList(data);
      });
    return () => {};
  }, []);

  return (
    <ul>
      {projectList &&
        projectList.map((project) => (
          <li>
            <Link to={`/project/${project._id}`}>{project.name}</Link>
          </li>
        ))}
    </ul>
  );
};

export default ListProjects;

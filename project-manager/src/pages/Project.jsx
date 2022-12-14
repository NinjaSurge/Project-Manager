import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Styles
import '../Scss/pages/Project.scss';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`, { method: 'GET' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch data');
        }
        return res.json();
      })
      .then((data) => {
        setProject(data);
      });
    return () => {};
  }, []);

  return (
    project && (
      <div className="project">
        <h2>{project.name}</h2>
        <p>{project._id}</p>
      </div>
    )
  );
};

export default Project;

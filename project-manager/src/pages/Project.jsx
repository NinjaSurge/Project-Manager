import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// Styles
import '../Scss/pages/Project.scss';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [readme, setReadme] = useState(null);

  useEffect(() => {
    // const getProject = async () =>await
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

    // const getReadme = async () => await
    // fetch(`/api/projects/${id}/file`, {
    //   method: 'POST',
    //   body: JSON.stringify({ filePath: 'README.md' }),
    //   headers: {
    //     'Content-type': 'application/json',
    //   },
    // })
    fetch(`/api/projects/${id}/README.md`, {
      method: 'GET',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch data');
        }
        return res.text();
      })
      .then((data) => {
        setReadme(data);
      });

    // getProject();
    // getReadme();
    return () => {};
  }, [id]);

  // const markdown = '# Heading';
  return (
    project && (
      <div className='project'>
        <h2 className='project-name'>{project.name}</h2>
        <p>{project._id}</p>
        <h3>README.md:</h3>
        {readme && (
          <ReactMarkdown
            className='markdown-text'
            // children={markdown}
            children={readme}
            remarkPlugins={[remarkGFM]}
            rehypePlugins={[rehypeRaw]}
            transformImageUri={(src) => {
              if (!src.includes('https://')) {
                return `/api/projects/${id}/${encodeURIComponent(src)}`;
              } else {
                return src;
              }
            }}
          />
        )}
      </div>
    )
  );
};

export default Project;

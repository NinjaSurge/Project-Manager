import '../Scss/components/EditProject.scss';

// Libs
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * TODO
 * - [ ] Dynamic Create/Edit
 *  - [ ] Create
 *  - [ ] Edit
 * - [ ] Validation
 *  - [ ] Handle Server
 *  - [ ] Prevent Empty
 */

/**
 * @description This is a form used to Create and Edit Basic Project information
 * @author NinjaSurge
 * @param {*} { edit }
 * @return {*}
 */
const EditProject = ({ edit }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [setReadme, setSetReadme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  // const [errorFields, setErrorFields] = useState(null);

  const url = edit ? `/api/projects/${id}` : '/api/projects/';
  const method = edit ? 'PATCH' : 'POST';
  const return_address = edit ? `/project/${id}` : '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting...');
    setLoading(true);

    // Validation
    if (name === null && name === '') {
      setError('Invalid Name value');
    }

    if (setReadme === null) {
      setError('Invalid setReadme value');
    }

    // Set valid data
    const data = {
      name,
      description,
      readme: setReadme,
    };

    fetch(url, { method: method })
      .then((res) => {
        if (!res.ok) {
          return { fail: true, error: res.json() };
        }

        return res.json();
      })
      .then((data) => {
        console.log('data', data);
        if (data.fail) {
          setError(data.error);
        }
        console.log('data', data);
        setLoading(false);
        // navigate(return_address);
      });
  };

  useEffect(() => {
    if (!edit) {
      setName('');
      setDescription('');
      setSetReadme(false);
    }
    if (edit) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setDescription(data.description);
          setSetReadme(data.setReadme);
        });
    }
    setLoading(false);
    return () => {};
  }, [edit, error, url]);

  return (
    <div className='project-editor'>
      {error && (
        <div className='error-prompt'>
          <h2>{error.error}</h2>
          <h3>Values that need to be changed:</h3>
          <ul>
            {error.fields.map((field) => {
              return (
                <li>
                  {field.field_name} - {field.description}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>{edit ? 'Edit' : 'Create'} a Project</legend>
          <label htmlFor='name'>
            Name:
            <input
              type='text'
              name='project_name'
              id='name'
              placeholder='Project Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor='readme-check'>
            README?
            <input
              type='checkbox'
              name='setReadme'
              id='readme-check'
              value={setReadme}
              onChange={(e) => {
                setSetReadme(e.target.value);
              }}
            />
          </label>
          <label htmlFor='description'>
            Description:
            <input
              type='text'
              name='project_description'
              id='description'
              placeholder='Project Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </fieldset>
        <button disabled={error || loading}>
          {edit ? 'Edit' : 'Create'} Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;

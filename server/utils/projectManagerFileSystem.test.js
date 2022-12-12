const pmfs = require('./projectManagerFileSystem');
const mock = require('mock-fs');

describe('Server Response', () => {
  describe('Sucess', () => {
    beforeEach(() => {
      mock({
        Projects: {
          '00_Project': {
            '.pm.json':
              '{"name":"00_Project", "_id":"c3d171fa-49d9-4c43-800e-cde5963c8df1"}',
          },
        },
      });
    });

    afterEach(() => {
      mock.restore();
    });
    it('getProjects()', () => {
      const project_dir = './Projects';
      expect(pmfs.getProjects(project_dir)).toEqual(
        expect.arrayContaining([
          {
            name: '00_Project',
            _id: 'c3d171fa-49d9-4c43-800e-cde5963c8df1',
          },
        ])
      );
    });

    it('getProject()', () => {
      const project_dir = './Projects';
      expect(
        pmfs.getProject(project_dir, 'c3d171fa-49d9-4c43-800e-cde5963c8df1')
      ).toEqual(
        expect.objectContaining({
          name: '00_Project',
          _id: 'c3d171fa-49d9-4c43-800e-cde5963c8df1',
        })
      );
    });

    it('editProject()', () => {
      const project_dir = './Projects';

      const change = {
        name: 'Project_00',
        _id: 'c3d171fa-49d9-4c43-800e-cde5963c8df1',
      };

      expect(
        pmfs.editProject(
          project_dir,
          'c3d171fa-49d9-4c43-800e-cde5963c8df1',
          change
        )
      ).toEqual(
        expect.objectContaining({
          name: 'Project_00',
          _id: 'c3d171fa-49d9-4c43-800e-cde5963c8df1',
        })
      );
    });

    it('makeProject()', () => {
      const project_dir = './Projects';

      const info = {
        name: 'Project_01',
      };

      expect(pmfs.makeProject(project_dir, info)).toEqual(
        expect.objectContaining({
          name: 'Project_01',
          _id: expect.stringMatching(
            /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/
          ),
        })
      );
    });

    it('deleteProject()', () => {
      const project_dir = './Projects';

      pmfs.makeProject(
        project_dir,
        (info = {
          name: 'Project_01',
        })
      );

      expect(
        pmfs.deleteProject(project_dir, 'c3d171fa-49d9-4c43-800e-cde5963c8df1')
      ).toEqual(
        expect.arrayContaining([
          {
            name: 'Project_01',
            _id: expect.stringMatching(
              /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/
            ),
          },
        ])
      );
    });
  });
});

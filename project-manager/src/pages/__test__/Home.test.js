import { render, screen } from '@testing-library/react';
import Home from '../Home';

test('renders learn react link', () => {
  render(<Home />);
  const homeText = screen.getByText(/Home/i);
  expect(homeText).toBeInTheDocument();
});

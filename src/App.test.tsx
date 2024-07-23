import React from 'react';
import { render, screen } from '@testing-library/react';
import CalculatorApp from './App';

test('renders learn react link', () => {
  render(<CalculatorApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

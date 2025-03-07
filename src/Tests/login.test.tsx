import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import App from '../App'; 


global.fetch = vi.fn();


vi.mock('../assets/Btn1.png', () => ({ default: 'mock-btn1.png' }));
vi.mock('../assets/Btn2.png', () => ({ default: 'mock-btn2.png' }));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the welcome message and login button', () => {
    render(<App />);

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login with Spotify/i })).toBeInTheDocument();
  });


  test('changes button image on hover', () => {
    render(<App />);

    const button = screen.getByRole('button', { name: /Login with Spotify/i });
    const buttonImage = screen.getByRole('img', { name: /Login with Spotify/i });

    expect(buttonImage).toHaveAttribute('src', 'mock-btn1.png');

    fireEvent.mouseEnter(button);
    expect(buttonImage).toHaveAttribute('src', 'mock-btn2.png');

    fireEvent.mouseLeave(button);
    expect(buttonImage).toHaveAttribute('src', 'mock-btn1.png');
  });


});
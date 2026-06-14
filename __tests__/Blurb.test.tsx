import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Blurb from '../components/Blurb';

describe('Blurb', () => {
    it('renders the hero heading and call-to-action links', () => {
        render(<Blurb />);
        expect(screen.getByRole('heading', { name: 'Preponderous Software' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /browse projects/i })).toBeInTheDocument();
        const github = screen.getByRole('link', { name: /view on github/i });
        expect(github).toHaveAttribute('href', 'https://github.com/Preponderous-Software');
    });

    it('renders the three get-involved info cards', () => {
        render(<Blurb />);
        expect(screen.getByText('Contribute')).toBeInTheDocument();
        expect(screen.getByText('Explore the Code')).toBeInTheDocument();
        expect(screen.getByText('Free & Open Source')).toBeInTheDocument();
    });
});

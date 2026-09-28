import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Blurb from '../components/Blurb';

const ORG_URL = 'https://github.com/Preponderous-Software';
const REPOSITORIES_URL = 'https://github.com/orgs/Preponderous-Software/repositories';
const OPEN_ISSUES_URL = 'https://github.com/search?q=org%3APreponderous-Software+is%3Aissue+is%3Aopen&type=issues';

describe('Blurb', () => {
    it('renders the hero heading and call-to-action links', () => {
        render(<Blurb />);
        expect(screen.getByRole('heading', { name: 'Preponderous Software' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /browse projects/i })).toBeInTheDocument();
        const github = screen.getByRole('link', { name: /view on github/i });
        expect(github).toHaveAttribute('href', ORG_URL);
    });

    it('renders the three get-involved info cards', () => {
        render(<Blurb />);
        expect(screen.getByText('Contribute')).toBeInTheDocument();
        expect(screen.getByText('Explore the Code')).toBeInTheDocument();
        expect(screen.getByText('Source Available')).toBeInTheDocument();
    });

    it('gives "Get involved" a heading level 2 and each info-card title a heading level 3', () => {
        render(<Blurb />);
        expect(screen.getByRole('heading', { level: 2, name: 'Get involved' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Contribute' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Explore the Code' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Source Available' })).toBeInTheDocument();
    });

    it('renders the linking info cards as real anchors that open in a new tab', () => {
        render(<Blurb />);
        for (const [name, href] of [[/^contribute/i, OPEN_ISSUES_URL], [/^explore the code/i, REPOSITORIES_URL]] as const) {
            const card = screen.getByRole('link', { name });
            expect(card).toHaveAttribute('href', href);
            expect(card).toHaveAttribute('target', '_blank');
            expect(card).toHaveAttribute('rel', 'noopener noreferrer');
        }
    });

    it('leaves the non-linking info card as plain, unfocusable content', () => {
        render(<Blurb />);
        const card = screen.getByText('Source Available').closest('a');
        expect(card).toBeNull();
        expect(screen.queryByRole('link', { name: /source available/i })).not.toBeInTheDocument();
    });
});

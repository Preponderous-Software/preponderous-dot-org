import { describe, expect, it } from 'vitest';
import { isActiveNavLink } from '../utils/nav';

describe('isActiveNavLink', () => {
    it('marks an internal link active when it matches the current route', () => {
        expect(isActiveNavLink('/about', '/about')).toBe(true);
        expect(isActiveNavLink('/', '/')).toBe(true);
    });

    it('does not mark an internal link active on a different route', () => {
        expect(isActiveNavLink('/about', '/')).toBe(false);
        expect(isActiveNavLink('/', '/about')).toBe(false);
    });

    it('never marks an external link active, even on a matching string', () => {
        expect(isActiveNavLink('https://github.com/Preponderous-Software', 'https://github.com/Preponderous-Software')).toBe(false);
        expect(isActiveNavLink('/', 'https://github.com/Preponderous-Software')).toBe(false);
    });
});

import { describe, expect, it } from 'vitest';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CastleIcon from '@mui/icons-material/Castle';
import WavesIcon from '@mui/icons-material/Waves';
import { glyphFor, PROJECT_GLYPHS } from '../utils/projectGlyphs';

describe('PROJECT_GLYPHS', () => {
    it('maps each name to the Material icon of the same name', () => {
        expect(PROJECT_GLYPHS.AcUnit).toBe(AcUnitIcon);
        expect(PROJECT_GLYPHS.Castle).toBe(CastleIcon);
        expect(PROJECT_GLYPHS.Waves).toBe(WavesIcon);
    });

    it('carries exactly the twelve glyphs the bundle is meant to include', () => {
        expect(Object.keys(PROJECT_GLYPHS).sort()).toEqual([
            'AcUnit', 'Biotech', 'Castle', 'Extension', 'GridOn', 'Hub',
            'Phishing', 'Psychology', 'Public', 'Terminal', 'ViewQuilt', 'Waves',
        ]);
    });
});

describe('glyphFor', () => {
    it('returns the mapped icon for a known name', () => {
        expect(glyphFor('Castle')).toBe(CastleIcon);
    });

    it('returns undefined for no name or an empty one', () => {
        expect(glyphFor()).toBeUndefined();
        expect(glyphFor('')).toBeUndefined();
    });

    it('returns undefined for an unknown name, so the icon falls back to the initial', () => {
        expect(glyphFor('NoSuchIcon')).toBeUndefined();
    });

    it('matches names case-sensitively', () => {
        expect(glyphFor('castle')).toBeUndefined();
    });
});

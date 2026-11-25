import {styled, Switch} from '@mui/material';
import {COARSE_POINTER_QUERY, TOUCH_TARGET} from '../styles/styles';

// On a touch screen the switch's tap area is 44px tall with the same look.
// The root clips its children, so it grows by 10px with 5px more padding on
// each side (the track stays 20px), the thumb moves down 5px to stay centred,
// and the invisible input stretches over the full height. A mouse keeps the
// 62x34 switch. Mirrors dansplugins.com#618.
export const colorModeSwitchTouchStyle = {
    height: TOUCH_TARGET,
    paddingTop: 12,
    paddingBottom: 12,
    '& .MuiSwitch-switchBase': {top: 5},
    '& .MuiSwitch-input': {top: -6, height: TOUCH_TARGET},
};

// A Switch restyled as a sun/moon color-mode toggle. The thumb shows a sun in
// light mode and a moon when checked (dark mode); the icons live in
// /public/colormode/{light,dark}.svg. Wired up by TopBar/BottomBar, which pass
// `checked` (from the active theme) and `onChange` (ColorModeContext.toggleColorMode).
export const ColorModeToggleSwitch = styled(Switch)(({theme}) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('/colormode/dark.svg')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('/colormode/light.svg')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
    [COARSE_POINTER_QUERY]: colorModeSwitchTouchStyle,
}));

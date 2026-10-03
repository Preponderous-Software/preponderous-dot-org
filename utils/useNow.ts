import React from 'react';

// The visitor's clock, read once after the page has mounted; null during the
// server render and the first client render, so the static HTML (built once,
// served for weeks) never bakes in its build date and hydration never
// mismatches. Whatever depends on it renders nothing until it is set.
export const useNow = (): Date | null => {
    const [now, setNow] = React.useState<Date | null>(null);
    React.useEffect(() => {
        setNow(new Date());
    }, []);
    return now;
};

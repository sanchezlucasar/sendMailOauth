import { useEffect, useState } from 'react';

export const useDebounce = (value: string, timeout: number): string => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value)
    useEffect(() => {
        const timeoutId = setTimeout(() => setDebouncedValue(value), timeout);
        return () => clearTimeout(timeoutId);
    }, [value, timeout]);
    return debouncedValue;
};

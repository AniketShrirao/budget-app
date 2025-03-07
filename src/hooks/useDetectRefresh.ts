import { useEffect, useState } from "react";

const useDetectRefresh = () => {
    const [isRefreshed, setIsRefreshed] = useState(() => {
        try {
            return sessionStorage.getItem('isRefreshed') === 'true';
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const navigationType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type;
        const isReload = navigationType === "reload";
        
        try {
            sessionStorage.setItem('isRefreshed', isReload.toString());
            setIsRefreshed(isReload);
        } catch (error) {
            console.warn('Session storage not available:', error);
        }
    }, []);

    return isRefreshed;
};

export default useDetectRefresh;

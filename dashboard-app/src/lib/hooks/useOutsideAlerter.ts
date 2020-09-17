import { useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref, mostly for closing modals
 */
export const useOutsideAlerter = (ref: any, onClickOutside: Function) => {
    useEffect(() => {
        
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}
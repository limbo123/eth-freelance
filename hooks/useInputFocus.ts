import { useEffect, useState } from "react";

export default function useInputFocus(ref) {
    const [isFocusing, setIsFocusing] = useState(false);

    const on = () => setIsFocusing(true);
    const off = () => setIsFocusing(false);

    useEffect(() => {
        if(ref.current) {
            const input = ref.current;
            input.addEventListener("focus", on);
            input.addEventListener("blur", off);

            return function() {
                input.removeEventListener("focus", on);
                input.removeEventListener("blur", off);   
            }
        }
       
    }, [])

    return isFocusing;
}
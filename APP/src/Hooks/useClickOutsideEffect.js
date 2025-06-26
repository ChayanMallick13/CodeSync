import { useEffect } from "react";


export default function useOutsideClickHandler(ref,outsideClickHandler){
    //will write into the click handler of the component
    useEffect(
        () => {
            //if doc is clicked then this will triggered
            function clickListener(event){
                if(!ref.current || ref.current.contains(event.target)){
                    return;
                }
                outsideClickHandler();
            }

            //add the event listener
            document.addEventListener('click',clickListener);

            //while rerender remoevb the event listener
            return () => {
                document.removeEventListener('click',clickListener);
            }

        },[ref,outsideClickHandler]
    );
}
import toast from "react-hot-toast";


export const copyToClipBoard = async(text,navigator) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success('Successfully Copied To ClipBoard');
    } catch (error) {
        toast.error('Some Problem in Copying To Clipboard');
    }
}
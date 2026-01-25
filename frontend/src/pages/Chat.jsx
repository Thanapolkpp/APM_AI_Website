import { useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";

const Chat = () => {
    const { mode } = useParams();
    console.log(mode);
    return <ChatWindow mode={mode} />;
};

export default Chat;

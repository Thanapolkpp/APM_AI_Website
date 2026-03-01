import { useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
    const { mode } = useParams();

    return (
        /* h-screen: บังคับความสูงเท่าจอพอดี 
           overflow-hidden: ป้องกันไม่ให้หน้าเพจเลื่อนขึ้นลงเกินจำเป็น (ให้แชทเลื่อนข้างในเอง)
        */
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden">

            {/* --- ส่วนที่ 1: Chat Window (อยู่ตรงกลาง) --- */}
            <main className="flex-1 flex justify-center items-center p-4 md:p-10 relative">
                {/* ตกแต่งพื้นหลังให้นุ่มนวล */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-[10%] -left-[10%] size-[400px] bg-pink-200/20 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-[10%] -right-[10%] size-[400px] bg-purple-200/20 blur-[100px] rounded-full" />
                </div>

                <div className="w-full max-w-4xl h-full flex flex-col">
                    <ChatWindow mode={mode} />
                </div>
            </main>

        </div>
    );
};

export default Chat;
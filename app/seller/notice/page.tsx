"use client";
import { findMessageListByUserId, readAllMessage } from "@/_api/message";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { useMessageNotReadCountState } from "@/state_stores/messageStore";
import { Message } from "@/types/_api/message";
import { formatStringDate } from "@/utils/common";
import { messageReadStatus } from "@/utils/constant";
import { toastErrorMsg, toastInfoMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiCheck, HiOutlineBell } from "react-icons/hi";
import { MdCleaningServices } from "react-icons/md";

export default function SellerNoticePage() {
  const { loginUser } = useLoginUserStore();
  const router = useRouter();

  // 所有消息是否已读（打勾），用于全部已读
  const [isAllSelected, setIsAllSelected] = useState(false);

  const [messageList, setMessageList] = useState<Message[]>([]);
  // 同步 Sidebar messageNotReadCountState
  const { messageNotReadCount, setMessageNotReadCount } = useMessageNotReadCountState();

  const [notReadCount, setNotReadCount] = useState<number>();

  // 消息列表滚动到底部
  const msgContainerEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (msgContainerEndRef.current) {
      msgContainerEndRef.current.scrollTop = msgContainerEndRef.current.scrollHeight;
    }
  }, [JSON.stringify(messageList)]);

  useEffect(() => {
    if (!loginUser) return;
    findMessageListByUserId(loginUser?.id).then((rsp) => {
      if (rsp.errCode !== 0) {
        toastErrorMsg("服务器开了会小差，请稍后重试！");
        return;
      }
      setMessageList(rsp.data);
      setNotReadCount(rsp.data.filter((msg) => msg.is_read === messageReadStatus.NotRead).length);
    });
    // messageNotReadCount 更新时（websocket 推送），重新获取消息列表
  }, [JSON.stringify(loginUser), messageNotReadCount]);

  const handleAllRead = () => {
    if (!loginUser) return;
    if (notReadCount === 0) {
      toastInfoMsg("您目前没有未读消息哦 ~");
      return;
    }

    readAllMessage(loginUser?.id)
      .then((rsp) => {
        if (rsp.errCode !== 0) {
          toastErrorMsg("服务器开了会小差，请稍后重试！");
          return;
        }
        setIsAllSelected(true);
        setNotReadCount(0);
        setMessageNotReadCount(0);
        toastSuccessMsg("已将所有未读消息置为已读状态！");
      })
      .catch(() => {
        toastErrorMsg("服务器开了会小差，请稍后重试！");
      });
  };

  return (
    <section className="flex flex-col gap-3 items-start">
      <h2 className="text-3xl">消息列表</h2>
      <Divider className="w-3/4" />
      <div className="flex justify-between w-3/4 mb-1">
        <div className="flex gap-2">
          <h4 className="text-2xl">消息</h4>
          <p className="self-end text-default-400">
            ({notReadCount}/{messageList.length})
          </p>
        </div>
        <Button size="sm" variant="ghost" color="primary" onClick={handleAllRead} startContent={<MdCleaningServices />}>
          全部已读
        </Button>
      </div>
      <div
        ref={msgContainerEndRef}
        className="border rounded-lg shadow bg-gray-800 border-gray-700 flex flex-col items-start w-3/4 h-[600px] overflow-y-scroll scroll-smooth"
      >
        {messageList.map((message) => (
          <div key={message.id} className="flex items-start gap-2.5 mx-3 my-3">
            <img className="w-8 h-8 rounded-full" src="/logo.png" alt="image" />
            <div className="flex flex-col gap-1 w-[90%]">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-white">PromptRun 官方</span>
                <span className="text-sm font-normal text-gray-400">{formatStringDate(message.create_time)}</span>
              </div>
              <div className="flex gap-2">
                <div
                  className={`flex leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${
                    isAllSelected || message.is_read === messageReadStatus.Readed
                      ? "bg-gray-700/50 text-gray-400"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <p className="text-sm font-normal text-start">{message.content}</p>
                </div>
                {(isAllSelected || message.is_read === messageReadStatus.Readed) && (
                  <Button isIconOnly disabled variant="flat" className="self-center" size="sm" color="primary">
                    <HiCheck className="w-5 h-5" />
                  </Button>
                )}
                {!isAllSelected && message.is_read === messageReadStatus.NotRead && (
                  <Button isIconOnly disabled variant="solid" className="self-center" size="sm" color="primary">
                    <HiOutlineBell className="w-5 h-5 animate-scale-5000" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

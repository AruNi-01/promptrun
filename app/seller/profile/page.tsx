"use client";
import { findSellerByUserId, sellerUpdate } from "@/api/seller";
import { findUserById } from "@/api/user";
import { UploadIcon } from "@/components/icons";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Seller, SellerUpdateReq } from "@/types/api/seller";
import { checkIsLogin, getDayDiffUtilNow } from "@/utils/common";
import { toastErrorMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Rating } from "@material-tailwind/react";
import { Avatar, Button, Chip, Divider, Input, Textarea, cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SellerProfilePage() {
  const route = useRouter();

  const { loginUser, setLoginUser, removeLoginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
    setLoginUser: state.setLoginUser,
    removeLoginUser: state.removeLoginUser,
  }));
  const [seller, setSeller] = useState<Seller>();

  const [isEdit, setIsEdit] = useState(false);
  const [editBtnIsLoading, setEditBtnIsLoading] = useState(false);

  const [sellerFrom, setSellerForm] = useState<SellerUpdateReq>({
    userId: loginUser?.id || 0,
    nickname: loginUser?.nickname || "",
    email: loginUser?.email || "",
    headerImgBase64: undefined,

    intro: seller?.intro || "",
  });

  const handleUserFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditBtnIsLoading(true);

    try {
      var rsp = await sellerUpdate(sellerFrom);
      if (!checkIsLogin(rsp.errCode)) {
        removeLoginUser();
        route.refresh();
        toastErrorMsg("您未登录，请登录后再操作！");
        return;
      } else if (rsp.errCode !== 0) {
        toastErrorMsg("更新卖家信息失败，请稍后重试！");
        return;
      }
      toastSuccessMsg("更新卖家信息成功！");
      setSellerForm({
        ...sellerFrom,
        headerImgBase64: undefined,
      });

      // 更新 loginUser Store
      rsp = await findUserById(sellerFrom.userId);
      if (rsp.errCode !== 0) {
        toastErrorMsg("查询卖家信息失败，请稍后重试！");
        return;
      }
      setLoginUser({
        id: rsp.data.id,
        email: rsp.data.email,
        password: rsp.data.password,
        nickname: rsp.data.nickname,
        headerUrl: rsp.data.header_url,
        type: rsp.data.type,
        createTime: rsp.data.create_time,
      });

      // 重新 fetch seller，更新 seller state
      fetchSeller();
    } catch (error) {
      toastErrorMsg("更新卖家信息失败，请稍后重试！");
    }

    setEditBtnIsLoading(false);
    setIsEdit(false);
  };

  useEffect(() => {
    fetchSeller();

    // 监听到 loginUser 变化时，更新相关数据，防止相关数据在登录状态变化后不更新（loginUser Store 加载较慢）
    setSellerForm({
      userId: loginUser?.id || 0,
      nickname: loginUser?.nickname || "",
      email: loginUser?.email || "",
      headerImgBase64: undefined,

      intro: seller?.intro || "",
    });

    // 注意：React 默认通过比较对象的引用来判断是否发生变化，而对象每次重新渲染后引用都会改变。
    // 所以对象的比较需要通过 JSON.stringify 转换为字符串再比较，否则会导致死循环。
  }, [JSON.stringify(loginUser), JSON.stringify(seller)]);

  const fetchSeller = async () => {
    if (!loginUser) return;

    try {
      var rsp = await findSellerByUserId(loginUser.id);
      if (rsp.errCode !== 0) {
        toastErrorMsg("查询卖家信息失败，请稍后刷新重试！");
        return;
      }

      setSeller(rsp.data);
    } catch (error) {
      toastErrorMsg("获取卖家信息失败，请稍后刷新重试！");
    }
  };

  return (
    <section className="flex flex-col gap-3 mt-8">
      <div className="flex justify-between">
        <h2 className="text-3xl">个人信息</h2>
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="ghost"
            onClick={() => {
              setIsEdit(true);
            }}
            className={`${isEdit ? "hidden" : ""}`}
          >
            编辑
          </Button>
          <Button
            color="success"
            variant="shadow"
            type="submit"
            form="user-form"
            isLoading={editBtnIsLoading}
            className={`${isEdit ? "" : "hidden"}`}
          >
            保存
          </Button>
          <Button
            onClick={() => {
              setIsEdit(false);
              route.refresh();
            }}
            color="danger"
            variant="light"
            className={`${isEdit ? "" : "hidden"}`}
          >
            取消
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between"></div>
      <form id="user-form" onSubmit={handleUserFormSubmit} className="grid grid-cols-1 gap-6">
        <div className="flex gap-2 items-center">
          <span>头像</span>
          <div className="flex items-center gap-4">
            <Avatar src={loginUser?.headerUrl} className={cn("w-16 h-16 text-large", `${isEdit ? "hidden" : ""}`)} />
            <div className="flex items-center justify-center h-16 w-16">
              <label
                htmlFor="dropzone-file"
                className={cn(
                  `${!isEdit ? "hidden" : ""}`,
                  "flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                )}
              >
                <div className="relative inline-block">
                  <Avatar
                    src={`${sellerFrom.headerImgBase64 ? sellerFrom.headerImgBase64 : loginUser?.headerUrl}`}
                    className="w-16 h-16 opacity-30"
                  />
                  <UploadIcon className="absolute top-4 left-4 w-8 h-8 text-white" />
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = (e) => {
                        setSellerForm({ ...sellerFrom, headerImgBase64: e.target?.result as string });
                      };
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
        <Input
          value={sellerFrom.nickname}
          onValueChange={(value) => {
            setSellerForm({ ...sellerFrom, nickname: value });
          }}
          isReadOnly={!isEdit}
          label="昵称"
          isRequired={isEdit}
          labelPlacement="outside-left"
          size="lg"
        />
        <Input
          value={sellerFrom.email}
          onValueChange={(value) => {
            setSellerForm({ ...sellerFrom, email: value });
          }}
          isReadOnly={!isEdit}
          label="邮箱"
          isRequired={isEdit}
          type="email"
          labelPlacement="outside-left"
          size="lg"
        />
        <Textarea
          value={sellerFrom.intro}
          onValueChange={(value) => {
            setSellerForm({ ...sellerFrom, intro: value });
          }}
          isReadOnly={!isEdit}
          label="简介"
          placeholder="输入简介，让买家更了解你吧！"
          labelPlacement="outside-left"
          type="text"
          className="max-w-xl"
        />
        <Divider />
        {seller && loginUser && (
          <>
            <div className="flex items-center">
              获得评分：
              <Rating
                value={
                  // 四舍五入计算评分
                  Math.round(seller.rating)
                }
                readonly
                ratedColor="blue"
              />
              <Chip variant="flat" color="primary" size="sm" radius="sm" className="ml-2">
                {seller.rating}
              </Chip>
              <span className="ml-1"> — 基于 {seller?.sell_amount} 个已评价订单</span>
            </div>
            <div className="flex mt-3 text-sm text-default-500">
              今天是您加入 PromptRun 的第
              <span className="mx-1 text-default-700">{getDayDiffUtilNow(new Date(loginUser.createTime))}</span>
              天，成为卖家的第
              <span className="mx-1 text-default-700">{getDayDiffUtilNow(new Date(seller.create_time))}</span>天
            </div>
          </>
        )}
      </form>
    </section>
  );
}

"use client";
import { findModelList } from "@/api/model";
import { findPromptListByBuyerId, findPromptMasterImgListByPromptIds } from "@/api/prompt";
import { findUserById, userUpdate } from "@/api/user";
import { UploadIcon } from "@/components/icons";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Model } from "@/types/api/model";
import { Paginate } from "@/types/api/paginate";
import { PromptAttachOrderId } from "@/types/api/prompt";
import { PromptImg } from "@/types/api/prompt_img";
import { UserUpdateReq } from "@/types/api/user";
import { toastErrorMsg, toastSuccessMsg } from "@/utils/messageToast";
import {
  CardHeader,
  Avatar as MaterialAvatar,
  Card as MaterialCard,
  CardBody as MaterialCardBody,
  Rating,
  Typography,
} from "@material-tailwind/react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Image,
  Input,
  Link,
  Pagination,
  cn,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const { loginUser, setLoginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
    setLoginUser: state.setLoginUser,
  }));

  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [editBtnIsLoading, setEditBtnIsLoading] = useState(false);

  const [userForm, setUserForm] = useState<UserUpdateReq>({
    userId: loginUser?.id || 0,
    nickname: loginUser?.nickname || "",
    email: loginUser?.email || "",
    headerImgBase64: undefined,
  });

  const handleUserFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditBtnIsLoading(true);

    try {
      var rsp = await userUpdate(userForm);
      if (rsp.errCode !== 0) {
        toastErrorMsg("更新用户信息失败，请稍后重试！");
        return;
      }
      toastSuccessMsg("更新用户信息成功！");
      setUserForm({
        ...userForm,
        headerImgBase64: undefined,
      });

      // 更新 loginUser Store
      rsp = await findUserById(userForm.userId);
      if (rsp.errCode !== 0) {
        toastErrorMsg("重新查询用户信息失败，请稍后重试！");
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
    } catch (error) {
      toastErrorMsg("更新用户信息失败，请稍后重试！");
    }

    setEditBtnIsLoading(false);
    setIsEdit(false);
  };

  const [promptAttachOrderIdList, setPromptAttachOrderIdList] = useState<PromptAttachOrderId[]>([]);
  const [promptMasterImgList, setPromptMasterImgList] = useState<PromptImg[]>([]);
  const [modelList, setModelList] = useState<Model[]>([]);
  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 4,
  });
  const [rows, setRows] = useState<number>(0);

  useEffect(() => {
    if (!loginUser) return;

    fetchModelList();
    fetchBuyerPromptData();

    // 监听到 loginUser 变化时，更新相关数据，防止相关数据在登录状态变化后不更新（loginUser Store 加载较慢）
    setUserForm({
      userId: loginUser?.id || 0,
      nickname: loginUser?.nickname || "",
      email: loginUser?.email || "",
      headerImgBase64: undefined,
    });

    // 注意：React 默认通过比较对象的引用来判断是否发生变化，而对象每次重新渲染后引用都会改变。
    // 所以对象的比较需要通过 JSON.stringify 转换为字符串再比较，否则会导致死循环。
  }, [JSON.stringify(paginate), JSON.stringify(loginUser)]);

  const fetchModelList = async () => {
    try {
      const rsp = await findModelList();
      if (rsp.errCode !== 0) {
        toastErrorMsg("获取模型列表失败，请稍后刷新重试！");
        return;
      }
      setModelList(rsp.data);
    } catch (error) {
      toastErrorMsg("获取模型列表失败，请稍后刷新重试！");
    }
  };

  const fetchBuyerPromptData = async () => {
    try {
      // fetch prompt list
      const rsp = await findPromptListByBuyerId({
        paginate: paginate,
        buyerId: loginUser?.id,
      });
      if (rsp.errCode !== 0) {
        toastErrorMsg("查询 Prompt 列表失败，请稍后刷新重试！");
        return;
      }
      setPromptAttachOrderIdList(rsp.data.promptAttachOrderIdList);
      setRows(rsp.data.rows);
    } catch (error) {
      toastErrorMsg("获取提示词列表失败，请稍后刷新重试！");
    }
  };

  useEffect(() => {
    const fetchPromptMasterImgList = async () => {
      try {
        // fetch prompt master_img list
        const rsp = await findPromptMasterImgListByPromptIds(promptAttachOrderIdList.map((item) => item.prompt.id));
        if (rsp.errCode !== 0) {
          toastErrorMsg("查询 Prompt 主图列表失败，请稍后刷新重试！");
          return;
        }
        setPromptMasterImgList(rsp.data);
      } catch (error) {
        toastErrorMsg("获取 Prompt 主图列表失败，请稍后刷新重试！");
      }
    };
    fetchPromptMasterImgList();
  }, [JSON.stringify(promptAttachOrderIdList)]);

  return (
    <section className="flex flex-col gap-5 w-4/6 mt-8">
      <title>个人主页 | PromptRun</title>
      <div key="profile" className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h2 className="text-4xl">个人信息</h2>
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
                router.refresh();
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
        <form id="user-form" onSubmit={handleUserFormSubmit} className="grid grid-cols-2 gap-6">
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
                      src={`${userForm.headerImgBase64 ? userForm.headerImgBase64 : loginUser?.headerUrl}`}
                      className="w-16 h-16 opacity-30"
                    />
                    <UploadIcon className="absolute top-4 left-4 w-8 h-8 text-white" />
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg,image/WebP"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                          setUserForm({ ...userForm, headerImgBase64: e.target?.result as string });
                        };
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <span />
          <Input
            value={userForm.nickname}
            onValueChange={(value) => {
              setUserForm({ ...userForm, nickname: value });
            }}
            isReadOnly={!isEdit}
            label="昵称"
            isRequired={isEdit}
            labelPlacement="outside-left"
            size="lg"
          />
          <Input
            value={userForm.email}
            onValueChange={(value) => {
              setUserForm({ ...userForm, email: value });
            }}
            isReadOnly={!isEdit}
            label="邮箱"
            isRequired={isEdit}
            type="email"
            labelPlacement="outside-left"
            size="lg"
          />
        </form>
      </div>

      <div key="bought_prompts" className="flex flex-col gap-5 mt-10">
        <div className="flex justify-between">
          <h2 className="text-4xl">买入的 Prompts</h2>
        </div>
        <Divider />
        <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 mt-2">
          {promptAttachOrderIdList?.map((item) => (
            <Card
              shadow="sm"
              key={item.prompt.id}
              isPressable
              isHoverable
              as={Link}
              href={`/order/${item.orderId}`}
              target="_blank"
              className=""
            >
              <CardBody className="overflow-visible p-0">
                <div className="relative">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.prompt.title}
                    className="w-full object-cover h-[150px]"
                    src={promptMasterImgList.find((promptImg) => promptImg.prompt_id === item.prompt.id)?.img_url}
                  />
                  <Chip
                    variant="flat"
                    radius="sm"
                    size="md"
                    className="absolute top-0 right-0 m-1 z-10"
                    classNames={{
                      base: "bg-black/80 text-white",
                    }}
                  >
                    {modelList.find((model) => model.id === item.prompt.model_id)?.name}
                  </Chip>
                  <div className="absolute h-8 bottom-0 left-0 right-0 p-1 rounded-b-xl bg-black bg-opacity-50 z-10">
                    <Rating
                      value={
                        // 四舍五入计算评分
                        Math.round(item.prompt.rating)
                      }
                      readonly
                      ratedColor="blue"
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter className="justify-between">
                <b>{item.prompt.title}</b>
                <p className="text-default-500 text-lg">￥{item.prompt.price}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="py-2 px-2 flex justify-between items-center">
          <span className="text-default-400 text-medium">共计 {rows} Prompts</span>
          <Pagination
            showControls
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="default"
            page={paginate.page}
            total={rows > paginate.pageSize ? Math.ceil(rows / paginate.pageSize) : 1}
            variant="light"
            onChange={(page) => {
              setPaginate((prev) => ({ ...prev, page: page }));
            }}
          />
        </div>
      </div>

      <Link href="/seller/dashboard" className="group h-[20rem] max-w-[55rem] my-10 mx-auto">
        <MaterialCard shadow={false} className="relative grid items-end justify-center overflow-hidden text-center">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="absolute inset-0 m-0 h-full w-full rounded-none bg-[url('/profile_bg.png')] bg-cover bg-center"
          >
            <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
          </CardHeader>
          <MaterialCardBody className="relative py-14 px-6 md:px-12">
            <Typography variant="h2" color="white" className="mb-6 font-medium leading-[1.5]">
              去出售 Prompts 页面，查看您发售的 Prompts
            </Typography>
            <Typography variant="h5" className="mb-6 text-gray-300">
              @{loginUser?.nickname}
            </Typography>
            <MaterialAvatar
              size="xl"
              variant="circular"
              alt="tania andrew"
              className="border-2 border-default-600 group-hover:animate-scale-5000"
              src={loginUser?.headerUrl}
            />
          </MaterialCardBody>
        </MaterialCard>
      </Link>
    </section>
  );
}

"use client";
import { findModelList } from "@/api/model";
import { findPromptList, findPromptListByBuyerId, findPromptMasterImgListByPromptIds } from "@/api/prompt";
import { UploadIcon } from "@/components/icons";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Model } from "@/types/api/model";
import { Paginate } from "@/types/api/paginate";
import { Prompt } from "@/types/api/prompt";
import { PromptImg } from "@/types/api/prompt_img";
import { toastErrorMsg } from "@/utils/messageToast";
import { Rating } from "@material-tailwind/react";
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
import {
  Card as MaterialCard,
  CardHeader,
  CardBody as MaterialCardBody,
  Typography,
  Avatar as MaterialAvatar,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

export default function UserPage() {
  const { loginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
  }));

  const [isEdit, setIsEdit] = useState(false);
  const [editBtnIsLoading, setEditBtnIsLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    nickname: loginUser?.nickname || "",
    email: loginUser?.email || "",
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEditBtnIsLoading(true);
    setTimeout(() => {
      setEditBtnIsLoading(false);
    }, 1000);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [promptMasterImgList, setPromptMasterImgList] = useState<PromptImg[]>([]);
  const [modelList, setModelList] = useState<Model[]>([]);
  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 4,
  });
  const [rows, setRows] = useState<number>(0);

  useEffect(() => {
    fetchModelList();
    fetchBuyerPromptData();

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
      var rsp = await findPromptListByBuyerId({
        paginate: paginate,
        buyerId: loginUser?.id,
      });
      if (rsp.errCode !== 0) {
        toastErrorMsg("查询 Prompt 列表失败，请稍后刷新重试！");
        return;
      }
      setPromptList(rsp.data.prompts);
      setRows(rsp.data.rows);

      // fetch prompt master_img list
      rsp = await findPromptMasterImgListByPromptIds(rsp.data.prompts.map((prompt: { id: number }) => prompt.id));
      if (rsp.errCode !== 0) {
        toastErrorMsg("查询 Prompt 主图列表失败，请稍后刷新重试！");
        return;
      }
      setPromptMasterImgList(rsp.data);
    } catch (error) {
      toastErrorMsg("获取提示词列表失败，请稍后刷新重试！");
    }
  };

  return (
    <section className="flex flex-col gap-5 w-4/6 mt-8">
      <div key="profile" className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h2 className="text-4xl">个人信息</h2>
          <div className="flex gap-2">
            <Button
              color={`${isEdit ? "success" : "primary"}`}
              variant={`${isEdit ? "shadow" : "ghost"}`}
              type="submit"
              onClick={() => {
                setIsEdit(!isEdit);
              }}
              isLoading={editBtnIsLoading}
            >
              {isEdit ? "保存" : "编辑"}
            </Button>
            <Button
              onClick={() => {
                setIsEdit(false);
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
        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6">
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
                    <Avatar src={loginUser?.headerUrl} className="w-16 h-16 opacity-30" />
                    <UploadIcon className="absolute top-4 left-4 w-8 h-8 text-white" />
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg"
                    className="hidden"
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
          {promptList?.map((prompt) => (
            <Card shadow="sm" key={prompt.id} isPressable onPress={() => console.log("item pressed")} className="">
              <CardBody className="overflow-visible p-0">
                <div className="relative">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={prompt.title}
                    className="w-full object-cover h-[150px]"
                    src={promptMasterImgList.find((promptImg) => promptImg.prompt_id === prompt.id)?.img_url}
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
                    {modelList.find((model) => model.id === prompt.model_id)?.name}
                  </Chip>
                  <div className="absolute h-8 bottom-0 left-0 right-0 p-1 rounded-b-xl bg-black bg-opacity-50 z-10">
                    <Rating
                      value={
                        // 四舍五入计算评分
                        Math.round(prompt.rating)
                      }
                      readonly
                      ratedColor="blue"
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter className="justify-between">
                <b>{prompt.title}</b>
                <p className="text-default-500 text-lg">￥{prompt.price}</p>
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

      <Link href="/seller" className="group h-[20rem] max-w-[55rem] my-10 mx-auto">
        <MaterialCard shadow={false} className="relative grid items-end justify-center overflow-hidden text-center">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="absolute inset-0 m-0 h-full w-full rounded-none bg-[url('https://draft.dev/learn/assets/posts/golang.png')] bg-cover bg-center"
          >
            <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
          </CardHeader>
          <MaterialCardBody className="relative py-14 px-6 md:px-12">
            <Typography variant="h2" color="white" className="mb-6 font-medium leading-[1.5]">
              去出售 Prompts 页面，查看您发售的 Prompts
            </Typography>
            <Typography variant="h5" className="mb-6 text-gray-300">
              {loginUser?.nickname}
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

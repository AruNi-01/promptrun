"use client";
import { findModelList } from "@/_api/model";
import { findPromptList, findPromptMasterImgListByPromptIds, updatePromptPublishStatusById } from "@/_api/prompt";
import ghostMoveAnimation from "@/public/lottie/ghost-move.json";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Model } from "@/types/_api/model";
import { Paginate } from "@/types/_api/paginate";
import { Prompt } from "@/types/_api/prompt";
import { PromptImg } from "@/types/_api/prompt_img";
import { auditStatusOptions, publishStatus as publishStatusConstants, publishStatusOptions } from "@/utils/constant";
import { toastErrorMsg, toastInfoMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Button } from "@nextui-org/button";
import {
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  CheckboxGroup,
  Chip,
  ChipProps,
  cn,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Pagination,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import { checkIsLogin } from "@/utils/common";

const auditStatusColorMap: Record<string, ChipProps["color"]> = {
  2: "success",
  0: "danger",
  1: "warning",
};

const publishStatusColorMap: Record<string, ChipProps["color"]> = {
  0: "default",
  1: "success",
};

export default function SellerGoodsPage() {
  const { loginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
  }));

  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [promptMasterImgList, setPromptMasterImgList] = useState<PromptImg[]>([]);
  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 12,
  });
  const [rows, setRows] = useState<number>(0);

  const [modelList, setModelList] = useState<Model[]>([]);
  const [modelSelected, setModelSelected] = useState<string>("all");

  const [publishStatus, setPublishStatus] = useState<string[]>();
  const [auditStatus, setAuditStatus] = useState<string[]>();

  useEffect(() => {
    fetchModelList();
  }, []);

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

  useEffect(() => {
    fetchPromptData();

    // 注意：React 默认通过比较对象的引用来判断是否发生变化，而对象每次重新渲染后引用都会改变。
    // 所以对象的比较需要通过 JSON.stringify 转换为字符串再比较，否则会导致死循环。
  }, [JSON.stringify(paginate), JSON.stringify(loginUser), publishStatus, auditStatus, modelSelected]);

  const fetchPromptData = async () => {
    if (!loginUser) return;

    try {
      // fetch prompt list
      var rsp = await findPromptList({
        paginate: paginate,
        publishStatus: publishStatus?.length !== 0 ? publishStatus?.map((str) => Number(str)) : undefined,
        AuditStatus: auditStatus?.length !== 0 ? auditStatus?.map((str) => Number(str)) : undefined,
        userId: loginUser?.id,

        // 如果 modelSelected 为 all，则不传 modelId；否则传 modelId，需要根据 modelSelected 去匹配 modelList 中的 id
        modelId: modelSelected === "all" ? undefined : modelList.find((model) => model.name === modelSelected)?.id,
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

  const handlePublishStatusChange = async (promptId: number, publishStatus: number) => {
    const newPublishStatus =
      publishStatus === publishStatusConstants.PublishOn
        ? publishStatusConstants.PublishOff
        : publishStatusConstants.PublishOn;
    try {
      const rsp = await updatePromptPublishStatusById({
        promptId,
        newPublishStatus,
      });
      if (!checkIsLogin(rsp.errCode)) {
        toastInfoMsg("请先登录后再操作！");
        return;
      }
      if (rsp.errCode !== 0) {
        toastErrorMsg("更新 Prompt 发布状态失败，请稍后重试！");
        return;
      }
      toastSuccessMsg(`Prompt ${newPublishStatus === publishStatusConstants.PublishOn ? "上架" : "下架"}成功！`);
      fetchPromptData();
    } catch (error) {
      toastErrorMsg("更新 Prompt 发布状态失败，请稍后重试！");
    }
  };

  return (
    <section className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">我上架的 Prompts</h1>
        <Button as={Link} size="lg" color="primary" variant="shadow" href="/seller/goods/publish">
          发布新的 Prompt
        </Button>
      </div>
      <Divider />

      <div className="flex">
        <h2 className="text-lg">模型：</h2>
        <RadioGroup
          className="mt-[2px]"
          orientation="horizontal"
          value={modelSelected}
          onValueChange={setModelSelected}
        >
          <Radio key="all" value="all">
            All
          </Radio>
          {modelList.map((model) => (
            <Radio key={model.id} value={model.name}>
              {model.name}
            </Radio>
          ))}
        </RadioGroup>
      </div>
      <div className="flex">
        <span>发布状态：</span>
        <CheckboxGroup orientation="horizontal" color="primary" value={publishStatus} onValueChange={setPublishStatus}>
          {publishStatusOptions.map((option) => (
            <Checkbox value={option.type} key={option.type}>
              {option.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      <div className="flex">
        <span>审核状态：</span>
        <CheckboxGroup orientation="horizontal" color="primary" value={auditStatus} onValueChange={setAuditStatus}>
          {auditStatusOptions.map((option) => (
            <Checkbox value={option.type} key={option.type}>
              {option.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      {promptList.length > 0 ? (
        <>
          <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 mt-2">
            {promptList?.map((prompt) => (
              <Dropdown key={prompt.id}>
                <DropdownTrigger>
                  <Card key={prompt.id} isPressable isHoverable shadow="sm">
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
                          <div className="flex justify-between">
                            <Chip color={auditStatusColorMap[prompt.audit_status]} size="sm" variant="flat">
                              {
                                auditStatusOptions.find((option) => parseInt(option.type) === prompt.audit_status)
                                  ?.label
                              }
                            </Chip>
                            <Chip color={publishStatusColorMap[prompt.publish_status]} size="sm" variant="dot">
                              {
                                publishStatusOptions.find((option) => parseInt(option.type) === prompt.publish_status)
                                  ?.label
                              }
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter className="justify-between">
                      <b>{prompt.title}</b>
                      <p className="text-default-500 text-lg">￥{prompt.price.toFixed(2)}</p>
                    </CardFooter>
                  </Card>
                </DropdownTrigger>
                <DropdownMenu variant="flat" aria-label="Dropdown menu with icons">
                  <DropdownItem
                    key="view"
                    startContent={<HiEye className="text-xl text-default-500 pointer-events-none flex-shrink-0" />}
                    onClick={(e) => {
                      window.open(`/market/${prompt.id}`, "_blank");
                    }}
                  >
                    查看
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onClick={(e) => {
                      toastInfoMsg("Sorry，我正努力实现中 ......");
                    }}
                    startContent={
                      <HiPencilAlt className="text-xl text-default-500 pointer-events-none flex-shrink-0" />
                    }
                  >
                    编辑
                  </DropdownItem>
                  <DropdownItem
                    key="publish"
                    onClick={() => {
                      handlePublishStatusChange(prompt.id, prompt.publish_status);
                    }}
                    startContent={
                      <HiTrash
                        className={cn(
                          "text-xl pointer-events-none flex-shrink-0",
                          `${
                            prompt.publish_status === publishStatusConstants.PublishOn
                              ? "text-red-500"
                              : "text-green-500"
                          }`,
                        )}
                      />
                    }
                    className={`${
                      prompt.publish_status === publishStatusConstants.PublishOn ? "text-red-500" : "text-green-500"
                    }`}
                    color={`${prompt.publish_status === publishStatusConstants.PublishOn ? "danger" : "success"}`}
                  >
                    {`${prompt.publish_status === publishStatusConstants.PublishOn ? "下架" : "上架"}`}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ))}
          </div>
        </>
      ) : (
        <div className="h-80">
          <Lottie animationData={ghostMoveAnimation} className="h-64" />
          <span className="text-default-400 text-medium self-center">您还未上架任何 Prompt，赶紧去上架一个吧！</span>
        </div>
      )}
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
    </section>
  );
}

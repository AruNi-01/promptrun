"use client";
import { findModelList } from "@/api/model";
import { findPromptList, findPromptMasterImgListByPromptIds } from "@/api/prompt";
import { ChevronDownIcon } from "@/components/icons";
import { CustomCheckbox } from "@/components/market-page/CustomCheckBox";
import { Model } from "@/types/api/model";
import { Paginate } from "@/types/api/paginate";
import { Prompt } from "@/types/api/prompt";
import { PromptImg } from "@/types/api/prompt_img";
import { auditStatusOptions, categoryOptions, publishStatusOptions, sortByOptions } from "@/utils/constant";
import { toastErrorMsg } from "@/utils/messageToast";
import { Rating } from "@material-tailwind/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CheckboxGroup,
  Chip,
  ChipProps,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const auditStatusColorMap: Record<string, ChipProps["color"]> = {
  2: "success",
  0: "danger",
  1: "primary",
};

const publishStatusColorMap: Record<string, ChipProps["color"]> = {
  0: "default",
  1: "success",
};

export default function SellerGoodsPage() {
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [promptMasterImgList, setPromptMasterImgList] = useState<PromptImg[]>([]);
  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 12,
  });
  const [rows, setRows] = useState<number>(0);

  const [modelList, setModelList] = useState<Model[]>([]);
  const [modelSelected, setModelSelected] = useState<string>("all");

  const [publishStatus, setPublishStatus] = useState<Selection>(new Set([]));
  const [auditStatus, setAuditStatus] = useState<Selection>(new Set([]));

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
  }, [JSON.stringify(paginate), publishStatus, auditStatus, modelSelected]);

  const fetchPromptData = async () => {
    try {
      // fetch prompt list
      var rsp = await findPromptList({
        paginate: paginate,

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

  return (
    <section className="flex flex-col gap-5 overflow-hidden">
      <h1 className="text-3xl self-start">我上架的 Prompts</h1>
      <Divider />

      <div className="flex justify-between">
        <div className="flex gap-1">
          <h2 className="text-lg">模型：</h2>
          <RadioGroup orientation="horizontal" value={modelSelected} onValueChange={setModelSelected}>
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
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} size="md" variant="flat">
                发布状态
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              closeOnSelect={false}
              selectedKeys={publishStatus}
              selectionMode="multiple"
              onSelectionChange={setPublishStatus}
            >
              {publishStatusOptions.map((option) => (
                <DropdownItem key={option.type} className="capitalize">
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} size="md" variant="flat">
                审核状态
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              closeOnSelect={false}
              selectedKeys={auditStatus}
              selectionMode="multiple"
              onSelectionChange={setAuditStatus}
            >
              {auditStatusOptions.map((option) => (
                <DropdownItem key={option.type} className="capitalize">
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
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
                  <div className="flex justify-between">
                    <Chip color={auditStatusColorMap[prompt.audit_status]} size="sm" variant="dot">
                      {auditStatusOptions.find((option) => option.type === prompt.audit_status)?.label}
                    </Chip>
                    <Chip color={publishStatusColorMap[prompt.publish_status]} size="sm" variant="dot">
                      {publishStatusOptions.find((option) => option.type === prompt.publish_status)?.label}
                    </Chip>
                  </div>
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
    </section>
  );
}

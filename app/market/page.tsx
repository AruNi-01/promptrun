"use client";
import { findModelList } from "@/_api/model";
import { findPromptList, findPromptMasterImgListByPromptIds } from "@/_api/prompt";
import { CustomCheckbox } from "@/components/market-page/CustomCheckBox";
import { Model } from "@/types/_api/model";
import { Paginate } from "@/types/_api/paginate";
import { Prompt } from "@/types/_api/prompt";
import { PromptImg } from "@/types/_api/prompt_img";
import { auditStatus, categoryOptions, publishStatus, sortByOptions, SortByOptionsEnum } from "@/utils/constant";
import { toastErrorMsg } from "@/utils/messageToast";
import { Rating } from "@material-tailwind/react";
import {
  Card,
  CardBody,
  CardFooter,
  CheckboxGroup,
  Chip,
  Divider,
  Image,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MarketPage() {
  const router = useRouter();

  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [promptMasterImgList, setPromptMasterImgList] = useState<PromptImg[]>([]);
  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 12,
  });
  const [rows, setRows] = useState<number>(0);

  const [modelList, setModelList] = useState<Model[]>([]);
  const [modelSelected, setModelSelected] = useState<string>("all");
  const [categorySelected, setCategorySelected] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>(SortByOptionsEnum.Hot);

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

  // TODO: Bug —— 页面初始渲染时请求了一次，modelList 变化后页面重新渲染又请求了一次。其他地方也有类似的 Bug
  useEffect(() => {
    fetchPromptData();

    // 注意：React 默认通过比较对象的引用来判断是否发生变化，而对象每次重新渲染后引用都会改变。
    // 所以对象的比较需要通过 JSON.stringify 转换为字符串再比较，否则会导致死循环。
  }, [JSON.stringify(paginate), categorySelected, sortBy, modelSelected]);

  const fetchPromptData = async () => {
    try {
      // fetch prompt list
      var rsp = await findPromptList({
        paginate: paginate,
        publishStatus: [publishStatus.PublishOn],
        AuditStatus: [auditStatus.AuditPass],
        sortBy: sortBy,
        categoryTypes: categorySelected.length === 0 ? undefined : categorySelected,
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
    <section className="flex flex-col gap-5 w-4/6 mt-8 overflow-hidden">
      <title>Prompt 商店 | PromptRun</title>
      <h1 className="text-4xl self-start">所有 Prompts</h1>
      <Divider />
      <div className="flex justify-between">
        <div className="flex gap-1">
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
        <Select
          label="排行方式"
          disallowEmptySelection
          defaultSelectedKeys={[SortByOptionsEnum.Hot]}
          className="max-w-[120px] h-8"
          onChange={(e) => {
            setSortBy(e.target.value);
          }}
        >
          {sortByOptions.map((option) => (
            <SelectItem key={option.key} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex gap-1">
        <h2 className="text-lg">分类：</h2>
        <CheckboxGroup
          className="gap-1"
          orientation="horizontal"
          // 选中的分类，需要根据选中的 type 去匹配 value
          value={categoryOptions
            .filter((category) => categorySelected.includes(category.type))
            .map((category) => category.value)}
          // 设置选中的分类，需要根据选中的 value 去匹配 type
          onValueChange={(selectedValues) => {
            setCategorySelected(
              categoryOptions
                .filter((category) => selectedValues.includes(category.value))
                .map((category) => category.type),
            );
          }}
        >
          {categoryOptions.map((category) => (
            <CustomCheckbox key={category.type} value={category.value}>
              {category.label}
            </CustomCheckbox>
          ))}
        </CheckboxGroup>
      </div>
      <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 mt-2">
        {promptList?.map((prompt) => (
          <Card
            key={prompt.id}
            isPressable
            isHoverable
            shadow="sm"
            as={Link}
            href={`/market/${prompt.id}`}
            target="_blank"
          >
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
              <p className="text-default-500 text-lg">￥{prompt.price.toFixed(2)}</p>
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

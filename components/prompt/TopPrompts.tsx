import { Card, CardBody, CardFooter, Chip, cn, Image, Pagination } from "@nextui-org/react";
import Link from "next/link";
import { Rating } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Prompt } from "@/types/api/prompt";
import { PromptImg } from "@/types/api/prompt_img";
import { Paginate } from "@/types/api/paginate";
import { Model } from "@/types/api/model";
import { findModelList } from "@/api/model";
import { toastErrorMsg } from "@/utils/messageToast";
import { findPromptList, findPromptMasterImgListByPromptIds } from "@/api/prompt";
import { auditStatus, publishStatus } from "@/utils/constant";

export default function TopPrompts({
  sortBy,
  limit,
  className,
}: {
  sortBy: string;
  limit: number;
  className?: string;
}) {
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [promptMasterImgList, setPromptMasterImgList] = useState<PromptImg[]>([]);
  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 4,
  });
  const [rows, setRows] = useState<number>(0);

  const [modelList, setModelList] = useState<Model[]>([]);
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
  }, [JSON.stringify(paginate), sortBy]);

  const fetchPromptData = async () => {
    try {
      // fetch prompt list
      var rsp = await findPromptList({
        paginate: paginate,
        publishStatus: [publishStatus.PublishOn],
        AuditStatus: [auditStatus.AuditPass],
        sortBy: sortBy,
        limit: limit,
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
    <section className={cn("flex flex-col gap-1 overflow-hidden", className)}>
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
        <span className="text-default-400 text-medium">Top {rows} Prompts</span>
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

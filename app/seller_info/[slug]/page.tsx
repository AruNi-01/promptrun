"use client";
import { findModelList } from "@/api/model";
import { findPromptListBySellerId, findPromptMasterImgListByPromptIds } from "@/api/prompt";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Model } from "@/types/api/model";
import { Paginate } from "@/types/api/paginate";
import { Prompt } from "@/types/api/prompt";
import { PromptImg } from "@/types/api/prompt_img";
import { toastErrorMsg } from "@/utils/messageToast";
import { Rating } from "@material-tailwind/react";
import { Card, CardBody, CardFooter, Chip, Divider, Pagination, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function SellerDetailPage({ params }: { params: { slug: number } }) {
  const { slug: sellerId } = params;

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
  }, [JSON.stringify(paginate), sellerId]);

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
      var rsp = await findPromptListBySellerId({
        paginate: paginate,
        sellerId: Number(sellerId),
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
    <section className="flex flex-col gap-3 w-4/6 items-start mt-5">
      {/* TODO: 卖家头部 Banner */}

      <div key="bought_prompts" className="flex flex-col gap-5 mt-10">
        <div className="flex justify-between">
          <h2 className="text-4xl">上架的 Prompts</h2>
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
    </section>
  );
}

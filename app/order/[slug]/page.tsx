"use client";
import { findModelById } from "@/api/model";
import { findOrderListAttachPromptDetailById, orderRatingById } from "@/api/order";
import { findSellerById } from "@/api/seller";
import { findUserById } from "@/api/user";
import AnimateLink from "@/components/ui/AnimateLink";
import loadingIcon2 from "@/public/lottie/loading2.json";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Model } from "@/types/api/model";
import { Order } from "@/types/api/order";
import { Prompt } from "@/types/api/prompt";
import { PromptDetail } from "@/types/api/prompt_detail";
import { Seller } from "@/types/api/seller";
import { User } from "@/types/api/user";
import { checkIsLogin, formatStringDate } from "@/utils/common";
import { categoryTypeMap } from "@/utils/constant";
import { toastErrorMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Avatar, Rating, Typography } from "@material-tailwind/react";
import { Button } from "@nextui-org/button";
import { Chip, Divider, Link, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiCube, HiShieldCheck, HiTag, HiCheck } from "react-icons/hi";

export default function OrderPage({ params }: { params: { slug: bigint } }) {
  const { slug: orderId } = params;
  const router = useRouter();

  const { removeLoginUser } = useLoginUserStore();

  const [order, setOrder] = useState<Order>();
  const [prompt, setPrompt] = useState<Prompt>();
  const [promptDetail, setPromptDetail] = useState<PromptDetail>();
  const [seller, setSeller] = useState<Seller>();
  const [sellerUserInfo, setSellerUserInfo] = useState<User>();

  useEffect(() => {
    findOrderListAttachPromptDetailById(orderId)
      .then((res) => {
        if (!checkIsLogin(res.errCode)) {
          removeLoginUser();
          router.push("/");
          toastErrorMsg("您的登录状态已失效，请先登录后再查看订单详情！");
          return;
        }
        if (res.errCode !== 0) {
          toastErrorMsg("获取订单、提示器内容失败，请稍后刷新重试！");
          return;
        }
        setOrder(res.data.order);
        setPrompt(res.data.prompt);
        setPromptDetail(res.data.promptDetail);
      })
      .catch(() => {
        toastErrorMsg("获取订单、提示器内容失败，请稍后刷新重试！");
      });
  }, [orderId]);

  const [model, setModel] = useState<Model>();

  useEffect(() => {
    if (prompt && !model) {
      findModelById(prompt.model_id)
        .then((res) => {
          if (res.errCode !== 0) {
            toastErrorMsg("获取模型信息失败，请稍后刷新重试！");
            return;
          }
          setModel(res.data);
        })
        .catch(() => {
          toastErrorMsg("获取模型信息失败，请稍后刷新重试！");
        });
    }

    if (order && !seller) {
      findSellerById(order.seller_id)
        .then((res) => {
          if (res.errCode !== 0) {
            toastErrorMsg("获取卖家信息失败，请稍后刷新重试！");
            return;
          }
          setSeller(res.data);
        })
        .catch(() => {
          toastErrorMsg("获取卖家信息失败，请稍后刷新重试！");
        });
    }

    if (seller && !sellerUserInfo) {
      findUserById(seller.user_id)
        .then((res) => {
          if (res.errCode !== 0) {
            toastErrorMsg("获取卖家用户信息失败，请稍后刷新重试！");
            return;
          }
          setSellerUserInfo(res.data);
        })
        .catch(() => {
          toastErrorMsg("获取卖家用户信息失败，请稍后刷新重试！");
        });
    }
  }, [JSON.stringify(order), JSON.stringify(seller), JSON.stringify(prompt)]);

  const [rating, setRating] = useState<number>(0);
  const handleRating = () => {
    orderRatingById({ orderId, rating }).then((res) => {
      if (!checkIsLogin(res.errCode)) {
        removeLoginUser();
        router.push("/");
        toastErrorMsg("您的登录状态已失效，请先登录后再评分！");
        return;
      }
      if (res.errCode !== 0) {
        toastErrorMsg("评分失败，请稍后重试！");
        return;
      }
      setOrder(res.data);
      toastSuccessMsg("评分成功，感谢您的评分！");
    });
  };

  if (!order || !prompt || !promptDetail) {
    return (
      <div>
        <Lottie animationData={loadingIcon2} className="h-48 items-center" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-14 w-4/6 mt-8">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">订单详情</h1>
        <Divider />
        <div className="grid grid-cols-3 gap-5 border-1 rounded-xl border-slate-800 p-3 bg-slate-800/50 shadow-slate-900 shadow-md">
          <div className="flex flex-col gap-1 items-center">
            <h2 className="text-xl text-default-500">订单号</h2>
            <p>{order?.id}</p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <h2 className="text-xl text-default-500">价格</h2>
            <p>￥{order?.price}</p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <h2 className="text-xl text-default-500">下单时间</h2>
            <p>{formatStringDate(order?.create_time)}</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl text-default-500">卖家信息</h2>
            <Tooltip placement="bottom-start" showArrow content="点击查看卖家信息">
              <Link className="flex gap-4 items-center" href={`/seller_info/${seller?.id}`} target="_blank">
                <Avatar
                  size="sm"
                  variant="circular"
                  alt="avatar"
                  className="border-2 border-default-600"
                  src={sellerUserInfo?.header_url}
                />
                <Typography variant="h5" color="white">
                  {sellerUserInfo?.nickname}
                </Typography>
              </Link>
            </Tooltip>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl text-default-500">我的评分</h2>
            {order.is_rating ? (
              <div className="flex gap-2 text-white/80">
                <p>{order?.rating}.0</p>
                <Rating
                  value={
                    // 四舍五入计算评分
                    Math.round(order?.rating)
                  }
                  readonly
                  ratedColor="blue"
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <p>暂未评分</p>
                <Popover showArrow placement="bottom">
                  <PopoverTrigger>
                    <Chip color="danger" size="sm" variant="shadow" as={Button}>
                      点击评分
                    </Chip>
                  </PopoverTrigger>
                  <PopoverContent className="p-2">
                    <div className="flex gap-2 items-center">
                      <p className={`font-medium text-lg ${rating <= 2 ? "text-red-500" : ""}`}>{rating}.0</p>
                      <Rating value={rating} onChange={(value) => setRating(value)} ratedColor="blue" />
                      <Button color="primary" size="sm" variant="ghost" isIconOnly onClick={handleRating}>
                        <HiCheck className="w-6 h-6" />
                      </Button>
                    </div>
                    <p className="text-default-500 mt-3">注：评分后将无法修改，评分对卖家很重要，请谨慎操作哦！</p>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">Prompt 内容</h1>
        <Divider />
        <div className="grid grid-cols-3 gap-5 border-1 rounded-xl border-slate-800 p-3 bg-slate-800/50 shadow-slate-900 shadow-md">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl text-default-500">Prompt 标题</h2>
            <Link href={`/market/${prompt?.id}`} color="primary" isBlock isExternal>
              {prompt?.title}
            </Link>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl text-default-500">Prompt 信息</h2>
            <div className="flex gap-2">
              <Tooltip placement="bottom" showArrow content="模型">
                <Chip
                  variant="flat"
                  color="warning"
                  size="sm"
                  radius="full"
                  startContent={<HiCube />}
                  className="cursor-pointer"
                >
                  {model?.name}
                </Chip>
              </Tooltip>
              <Tooltip placement="bottom" showArrow content="分类">
                <Chip
                  variant="flat"
                  color="secondary"
                  size="sm"
                  radius="full"
                  startContent={<HiTag />}
                  className="cursor-pointer"
                >
                  {categoryTypeMap.get(prompt.category_type)}
                </Chip>
              </Tooltip>
              <Tooltip placement="bottom" showArrow content="已通过官方审核">
                <Chip
                  variant="flat"
                  color="success"
                  size="sm"
                  radius="full"
                  endContent={<HiShieldCheck />}
                  className="cursor-pointer"
                >
                  官方审核
                </Chip>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl text-default-500">Prompt 介绍</h2>
            <p className="text-start">{prompt?.intro}</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl text-default-500">Prompt 内容</h2>
            <p className=" text-start">{promptDetail.content}</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl text-default-500">使用建议</h2>
            <p className=" text-start">{promptDetail.use_suggestion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

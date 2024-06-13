"use client";
import { isLike, like, LikeErrCode } from "@/_api/likes";
import { balancePay, lantuWxPay, lantuWxPayQueryOrder } from "@/_api/pay";
import { findPromptFullInfoById } from "@/_api/prompt";
import { AliPayIcon, WechatPayIcon } from "@/components/icons";
import loadingIcon2 from "@/public/lottie/loading2.json";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { LantuWxPayRsp } from "@/types/_api/pay";
import { PromptFullInfo } from "@/types/_api/prompt";
import { checkIsLogin, formatStringDate } from "@/utils/common";
import { categoryTypeMap, modelMediaType, SortByOptionsEnum } from "@/utils/constant";
import { toastErrorMsg, toastInfoMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Avatar, Card, CardBody, CardHeader, Carousel, Rating, Typography } from "@material-tailwind/react";
import { Button } from "@nextui-org/button";
import {
  Chip,
  cn,
  Divider,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  HiBell,
  HiCube,
  HiCurrencyYen,
  HiEye,
  HiHeart,
  HiOutlineTrendingUp,
  HiShieldCheck,
  HiTag,
} from "react-icons/hi";
import Markdown from "react-markdown";
import { findWaletByUserId } from "@/_api/wallet";
import { Wallet } from "@/types/_api/wallet";
import TopPrompts from "@/components/prompt/TopPrompts";
import { isRepeatPurchase } from "@/_api/order";

export default function PromptDetailPage({ params }: { params: { slug: number } }) {
  const { slug: promptId } = params;
  const { loginUser, removeLoginUser } = useLoginUserStore();
  const router = useRouter();

  const [promptFullInfo, setPromptFullInfo] = useState<PromptFullInfo | null>(null);
  const [likeState, setLikeState] = useState<boolean>();
  const [likeAmount, setLikeAmount] = useState<number>(0);

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();

  useEffect(() => {
    findPromptFullInfoById(promptId)
      .then((res) => {
        if (res.errCode !== 0) {
          toastErrorMsg("获取 Prompt 详情失败，请稍后刷新重试！");
        } else {
          setPromptFullInfo(res.data);
          setLikeAmount(res.data.prompt.like_amount);
        }
      })
      .catch(() => {
        toastErrorMsg("服务器开了会儿小差，请稍后重试！");
      });

    if (!loginUser) {
      setLikeState(false);
    } else {
      isLike({ promptId, userId: loginUser.id })
        .then((res) => {
          if (res.errCode !== 0) {
            toastErrorMsg("获取 Prompt 点赞状态失败，请稍后刷新重试！");
          } else {
            setLikeState(res.data);
          }
        })
        .catch(() => {
          toastErrorMsg("服务器开了会儿小差，请稍后重试！");
        });
    }
  }, [JSON.stringify(loginUser)]);

  const handleClickLike = async () => {
    if (!loginUser) {
      toastErrorMsg("请先登录后再点赞！");
      return;
    }

    like({ promptId: Number(promptId), userId: loginUser.id, sellerId: promptFullInfo?.seller.id || 0 })
      .then((res) => {
        if (!checkIsLogin(res.errCode)) {
          removeLoginUser();
          router.refresh();
          toastErrorMsg("请先登录后再点赞！");
          return;
        }
        if (res.errCode === LikeErrCode.LikeIntervalTooShort) {
          toastInfoMsg("您点赞太频繁了，休息会儿再试试吧！");
        } else if (res.errCode !== 0) {
          toastErrorMsg("点赞或取消点赞失败，请稍后重试！");
        } else {
          setLikeAmount((prev) => (likeState ? prev - 1 : prev + 1));
          setLikeState(!likeState);
        }
      })
      .catch(() => {
        toastErrorMsg("服务器开了会儿小差，请稍后重试！");
      });
  };

  const [lantuPayRsp, setLantuPayRsp] = useState<LantuWxPayRsp>();
  const [loading, setLoading] = useState<boolean>(false);

  const [payInterval, setPayInterval] = useState<NodeJS.Timeout>();

  const [wallet, setWallet] = useState<Wallet>();

  const checkIsRepeatPurchase = async (buyerId: number, promptId: number): Promise<boolean> => {
    try {
      const res = await isRepeatPurchase({ promptId, buyerId });
      if (res.errCode !== 0) {
        toastErrorMsg("检查是否重复购买失败，请稍后刷新重试！");
        return true;
      } else if (res.data) {
        toastInfoMsg("您已购买过该 Prompt，无需重复购买！");
        return true;
      }
    } catch {
      toastErrorMsg("服务器开了会儿小差，请稍后重试！");
      return true;
    }
    return false;
  };

  const handlePurchase = async () => {
    if (!loginUser || !promptFullInfo) {
      toastErrorMsg("您未登录，请先登录后再购买！");
      return;
    }

    if (loginUser.id === promptFullInfo.sellerUser.id) {
      toastInfoMsg("请勿购买自己的 Prompt！");
      return;
    }

    const isRepeat = await checkIsRepeatPurchase(loginUser.id, promptFullInfo.prompt.id);
    if (isRepeat) {
      return;
    }

    setLoading(true);

    findWaletByUserId(loginUser?.id)
      .then((res) => {
        if (res.errCode !== 0) {
          toastErrorMsg("获取用户钱包失败，请稍后刷新重试！");
          return;
        }
        setWallet(res.data);
      })
      .catch(() => {
        toastErrorMsg("服务器开了会儿小差，请稍后重试！");
      });

    lantuWxPay({
      promptId: promptFullInfo?.prompt.id,
      promptTitle: promptFullInfo?.prompt.title,
      sellerId: promptFullInfo?.seller.id,
      sellerUserId: promptFullInfo?.seller.user_id,
      buyerId: loginUser.id,
      price: promptFullInfo?.prompt.price,
    })
      .then((res) => {
        if (!checkIsLogin(res.errCode)) {
          removeLoginUser();
          router.refresh();
          toastErrorMsg("您未登录，或登录状态已失效，请登录后再操作！");
          return;
        }
        if (res.errCode !== 0) {
          toastErrorMsg("获取支付二维码失败，请稍后重试！");
        } else {
          setLantuPayRsp(res.data);
          onModalOpen();
        }
      })
      .catch(() => {
        toastErrorMsg("服务器开了会儿小差，请稍后重试！");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loopPayResult = useCallback(() => {
    if (payInterval) return;

    if (lantuPayRsp?.orderId) {
      const intervalId = setInterval(() => {
        lantuWxPayQueryOrder({ orderId: lantuPayRsp?.orderId })
          .then((res) => {
            if (res.errCode === 0) {
              if (res.data.isPay) {
                clearInterval(intervalId);
                setPayInterval(undefined);
                toastSuccessMsg("支付成功，即将跳转到订单页面！");
                setTimeout(() => {
                  router.push(`/order/${res.data.orderId}`);
                }, 2000);
              }
            } else {
              // 处理支付失败情况
            }
          })
          .catch(() => {
            toastErrorMsg("服务器开了会儿小差，请稍后重试！");
          });
      }, 6000);

      setPayInterval(intervalId);
    }
  }, [JSON.stringify(lantuPayRsp)]);

  useEffect(() => {
    if (!lantuPayRsp) return;

    loopPayResult();

    return () => {
      if (payInterval) {
        clearInterval(payInterval);
        setPayInterval(undefined);
      }
    };
  }, [JSON.stringify(lantuPayRsp)]);

  useEffect(() => {
    setTimeout(
      () => {
        clearInterval(payInterval);
        setPayInterval(undefined);
      },
      1000 * 60 * 2,
    );
  }, [JSON.stringify(payInterval)]);

  const handleBalancePay = () => {
    if (!loginUser || !promptFullInfo || !wallet) {
      toastErrorMsg("您未登录，请先登录后再购买！");
      return;
    }

    if (wallet?.balance < promptFullInfo.prompt.price) {
      toastInfoMsg("您的余额不足，请切换到微信支付购买！");
      return;
    }

    setLoading(true);

    balancePay({
      promptId: promptFullInfo?.prompt.id,
      promptTitle: promptFullInfo?.prompt.title,
      sellerId: promptFullInfo?.seller.id,
      sellerUserId: promptFullInfo?.seller.user_id,
      buyerId: loginUser.id,
      price: promptFullInfo?.prompt.price,
      wallet: wallet,
    })
      .then((res) => {
        if (!checkIsLogin(res.errCode)) {
          removeLoginUser();
          router.refresh();
          toastErrorMsg("您未登录，或登录状态已失效，请登录后再操作！");
          return;
        }
        if (res.errCode !== 0) {
          toastErrorMsg("余额支付失败，请稍后重试或切换到微信支付！");
        } else {
          toastSuccessMsg("支付成功，即将跳转到订单页面！");
          clearInterval(payInterval);
          setPayInterval(undefined);
          setTimeout(() => {
            router.push(`/order/${res.data.orderId}`);
          }, 2000);
        }
      })
      .catch(() => {
        toastErrorMsg("服务器开了会儿小差，请稍后重试！");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!promptFullInfo) {
    return (
      <div>
        <Lottie animationData={loadingIcon2} className="h-48 items-center" />
      </div>
    );
  }

  return (
    <section className="mt-4 flex w-4/6 flex-col gap-5">
      <title>Prompt 详情 | PromptRun</title>
      <Card
        shadow={false}
        className="relative grid w-full items-end justify-center overflow-hidden text-center h-[20rem]"
      >
        <CardHeader
          floated={false}
          shadow={false}
          className={cn("absolute bg-black inset-0 m-0 h-full w-full rounded-none")}
        >
          <Image className="h-full w-full" src={promptFullInfo?.promptImgList.find((img) => img.is_master)?.img_url} />
        </CardHeader>
        <CardBody className="relative z-10 my-auto">
          <div className="z-10 flex flex-col gap-3 rounded-xl bg-black bg-opacity-50 p-5 backdrop-blur-sm">
            <Tooltip placement="top-start" showArrow content="点击查看卖家信息">
              <Link
                className="flex items-center gap-4"
                href={`/seller_info/${promptFullInfo.seller.id}`}
                target="_blank"
              >
                <Avatar
                  size="lg"
                  variant="circular"
                  alt="avatar"
                  className="border-2 border-default-600"
                  src={promptFullInfo?.sellerUser.header_url}
                />
                <Typography variant="h5" color="white">
                  {promptFullInfo?.sellerUser.nickname}
                </Typography>
              </Link>
            </Tooltip>
            <div className="flex items-center gap-2 text-white/80">
              <p>{promptFullInfo?.seller.rating.toFixed(1)}</p>
              <Rating
                value={
                  // 四舍五入计算评分
                  Math.round(promptFullInfo?.seller.rating)
                }
                readonly
                ratedColor="blue"
              />
            </div>
            <Typography
              variant="h6"
              className="whitespace-normal text-start font-medium text-gray-300 w-[300px] leading-[1.5]"
            >
              {promptFullInfo?.seller.intro}
            </Typography>
          </div>
        </CardBody>
      </Card>
      <div className="flex gap-4 h-[400px]">
        {promptFullInfo.model.media_type === modelMediaType.Image ? (
          <Carousel
            autoplay
            autoplayDelay={7000}
            loop
            className="h-auto w-2/3 rounded-xl"
            navigation={({ setActiveIndex, activeIndex, length }) => (
              <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                {new Array(length).fill("").map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                      activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                    }`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}
          >
            {promptFullInfo?.promptImgList.map((img) => (
              <img key={img.id} src={img.img_url} className="h-full w-full object-cover" />
            ))}
          </Carousel>
        ) : promptFullInfo.model.media_type === modelMediaType.Text ? (
          <div className="flex w-2/3 flex-col items-start gap-3 overflow-y-scroll rounded-xl border-slate-800 bg-slate-800/50 p-4 text-start shadow-md shadow-slate-900 border-1">
            <h1 className="-mb-1 text-3xl">Prompt 效果细节</h1>
            <Divider />
            <h2 className="text-2xl">输入样例：</h2>
            <p className="text-gray-400 text-medium">
              <Markdown>{promptFullInfo.prompt.input_example}</Markdown>
            </p>
            <h2 className="text-2xl">输出样例：</h2>
            <p className="text-gray-400 text-medium">
              <Markdown>{promptFullInfo.prompt.output_example}</Markdown>
            </p>
          </div>
        ) : (
          <div className="flex h-full w-2/3 items-center justify-center">
            <Typography variant="h1" className="text-gray-300">
              暂不支持该模型展示......
            </Typography>
          </div>
        )}
        <div className="flex w-1/3 flex-col items-start gap-3">
          <Typography variant="h1">{promptFullInfo.prompt.title}</Typography>
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white/80">
                <p>{promptFullInfo?.prompt.rating.toFixed(1)}</p>
                <Rating
                  value={
                    // 四舍五入计算评分
                    Math.round(promptFullInfo?.prompt.rating)
                  }
                  readonly
                  ratedColor="blue"
                />
              </div>
              <div className="flex gap-2">
                <Chip variant="flat" color="warning" size="sm" radius="full" startContent={<HiCube />}>
                  {promptFullInfo.model.name}
                </Chip>
                <Chip variant="flat" color="secondary" size="sm" radius="full" startContent={<HiTag />}>
                  {categoryTypeMap.get(promptFullInfo.prompt.category_type)}
                </Chip>
                <Tooltip placement="top" showArrow content="该 Prompt 已通过官方审核，请放心购买">
                  <Chip
                    variant="flat"
                    color="success"
                    size="sm"
                    radius="full"
                    endContent={<HiShieldCheck />}
                    className="cursor-pointer"
                  >
                    官审
                  </Chip>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-2">
              <div className="flex justify-end gap-2">
                <Chip variant="flat" color="default" size="sm" radius="sm" startContent={<HiEye />}>
                  {promptFullInfo.prompt.browse_amount}
                </Chip>
                <Tooltip placement="top" showArrow content={"Prompt 销售量"} color={"default"} size="sm">
                  <Chip
                    variant="flat"
                    color={"default"}
                    size="sm"
                    radius="sm"
                    startContent={<HiOutlineTrendingUp />}
                    className="cursor-pointer"
                  >
                    {promptFullInfo.prompt.sell_amount}
                  </Chip>
                </Tooltip>
                <Tooltip
                  placement="top"
                  showArrow
                  content={`${likeState ? "已经喜欢了哦" : "喜欢一下吧"}`}
                  color={`${likeState ? "default" : "danger"}`}
                  size="sm"
                >
                  <Link onClick={handleClickLike} className="cursor-pointer">
                    <Chip
                      variant="flat"
                      color={`${likeState ? "danger" : "default"}`}
                      size="sm"
                      radius="sm"
                      startContent={<HiHeart />}
                    >
                      {likeAmount}
                    </Chip>
                  </Link>
                </Tooltip>
              </div>
              <Typography variant="paragraph" className="text-right">
                发布于 {formatStringDate(promptFullInfo.prompt.create_time).split(" ")[0]}
              </Typography>
            </div>
          </div>
          <Divider />
          <Typography variant="paragraph" className="text-start">
            {promptFullInfo.prompt.intro}
          </Typography>
          <div className="flex mt-4">
            <Typography variant="paragraph" className="mb-1 self-end">
              ￥
            </Typography>
            <Typography variant="h2">{promptFullInfo.prompt.price.toFixed(2)}</Typography>
          </div>
          <Tooltip placement="right-end" showArrow content="请确保您有该模型的访问权，否则无法使用">
            <Button
              onClick={() => {
                handlePurchase();
              }}
              isLoading={loading}
              color="primary"
              variant="ghost"
              className="h-16 w-44 text-xl"
            >
              购买 Prompt
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col mt-5">
        <p className="text-2xl cursor-default text-default-600 self-start">最热 Prompts</p>
        <Divider className="mb-2 mt-1" />
        <TopPrompts sortBy={SortByOptionsEnum.Hot} limit={8} />
      </div>
      <div className="flex flex-col">
        <p className="text-2xl cursor-default text-default-600 self-start">最新 Prompts</p>
        <Divider className="mb-2 mt-1" />
        <TopPrompts sortBy={SortByOptionsEnum.Time} limit={8} />
      </div>

      <Modal
        size="2xl"
        isDismissable={false}
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        onClose={() => {
          if (payInterval) {
            clearInterval(payInterval);
            setPayInterval(undefined);
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-1 text-2xl">Prompt 名称：{promptFullInfo.prompt.title}</ModalHeader>
              <ModalBody className="flex flex-col items-start gap-3">
                <div className="text-xl">支付金额：￥{promptFullInfo.prompt.price}</div>
                <Divider />
                <div className="flex w-full flex-col">
                  <Tabs size="lg" aria-label="Options" color="default" variant="solid">
                    <Tab
                      key="wechatPay"
                      title={
                        <div className="flex items-center text-green-500 space-x-2">
                          <WechatPayIcon />
                          <span>微信支付</span>
                        </div>
                      }
                    >
                      <div className="flex flex-col items-start gap-3">
                        <Chip variant="faded" color="success" startContent={<HiBell />} className="">
                          使用手机微信描下面二维码即可进行支付!
                        </Chip>
                        <Image width="290px" src={lantuPayRsp?.qrCodeUrl} alt="wechat_pay_qr_code" />
                        <Button
                          onClick={() => {
                            handlePurchase();
                          }}
                          color="primary"
                          variant="light"
                          size="sm"
                          className="self-start"
                        >
                          二维码已失效？点击此重新生成支付二维码
                        </Button>
                      </div>
                      <Typography variant="paragraph" className="mt-3 text-sm text-default-500">
                        订单将在 2 分钟后失效，请尽快支付，失效后请点击 “重新生成支付二维码” 按钮以生成新订单。
                      </Typography>
                    </Tab>
                    <Tab
                      key="aliPay"
                      title={
                        <div className="flex items-center text-blue-500 space-x-2">
                          <AliPayIcon />
                          <span>支付宝支付</span>
                        </div>
                      }
                    >
                      <div className="flex flex-col items-start gap-3">
                        {/* <Image width="300px" src="/gallery/9.png" alt="wechat_pay_qr_code" /> */}
                        <Typography variant="paragraph" className="pt-6 text-lg text-default-500 h-[374px]">
                          支付宝支付暂不支持，请使用微信支付。
                        </Typography>
                      </div>
                      <Typography variant="paragraph" className="mt-3 text-sm text-default-500">
                        订单将在 2 分钟后失效，请尽快支付，失效后请点击 “重新生成支付二维码” 按钮以生成新订单。
                      </Typography>
                    </Tab>
                    <Tab
                      key="balancePay"
                      title={
                        <div className="flex items-center text-purple-500 space-x-2">
                          <HiCurrencyYen className="h-6 w-6" />
                          <span>余额支付</span>
                        </div>
                      }
                    >
                      <div className="flex flex-col items-start gap-3 pt-6 h-[406px]">
                        <div className="flex gap-1">
                          <span className="self-center">您的账户所剩余额：</span>
                          <Chip
                            variant={"faded"}
                            startContent={<HiCurrencyYen className="h-[18px] w-[18px]" />}
                            size={"md"}
                            color={"secondary"}
                          >
                            {wallet?.balance.toFixed(2)}
                          </Chip>
                        </div>
                        <Button
                          onClick={() => {
                            handleBalancePay();
                          }}
                          isLoading={loading}
                          color="secondary"
                          variant="ghost"
                          size="md"
                          className="mt-3 self-start"
                        >
                          立即支付
                        </Button>
                      </div>
                    </Tab>
                  </Tabs>
                  <Typography variant="paragraph" className="mt-3 text-sm text-default-500">
                    支付后请等待支付结果，成功后您将拥有此 Prompt 的访问权，可到对应大模型中使用。
                  </Typography>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

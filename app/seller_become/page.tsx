"use client";
import { userBecomeSeller } from "@/api/user";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { toastErrorMsg, toastInfoMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { Button } from "@nextui-org/button";
import { Avatar, AvatarGroup, Chip, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { HiLightningBolt } from "react-icons/hi";

export default function BecomeSellerPage() {
  const { loginUser } = useLoginUserStore();

  const [intro, setIntro] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!loginUser) {
      toastInfoMsg("请先登录后再进行操作");
      return;
    }

    userBecomeSeller({
      userId: loginUser?.id,
      nickname: loginUser?.nickname,
      email: loginUser?.email,
      intro: intro,
    })
      .then((res) => {
        if (res.errCode === 0) {
          toastSuccessMsg("申请成功，请耐心等待审核");
          setIsSubmited(true);
        } else {
          toastErrorMsg("申请失败，请稍后再试");
        }
      })
      .catch(() => toastErrorMsg("申请失败，请稍后再试"));
  };

  return (
    <section className="flex gap-20 w-4/6 mt-10 text-start">
      <title>成为卖家 | PromptRun</title>
      <div className="flex flex-col gap-7 w-1/2 items-start">
        <Card className="overflow-hidden bg-default-50">
          <CardHeader floated={false} shadow={true} color="transparent" className="m-0 rounded-xl">
            <img src="/seller_become_img.png" alt="become seller img" />
          </CardHeader>
          <CardBody>
            <Typography variant="h4" color="white">
              想在 PromptRun 上出售 Prompt？
            </Typography>
            <Typography variant="lead" className="mt-3 text-default-500 text-lg">
              在 PromptRun
              平台，我们为您提供了一个独特的机会，让您成为交易的主角之一。作为卖家，您将能够在我们的平台上自由展示和销售您的
              Prompt，以获取一笔丰富的售卖酬金。
            </Typography>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <AvatarGroup
              size="sm"
              isBordered
              max={5}
              total={99}
              renderCount={(count) => <p className="text-sm text-default-400 font-medium ms-2">{count}+ 已成为卖家</p>}
            >
              <Avatar src="https://api.multiavatar.com/Cosmo%20Blue.svg" />
              <Avatar src="https://api.multiavatar.com/Honey%20Bunny.svg" />
              <Avatar src="https://api.multiavatar.com/4da8de480e12af8724.svg" />
              <Avatar src="https://api.multiavatar.com/697006d7f418e9f956.svg" />
              <Avatar src="https://api.multiavatar.com/c30a3ef2aba2b325f3.svg" />
            </AvatarGroup>
            <Typography className="font-normal text-default-400">PromptRun</Typography>
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-col gap-7 w-1/2 items-start">
        <h1 className="text-4xl">申请成为卖家</h1>
        <Chip startContent={<HiLightningBolt />} variant="shadow" color="primary">
          仅需一步，即可在 PromptRun 上出售 Prompt
        </Chip>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-start">
          <Textarea
            isRequired
            isInvalid={intro.length < 10}
            errorMessage={intro.length < 10 ? "简介内容不得少于 10 个字符" : ""}
            minRows={5}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            isDisabled={isSubmited}
            variant="bordered"
            label="请输入您的卖家简介"
            labelPlacement="outside"
            placeholder="优质的简介可以让买家更了解您，有助于提升 Prompt 的售出！例如：您的 Prompt 调试经验、您的擅长的模型、优秀的代表作等等。"
            className="max-h-52 text-start max-w-xl"
          />
          <Button type="submit" isDisabled={isSubmited} variant="ghost" color="primary" className="w-40 h-14 text-xl">
            提交申请
          </Button>
        </form>
        <p className="text-gray-500 text-sm -mt-4">申请通过后，PromptRun 将会通过邮件告知您具体结果，请耐心等待。</p>
      </div>
    </section>
  );
}

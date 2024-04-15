"use client";
import { findModelList } from "@/api/model";
import { promptPublish } from "@/api/prompt";
import { UploadIcon } from "@/components/icons";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Model } from "@/types/api/model";
import { checkIsLogin } from "@/utils/common";
import { categoryOptions, modelMediaType } from "@/utils/constant";
import { toastErrorMsg, toastInfoMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Stepper, Step, Typography, Carousel } from "@material-tailwind/react";
import { Button, Chip, Divider, Input, Select, SelectItem, Selection, Textarea, cn } from "@nextui-org/react";
import { set } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { HiTrash, HiDocumentText, HiPencilAlt, HiChevronLeft, HiLightningBolt, HiCheckCircle } from "react-icons/hi";

export default function GoodsPublishPage() {
  const { loginUser, removeLoginUser } = useLoginUserStore();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const handleStepNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handleStepPrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const [modelList, setModelList] = useState<Model[]>([]);

  const [title, setTitle] = useState<string>("");
  const [modelSelected, setModelSelected] = useState<string>("");
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [intro, setIntro] = useState<string>("");

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

  const [modelMediaTypeSelected, setModelMediaTypeSelected] = useState<number>();
  useEffect(() => {
    const mediaType = modelList.find((model) => model.id === Number(modelSelected))?.media_type;
    setModelMediaTypeSelected(mediaType);
  }, [modelSelected]);

  const [promptContent, setPromptContent] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [useSuggestion, setUseSuggestion] = useState<string>("");
  // 文本类 Prompt
  const [inputExample, setInputExample] = useState<string>("");
  const [outputExample, setOutputExample] = useState<string>("");
  // 图片类 Prompt
  const [masterImg, setMasterImg] = useState<string>();
  const [imgList, setImgList] = useState<string[]>([]);

  const checkFormItem = (): boolean => {
    if (
      activeStep === 0 &&
      (title.length < 3 || modelSelected === "" || categorySelected === "" || intro.length < 10)
    ) {
      toastInfoMsg("请填写完整基本信息，再进行下一步操作！");
      return false;
    } else if (activeStep === 1) {
      if (modelMediaTypeSelected === modelMediaType.Text) {
        if (
          promptContent.length <= 0 ||
          useSuggestion.length <= 0 ||
          inputExample.length <= 0 ||
          outputExample.length <= 0
        ) {
          toastInfoMsg("请填写完整详细信息，再进行下一步操作！");
          return false;
        }
      } else if (modelMediaTypeSelected === modelMediaType.Image) {
        if (!masterImg) {
          toastInfoMsg("请上传 Banner 图片，再进行下一步操作！");
          return false;
        } else if (imgList.length < 2 || imgList.length > 6) {
          toastInfoMsg("请上传 2-6 张效果图，再进行下一步操作！");
          return false;
        }
      } else {
        // 视频类，暂不支持该媒体类型的 Prompt
        return false;
      }
    }
    return true;
  };

  const [submitting, setSubmitting] = useState(false);

  const handlePublish = () => {
    if (price < 0 || price >= 1000) {
      toastInfoMsg("请填写正确的出售价格再提交发布！");
      return;
    } else if (!masterImg) {
      toastInfoMsg("请上传 Banner 图片再提交发布！");
      return;
    }

    setSubmitting(true);
    promptPublish({
      userId: loginUser?.id || 0,
      promptTitle: title,
      promptModelId: Number(modelSelected),
      promptCategoryType: Number(categorySelected),
      promptIntro: intro,
      promptContent: promptContent,
      useSuggestion: useSuggestion,
      inputExample: inputExample,
      outputExample: outputExample,
      masterImgBase64: masterImg,
      imgBase64List: imgList,
      promptPrice: price,
    })
      .then((rsp) => {
        if (!checkIsLogin(rsp.errCode)) {
          toastErrorMsg("您未登录，请登录后再操作！");
          removeLoginUser();
          router.push("/");
          return;
        }
        if (rsp.errCode !== 0) {
          toastErrorMsg("发布 Prompt 失败，请稍后重试！");
          return;
        }
        toastSuccessMsg("发布 Prompt 成功，即将跳转到上架商品页面！");
        clearForm();
        setTimeout(() => {
          router.push("/seller/goods");
        }, 2000);
      })
      .catch(() => {
        toastErrorMsg("服务器开了会儿小差，请稍后重试！");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const clearForm = () => {
    setTitle("");
    setModelSelected("");
    setCategorySelected("");
    setModelMediaTypeSelected(undefined);
    setIntro("");
    setPromptContent("");
    setPrice(0);
    setUseSuggestion("");
    setInputExample("");
    setOutputExample("");
    setMasterImg("");
    setImgList([]);
  };

  const handleImgListChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (!files) return;

    const promises: Promise<string>[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      promises.push(readFileAsDataURL(file));
    }

    Promise.all(promises)
      .then((base64Images) => {
        setImgList((prevImages) => [...prevImages, ...base64Images]);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as data URL"));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <section className="flex flex-col gap-4 overflow-hidden">
      <h1 className="text-3xl">出售新的 Prompt</h1>
      <Chip variant="shadow" color="primary" startContent={<HiLightningBolt />} className="self-center">
        仅需 3 步，即可立即发布 Prompt 到交易市场
      </Chip>
      <div className="w-full px-24 py-4">
        <Stepper
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
          lineClassName="bg-default-100"
          activeLineClassName="bg-primary-400"
        >
          <Step className={activeStep >= 0 ? "!bg-primary-400" : "!bg-default-300"}>
            <HiPencilAlt className="h-6 w-6" />
            <div className="absolute -bottom-[4.5rem] w-max text-center">
              <Typography variant="h6" color={activeStep === 0 ? "blue-gray" : "gray"}>
                Step 1
              </Typography>
              <Typography color={activeStep === 0 ? "blue-gray" : "gray"} className="font-normal">
                填写基本信息
              </Typography>
            </div>
          </Step>
          <Step className={activeStep >= 1 ? "!bg-primary-400" : "!bg-default-300"}>
            <HiDocumentText className="h-6 w-6" />
            <div className="absolute -bottom-[4.5rem] w-max text-center">
              <Typography variant="h6" color={activeStep === 1 ? "blue-gray" : "gray"}>
                Step 2
              </Typography>
              <Typography color={activeStep === 1 ? "blue-gray" : "gray"} className="font-normal">
                填写详细信息
              </Typography>
            </div>
          </Step>
          <Step className={activeStep >= 2 ? "!bg-primary-400" : "!bg-default-300"}>
            <HiCheckCircle className="h-8 w-8" />
            <div className="absolute -bottom-[4.5rem] w-max text-center">
              <Typography variant="h6" color={activeStep === 2 ? "blue-gray" : "gray"}>
                Step 3
              </Typography>
              <Typography color={activeStep === 2 ? "blue-gray" : "gray"} className="font-normal">
                提交发布，等待审核
              </Typography>
            </div>
          </Step>
        </Stepper>
      </div>
      <Divider className="mt-20" />
      <Carousel
        transition={{ duration: 1 }}
        navigation={() => {
          // 去除 navigation
          return null;
        }}
        prevArrow={({ handlePrev }) => {
          return (
            <Button
              variant="light"
              onClick={() => {
                handleStepPrev();
                handlePrev();
              }}
              endContent={<p>上一步</p>}
              isDisabled={isFirstStep}
              className="!absolute top-0 left-0"
            >
              <HiChevronLeft strokeWidth={1} className="h-7 w-7" />
            </Button>
          );
        }}
        nextArrow={({ handleNext }) => {
          return (
            <Button
              variant="light"
              onClick={() => {
                // 内容校验
                if (!checkFormItem()) return;

                handleStepNext();
                handleNext();
              }}
              startContent={<p>下一步</p>}
              isDisabled={isLastStep}
              className="!absolute top-0 right-0"
            >
              <HiChevronLeft strokeWidth={1} className="h-7 w-7 transform rotate-180" />
            </Button>
          );
        }}
      >
        {/* Step 1 */}
        <div className="flex flex-col gap-2 w-4/6 items-start text-start">
          <h2 className="text-3xl self-center mb-3">Prompt 基本信息</h2>
          <p>Prompt 标题：</p>
          <Input
            isRequired
            variant="underlined"
            color="success"
            type="text"
            isClearable
            placeholder="请输入 Prompt 标题"
            className="max-w-md"
            value={title}
            onValueChange={setTitle}
            isInvalid={title.length < 3}
            errorMessage={title.length < 3 ? "Prompt 标题不得少于 3 个字符" : ""}
            classNames={{
              errorMessage: `${title.length === 0 ? "hidden" : ""}`,
            }}
            autoFocus
          />
          <p>Prompt 模型：</p>
          <Select
            isRequired
            variant="bordered"
            color="success"
            className="max-w-xs"
            selectedKeys={[modelSelected]}
            onChange={(e) => setModelSelected(e.target.value)}
            isInvalid={modelSelected === ""}
            errorMessage={modelSelected === "" ? "Prompt 所属的模型不能为空" : ""}
          >
            {modelList.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </Select>
          <p>Prompt 分类：</p>
          <Select
            isRequired
            variant="bordered"
            color="success"
            className="max-w-xs"
            selectedKeys={[categorySelected]}
            onChange={(e) => setCategorySelected(e.target.value)}
            isInvalid={categorySelected === ""}
            errorMessage={categorySelected === "" ? "Prompt 所属的分类不能为空" : ""}
          >
            {categoryOptions.map((category) => (
              <SelectItem key={category.type} value={category.type}>
                {category.label}
              </SelectItem>
            ))}
          </Select>
          <p>Prompt 简介：</p>
          <Textarea
            isRequired
            variant="bordered"
            color="success"
            isInvalid={intro.length < 10}
            errorMessage={intro.length < 10 ? "简介内容不得少于 10 个字符" : ""}
            classNames={{
              errorMessage: `${intro.length === 0 ? "hidden" : ""}`,
            }}
            minRows={3}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="优质的简介可以让买家更了解该 Prompt，有助于提升 Prompt 的售出概率！"
            className="max-h-52 text-start max-w-xl"
          />
        </div>
        {/* Step 2 */}
        <div className="flex flex-col gap-2 w-4/6 items-start text-start">
          {modelMediaTypeSelected && modelMediaTypeSelected === modelMediaType.Text ? (
            <>
              <h2 className="text-3xl self-center mb-3">文本类 Prompt 详细</h2>
              <p>Prompt 内容：</p>
              <Textarea
                variant="bordered"
                color="success"
                isRequired
                isInvalid={promptContent.length <= 0}
                errorMessage={promptContent.length <= 0 ? "Prompt 内容不能为空" : ""}
                classNames={{
                  errorMessage: `${promptContent.length === 0 ? "hidden" : ""}`,
                }}
                minRows={3}
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                placeholder="请输入 Prompt 具体内容，买家购买后才会展示"
                className="max-h-52 text-start max-w-xl"
              />
              <p>使用建议：</p>
              <Textarea
                variant="bordered"
                color="success"
                isRequired
                isInvalid={useSuggestion.length <= 0}
                errorMessage={useSuggestion.length <= 0 ? "使用建议不能为空" : ""}
                classNames={{
                  errorMessage: `${useSuggestion.length === 0 ? "hidden" : ""}`,
                }}
                minRows={3}
                value={useSuggestion}
                onChange={(e) => setUseSuggestion(e.target.value)}
                placeholder="请填写一条使用建议，让买家更好的使用该 Prompt"
                className="max-h-52 text-start max-w-xl"
              />
              <p>输入示例：</p>
              <Textarea
                isRequired
                variant="bordered"
                color="success"
                isInvalid={inputExample.length <= 0}
                errorMessage={inputExample.length <= 0 ? "输入示例不能为空" : ""}
                classNames={{
                  errorMessage: `${inputExample.length === 0 ? "hidden" : ""}`,
                }}
                minRows={3}
                value={inputExample}
                onChange={(e) => setInputExample(e.target.value)}
                placeholder="请填写一条优质的输入示例"
                className="max-h-52 text-start max-w-xl"
              />
              <p>输出示例：</p>
              <Textarea
                isRequired
                variant="bordered"
                color="success"
                isInvalid={outputExample.length <= 0}
                errorMessage={outputExample.length <= 0 ? "输出示例不能为空" : ""}
                classNames={{
                  errorMessage: `${outputExample.length === 0 ? "hidden" : ""}`,
                }}
                minRows={3}
                value={outputExample}
                onChange={(e) => setOutputExample(e.target.value)}
                placeholder="请填写一条优质的输出示例，供买家参考"
                className="max-h-52 text-start max-w-xl"
              />
            </>
          ) : modelMediaTypeSelected === modelMediaType.Image ? (
            <>
              <h2 className="text-3xl self-center mb-3">图片类 Prompt 详细</h2>
              <p>Prompt 内容：</p>
              <Textarea
                variant="bordered"
                color="success"
                isRequired
                isInvalid={promptContent.length <= 0}
                errorMessage={promptContent.length <= 0 ? "Prompt 内容不能为空" : ""}
                classNames={{
                  errorMessage: `${promptContent.length === 0 ? "hidden" : ""}`,
                }}
                minRows={3}
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                placeholder="请输入 Prompt 具体内容，买家购买后才会展示"
                className="max-h-52 text-start max-w-xl"
              />
              <p>使用建议：</p>
              <Textarea
                variant="bordered"
                color="success"
                isRequired
                isInvalid={useSuggestion.length <= 0}
                errorMessage={useSuggestion.length <= 0 ? "使用建议不能为空" : ""}
                classNames={{
                  errorMessage: `${useSuggestion.length === 0 ? "hidden" : ""}`,
                }}
                minRows={3}
                value={useSuggestion}
                onChange={(e) => setUseSuggestion(e.target.value)}
                placeholder="请填写一条使用建议，让买家更好的使用该 Prompt"
                className="max-h-52 text-start max-w-xl"
              />
              <p>上传一张 Banner 图片：</p>
              <p className="text-sm text-default-400 -mt-1">*Banner 图片用于展示在商品卡片和详情页的 Banner 处</p>
              <div className="flex flex-col gap-4 items-center justify-center h-[220px] w-[600px]">
                <label
                  htmlFor="dropzone-file"
                  className={cn(
                    "flex flex-col gap-2 w-full h-full items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  )}
                >
                  <div className="relative inline-block">
                    <img
                      className={cn("h-[220px] w-[600px] opacity-30", { hidden: !masterImg })}
                      src={`${masterImg ? masterImg : ""}`}
                      alt="banner_img"
                    />
                    <div className={cn("absolute -top-10 -right-20 w-44", { hidden: masterImg })}>
                      <div className="flex flex-col gap-1 items-center">
                        <UploadIcon className="w-8 h-8 text-gray-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">点击上传</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, JPEG, WebP</p>
                      </div>
                    </div>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                          setMasterImg(e.target?.result as string);
                        };
                      }
                    }}
                  />
                </label>
              </div>
              <p className="mt-2">上传效果图：</p>
              <p className="text-sm text-default-400 -mt-1">*可上传 2-6 张效果图，严谨 PS，图片将直接展示给用户</p>
              <div className="flex gap-2 justify-start items-start">
                <div className="grid grid-cols-3 gap-4">
                  {imgList.map((image, index) => (
                    <div className="relative" key={index}>
                      <img src={image} alt={`Preview ${index}`} className="h-[150px] w-[220px] rounded-md" />
                      <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        onClick={() => {
                          const newImgList = [...imgList];
                          newImgList.splice(index, 1);
                          setImgList(newImgList);
                        }}
                        className="absolute top-1 right-1 dark:hover:bg-red-500/80"
                      >
                        <HiTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-4 items-center justify-center h-[150px] w-[202px]">
                    <label
                      htmlFor="img-list-file"
                      className={cn(
                        "flex flex-col gap-2 w-full h-full items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      )}
                    >
                      <div className="relative inline-block">
                        <div className={cn("absolute -top-10 -right-[87px] w-44")}>
                          <div className="flex flex-col gap-1 items-center">
                            <UploadIcon className="w-8 h-8 text-gray-500" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">点击上传</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, JPEG, WebP</p>
                          </div>
                        </div>
                      </div>
                      <input
                        id="img-list-file"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/svg,image/webp"
                        onChange={handleImgListChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <p className={cn("text-sm text-red-900", { hidden: imgList.length >= 2 && imgList.length <= 6 })}>
                请上传 2-6 张效果图，当前已上传 {imgList.length} 张
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl self-center mb-3">视频类 Prompt 详细</h2>
              <p>视频内容：</p>
              <Input type="file" />
            </>
          )}
        </div>
        {/* Step 3 */}
        <div className="flex flex-col gap-5 w-4/6">
          <h2 className="text-3xl self-center mb-3">发布 Prompt</h2>
          <div className={cn("flex flex-col gap-2 w-full", { hidden: modelMediaTypeSelected !== modelMediaType.Text })}>
            <p className="">上传一张具有辨识度的 Banner 图片，用于展示在商品卡片和详情页中</p>
            <div className="flex flex-col gap-4 items-center justify-center self-center h-[260px] w-[600px]">
              <label
                htmlFor="dropzone-file"
                className={cn(
                  "flex flex-col gap-2 w-full h-full items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                )}
              >
                <div className="relative inline-block">
                  <img
                    className={cn("h-[260px] w-[600px] opacity-40", { hidden: !masterImg })}
                    src={`${masterImg ? masterImg : ""}`}
                    alt="banner_img"
                  />
                  <div className={cn("absolute -top-10 -right-20 w-44", { hidden: masterImg })}>
                    <div className="flex flex-col gap-1 items-center">
                      <UploadIcon className="w-8 h-8 text-gray-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">点击上传</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, JPEG, WebP</p>
                    </div>
                  </div>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = (e) => {
                        setMasterImg(e.target?.result as string);
                      };
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <p className="mt-2">出售价格：</p>
            <Input
              isRequired
              variant="underlined"
              color="success"
              isInvalid={price < 0 || price >= 1000}
              errorMessage={price < 0 ? "出售价格不能为负数" : price >= 1000 ? "出售价格不能超过 1000" : ""}
              classNames={{
                errorMessage: `${price === 0 ? "hidden" : ""}`,
              }}
              type="number"
              startContent={<p>￥</p>}
              placeholder="请输入出售价格"
              value={String(price)}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="max-w-xs text-start"
            />
          </div>
          <Button
            onClick={handlePublish}
            isLoading={submitting}
            variant="flat"
            color="primary"
            className="w-40 h-14 self-center text-xl"
          >
            提交发布
          </Button>
          <p className="text-medium text-default-500">发布后，请耐心等待审核，可到 “上架商品” 一栏中查看审核情况</p>
        </div>
      </Carousel>
    </section>
  );
}

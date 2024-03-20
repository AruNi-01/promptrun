"use client";
import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";
import { CustomCheckbox } from "@/components/market-page/CustomCheckBox";
import { Rating } from "@material-tailwind/react";
import { users } from "@/mock_data/seller_prompts";

export default function MarketPage() {
  const list = [
    {
      title: "Orange",
      img: "/images/fruit-1.jpeg",
      price: "5.50",
    },
    {
      title: "Tangerine",
      img: "/images/fruit-2.jpeg",
      price: "3.00",
    },
    {
      title: "Raspberry",
      img: "/images/fruit-3.jpeg",
      price: "10.00",
    },
    {
      title: "Lemon",
      img: "/images/fruit-4.jpeg",
      price: "5.30",
    },
    {
      title: "Avocado",
      img: "/images/fruit-5.jpeg",
      price: "15.70",
    },
    {
      title: "Lemon 2",
      img: "/images/fruit-6.jpeg",
      price: "8.00",
    },
    {
      title: "Banana",
      img: "/images/fruit-7.jpeg",
      price: "7.50",
    },
    {
      title: "Watermelon",
      img: "/images/fruit-8.jpeg",
      price: "12.20",
    },
  ];

  const [modelSelected, setModelSelected] = useState<string>("all");
  const [categorySelected, setCategorySelected] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const pages = 4;

  return (
    <section className="flex flex-col gap-5 w-4/6 mt-8">
      <h1 className="text-4xl self-start">所有 Prompts</h1>
      <Divider />
      <div className="flex gap-1">
        <h2 className="text-lg">模型：</h2>
        <RadioGroup orientation="horizontal" value={modelSelected} onValueChange={setModelSelected}>
          <Radio value="all">All</Radio>
          <Radio value="gap">GPT</Radio>
          <Radio value="claude3">Claude 3</Radio>
          <Radio value="midjourney">Midjourney</Radio>
          <Radio value="dalle">DALL·E</Radio>
          <Radio value="stablediffusion">Stable Diffusion</Radio>
        </RadioGroup>
      </div>
      <div className="flex gap-1">
        <h2 className="text-lg">分类：</h2>
        <CheckboxGroup
          className="gap-1"
          orientation="horizontal"
          value={categorySelected}
          onValueChange={setCategorySelected}
        >
          <CustomCheckbox value="anime">动漫</CustomCheckbox>
          <CustomCheckbox value="advertise">广告</CustomCheckbox>
          <CustomCheckbox value="animal">动物</CustomCheckbox>
        </CheckboxGroup>
      </div>
      <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 mt-2">
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => console.log("item pressed")}
            className=""
          >
            <CardBody className="overflow-visible p-0">
              <div className="relative">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={item.title}
                  className="w-full object-cover h-[160px]"
                  src="https://run-notes.oss-cn-beijing.aliyuncs.com/notes/202304202145141.png"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 z-10">
                  <div className="flex gap-1 justify-between">
                    <Chip variant="flat" size="md" color="primary" className="self-start">
                      {item.title}
                    </Chip>
                    <Rating value={4} readonly ratedColor="blue" />
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter className="justify-between">
              <b>{item.title}</b>
              <p className="text-default-500 text-lg">￥{item.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-default-400 text-medium">Total {users.length} Prompts</span>
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
      </div>
    </section>
  );
}

"use client";
import { findOrderListAttachFullInfoBySellerUserId } from "@/_api/order";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { OrderListAttachFullInfo } from "@/types/_api/order";
import { Paginate } from "@/types/_api/paginate";
import { checkIsLogin, formatStringDate } from "@/utils/common";
import { categoryTypeMap, sellerOrderTableColumns, SellerOrderTableColumnsEnum } from "@/utils/constant";
import { toastErrorMsg } from "@/utils/messageToast";
import {
  Avatar,
  Chip,
  Divider,
  Pagination,
  Select,
  SelectedItems,
  Selection,
  SelectItem,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import ghostMoveAnimation from "@/public/lottie/ghost-move.json";
import { useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { HiCube, HiTag } from "react-icons/hi";

type TableColumn = (typeof sellerOrderTableColumns)[number];

export default function SellerOrderPage() {
  const { loginUser, removeLoginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
    removeLoginUser: state.removeLoginUser,
  }));

  const router = useRouter();

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(sellerOrderTableColumns.filter((column) => column.defaultVisible).map((column) => column.key)),
  );
  const headerColumns = useMemo(() => {
    return sellerOrderTableColumns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 12,
  });
  const [rows, setRows] = useState<number>(0);

  const [orderListAttachFullInfo, setOrderListAttachFullInfo] = useState<OrderListAttachFullInfo[]>([]);

  useEffect(() => {
    fetchOrderListData();

    // 注意：React 默认通过比较对象的引用来判断是否发生变化，而对象每次重新渲染后引用都会改变。
    // 所以对象的比较需要通过 JSON.stringify 转换为字符串再比较，否则会导致死循环。
  }, [JSON.stringify(paginate), JSON.stringify(loginUser)]);

  const fetchOrderListData = async () => {
    if (!loginUser) return;

    try {
      // fetch prompt list
      var rsp = await findOrderListAttachFullInfoBySellerUserId({
        paginate: paginate,
        sellerUserId: loginUser?.id,
      });
      if (!checkIsLogin(rsp.errCode)) {
        removeLoginUser();
        router.refresh();

        toastErrorMsg("您未登录，请登录后再操作！");
        return;
      }
      if (rsp.errCode !== 0) {
        toastErrorMsg("查询订单列表失败，请稍后刷新重试！");
        return;
      }

      setOrderListAttachFullInfo(rsp.data.orderListAttachFullInfo);
      setRows(rsp.data.rows);
    } catch (error) {
      toastErrorMsg("获取订单列表失败，请稍后刷新重试！");
    }
  };

  const sortedItems = useMemo(() => {
    if (!orderListAttachFullInfo) return [];
    return [...orderListAttachFullInfo].sort((a: OrderListAttachFullInfo, b: OrderListAttachFullInfo) => {
      var first = 0,
        second = 0;
      if (sortDescriptor?.column === SellerOrderTableColumnsEnum.create_time) {
        const dateA = new Date(a.order.create_time);
        const dateB = new Date(b.order.create_time);
        first = dateA.getTime();
        second = dateB.getTime();
      } else if (sortDescriptor?.column === SellerOrderTableColumnsEnum.price) {
        first = a.order.price as number;
        second = b.order.price as number;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor?.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, JSON.stringify(orderListAttachFullInfo)]);

  const renderCell = useCallback((data: OrderListAttachFullInfo, columnKey: Key) => {
    switch (columnKey) {
      case SellerOrderTableColumnsEnum.prompt_title:
        return <p>{data.prompt.title}</p>;
      case SellerOrderTableColumnsEnum.prompt_model:
        return (
          <Chip variant="faded" color="success" size="sm" radius="sm" startContent={<HiCube />}>
            {data.model.name}
          </Chip>
        );
      case SellerOrderTableColumnsEnum.prompt_category:
        return (
          <Chip variant="flat" color="warning" size="sm" radius="sm" startContent={<HiTag />}>
            {categoryTypeMap.get(data.prompt.category_type)}
          </Chip>
        );
      case SellerOrderTableColumnsEnum.buyer:
        return (
          <div className="flex gap-2 items-center">
            <Avatar alt={data.buyer.nickname} className="flex-shrink-0" size="sm" src={data.buyer.header_url} />
            <span>{data.buyer.nickname}</span>
          </div>
        );
      case SellerOrderTableColumnsEnum.rating:
        return <p>{data.order.rating === 0 ? "暂未评分" : data.order.rating.toFixed(1)}</p>;
      case SellerOrderTableColumnsEnum.price:
        return <p>{"￥" + data.order.price.toFixed(2)}</p>;
      case SellerOrderTableColumnsEnum.create_time:
        return <p>{formatStringDate(data.order.create_time)}</p>;
      default:
        return "-";
    }
  }, []);

  return (
    <Table
      aria-label="Table"
      removeWrapper
      bottomContent={
        <div className="py-2 px-2 flex justify-between items-center">
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">总计：{rows}</span>
          </div>
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
      }
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={{
        th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      }}
      selectedKeys={selectedKeys}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl self-start">我卖出的 Prompts</h1>
          <Divider />
          <Select
            label="可见列："
            labelPlacement="outside-left"
            classNames={{
              base: "max-w-xl",
              label: "text-lg whitespace-nowrap pt-[10px]",
              trigger: "min-h-unit-12",
            }}
            isMultiline={true}
            selectionMode="multiple"
            variant="bordered"
            items={sellerOrderTableColumns}
            disallowEmptySelection
            selectedKeys={visibleColumns}
            disabledKeys={sellerOrderTableColumns.filter((column) => column.disabledKey).map((column) => column.key)}
            onSelectionChange={setVisibleColumns}
            renderValue={(items: SelectedItems<TableColumn>) => {
              return (
                <div className="flex flex-wrap gap-1">
                  {items.map((item) => (
                    <Chip color="default" variant="shadow" key={item.data?.key} size="sm">
                      {item.data?.label}
                    </Chip>
                  ))}
                </div>
              );
            }}
          >
            {(column) => (
              <SelectItem key={column.key} value={column.key}>
                {column.label}
              </SelectItem>
            )}
          </Select>
        </div>
      }
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={
          <div className="h-80">
            <Lottie animationData={ghostMoveAnimation} className="h-64" />
            <span className="text-default-400 text-medium self-center">您还未卖出过任何 Prompt，继续努力哦！</span>
          </div>
        }
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.order.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
        )}
      </TableBody>
    </Table>
  );
}

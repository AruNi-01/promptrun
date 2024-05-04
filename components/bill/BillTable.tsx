import {
  Chip,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import Lottie from "lottie-react";
import ghostMoveAnimation from "@/public/lottie/ghost-move.json";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import {
  billChannelColorMap,
  billChannelMap,
  billTableColumns,
  BillTableColumnsEnum,
  billTypeColorMap,
  billTypeMap
} from "@/utils/constant";
import { Paginate } from "@/types/api/paginate";
import { Bill } from "@/types/api/bill";
import { findBillListByUserId } from "@/api/bill";
import { checkIsLogin, formatStringDate } from "@/utils/common";
import { toastErrorMsg } from "@/utils/messageToast";
import { useRouter } from "next/navigation";
import { useLoginUserStore } from "@/state_stores/loginUserStore";

export default function BillTable() {
  const { loginUser, removeLoginUser } = useLoginUserStore();
  const router = useRouter();
  
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(billTableColumns.map((column) => column.key))
  );
  const headerColumns = useMemo(() => {
    return billTableColumns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const [paginate, setPaginate] = useState<Paginate>({
    page: 1,
    pageSize: 10,
  });
  const [rows, setRows] = useState<number>(0);

  const [bill, setBill] = useState<Bill[]>([]);

  useEffect(() => {
    fetchBillData();
  }, [JSON.stringify(paginate), JSON.stringify(loginUser)]);

  const fetchBillData = async () => {
    if (!loginUser) return;

    try {
      const rsp = await findBillListByUserId({
        paginate: paginate,
        userId: loginUser?.id,
      });
      if (!checkIsLogin(rsp.errCode)) {
        removeLoginUser();
        router.refresh();

        toastErrorMsg("您未登录，请登录后再操作！");
        return;
      }
      if (rsp.errCode !== 0) {
        toastErrorMsg("查询账单列表失败，请稍后刷新重试！");
        return;
      }

      setBill(rsp.data.billList);
      setRows(rsp.data.rows);
    } catch (error) {
      toastErrorMsg("获取账单列表失败，请稍后刷新重试！");
    }
  };

  const sortedItems = useMemo(() => {
    if (!bill) return [];
    return [...bill].sort((a: Bill, b: Bill) => {
      let first = 0, second = 0;
      if (sortDescriptor?.column === BillTableColumnsEnum.create_time) {
        const dateA = new Date(a.create_time);
        const dateB = new Date(b.create_time);
        first = dateA.getTime();
        second = dateB.getTime();
      } else if (sortDescriptor?.column === BillTableColumnsEnum.amount) {
        first = a.amount as number;
        second = b.amount as number;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor?.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, JSON.stringify(bill)]);

  const renderCell = useCallback((data: Bill, columnKey: Key) => {
    switch (columnKey) {
      case BillTableColumnsEnum.type:
        return (
          <Chip variant="shadow" color={billTypeColorMap.get(data.type)} size="sm" radius="sm">
            {billTypeMap.get(data.type)}
          </Chip>
        )
      case BillTableColumnsEnum.channel:
        return (
          <Chip variant="dot" color={billChannelColorMap.get(data.channel)} size="sm" radius="sm">
            {billChannelMap.get(data.channel)}
          </Chip>
        );
      case BillTableColumnsEnum.amount:
        return (
          <p>￥{data.amount.toFixed(2)}</p>
        );
      case BillTableColumnsEnum.remark:
        return (
          <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]">{data.remark}</p>
        );
      case BillTableColumnsEnum.create_time:
        return <p>{formatStringDate(data.create_time)}</p>;
      default:
        return "-";
    }
  }, []);
  
  return (
    <Table
      aria-label="Table"
      removeWrapper
      bottomContent={
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center justify-between">
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

        </div>
      }
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      className="overflow-hidden"
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
            <span className="self-center text-default-400 text-medium">您还未在 PromptRun 又过任何交易</span>
          </div>
        }
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
        )}
      </TableBody>
    </Table>
  )
}
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Textarea } from "@nextui-org/react";

export default function BecomeSeller() {
  const { loginUser } = useLoginUserStore();

  return (
    <section className="flex flex-col items-center mt-10">
      <h1>申请成为卖家</h1>
      <Textarea
        isRequired
        label="Description"
        labelPlacement="outside"
        placeholder="Enter your description"
        className="max-w-xs"
      />
    </section>
  );
}

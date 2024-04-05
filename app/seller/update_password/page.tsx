"use client";
import { logout, updatePassword } from "@/api/passport";
import { LockIcon } from "@/components/icons";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { UpdatePasswordReq } from "@/types/api/passport";
import { toastErrorMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Button, Divider, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SellerUpdatePasswordPage() {
  const { loginUser, removeLoginUser } = useLoginUserStore();

  const router = useRouter();

  const [updatePasswordForm, setUpdatePasswordForm] = useState<UpdatePasswordReq>({
    userId: loginUser?.id || 0,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    setUpdatePasswordForm({ userId: loginUser?.id || 0, oldPassword: "", newPassword: "", confirmNewPassword: "" });
  }, [loginUser]);

  const [formErrorMsg, setFormErrorMsg] = useState<string>("");

  const handleUpdatePassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const rsp = await updatePassword(updatePasswordForm);
      if (rsp.errCode !== 0) {
        setFormErrorMsg(rsp.errMsg);
      } else {
        setUpdatePasswordForm({ userId: loginUser?.id || 0, oldPassword: "", newPassword: "", confirmNewPassword: "" });
        setFormErrorMsg("");
        await logout();
        removeLoginUser();
        router.push("/");
        toastSuccessMsg("密码修改成功，请重新登录 Prompt Run!");
      }
    } catch (error) {
      console.error("Error:", error);
      toastErrorMsg("密码修改失败，服务器开小差了，请稍后重试！");
    }
  };

  return (
    <section className="flex flex-col gap-3 mt-8">
      <h1 className="text-3xl self-start">修改密码</h1>
      <Divider />
      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 w-1/2">
        <Input
          isRequired
          variant="bordered"
          value={updatePasswordForm.oldPassword}
          onChange={(e) => setUpdatePasswordForm({ ...updatePasswordForm, oldPassword: e.target.value })}
          label="原密码"
          placeholder="请输入您的原密码"
          type="password"
          endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
        />
        <Input
          isRequired
          variant="bordered"
          value={updatePasswordForm.newPassword}
          onChange={(e) => setUpdatePasswordForm({ ...updatePasswordForm, newPassword: e.target.value })}
          label="新密码"
          placeholder="请输入您的新密码"
          type="password"
          endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
        />
        <Input
          isRequired
          variant="bordered"
          value={updatePasswordForm.confirmNewPassword}
          onChange={(e) => setUpdatePasswordForm({ ...updatePasswordForm, confirmNewPassword: e.target.value })}
          label="确认新密码"
          placeholder="请再次输入您的新密码"
          type="password"
          endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
        />
        <div className="flex flex-col gap-2 justify-end">
          <span hidden={!formErrorMsg} className="text-danger text-[14px] self-center">
            修改错误：{formErrorMsg}
          </span>
          <Button type="submit" fullWidth color="primary">
            修改密码
          </Button>
        </div>
      </form>
    </section>
  );
}

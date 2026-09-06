"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function NewStaffPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createStaff = api.staff.create.useMutation({
    onSuccess: () => {
      router.push("/staff");
    },
  });

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => createStaff.mutate({ name })}
        disabled={createStaff.isPending}
      >
        登録
      </button>
    </div>
  );
}

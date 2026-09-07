"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function NewStaffPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [hiredAt, setHiredAt] = useState("");

  const { mutate, isPending, error } = api.staff.create.useMutation({
    onSuccess: () => {
      router.push("/staff");
    },
  });
  const fieldErrors = error?.data?.zodError?.fieldErrors;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        スタッフ登録
      </h1>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isPending) return;

          mutate({
            name,
            position: position || undefined,
            hiredAt: hiredAt
              ? new Date(`${hiredAt}T00:00:00+09:00`)
              : undefined,
          });
        }}
        className="mt-8 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-900"
          >
            名前 <span className="font-normal text-gray-600">（必須）</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={!!fieldErrors?.name?.length}
            aria-describedby={
              fieldErrors?.name?.length ? "name-error" : undefined
            }
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
          />
          {fieldErrors?.name?.length ? (
            <p
              id="name-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.name.join(" ")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-semibold text-gray-900"
          >
            役職 <span className="font-normal text-gray-600">（任意）</span>
          </label>
          <input
            id="position"
            name="position"
            type="text"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            aria-invalid={!!fieldErrors?.position?.length}
            aria-describedby={
              fieldErrors?.position?.length ? "position-error" : undefined
            }
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
          />
          {fieldErrors?.position?.length ? (
            <p
              id="position-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.position.join(" ")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="hiredAt"
            className="block text-sm font-semibold text-gray-900"
          >
            入社日 <span className="font-normal text-gray-600">（任意）</span>
          </label>
          <input
            id="hiredAt"
            name="hiredAt"
            type="date"
            value={hiredAt}
            onChange={(event) => setHiredAt(event.target.value)}
            aria-invalid={!!fieldErrors?.hiredAt?.length}
            aria-describedby={
              fieldErrors?.hiredAt?.length ? "hiredAt-error" : undefined
            }
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
          />
          {fieldErrors?.hiredAt?.length ? (
            <p
              id="hiredAt-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.hiredAt.join(" ")}
            </p>
          ) : null}
        </div>

        {error && !error.data?.zodError && (
          <p role="alert" className="text-sm text-red-600">
            登録に失敗しました。時間をおいてもう一度お試しください。
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "登録中…" : "登録"}
        </button>
      </form>
    </main>
  );
}

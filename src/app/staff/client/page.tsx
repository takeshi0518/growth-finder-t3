"use client";

import Link from "next/link";
import { useState } from "react";

import type { RouterOutputs } from "@/trpc/react";

const staff: RouterOutputs["staff"]["getAll"] = [];

export default function ClientStaffPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [hiredAt, setHiredAt] = useState("");

  // TODO: useQuery の戻り値に置き換える
  const isLoading = false;
  const isFetching = false;
  const isError = false;

  // TODO: useMutation の戻り値に置き換える
  const isPending = false;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            tRPC + TanStack Query
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            クライアント版スタッフ一覧
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            取得状態やキャッシュの変化を確認するための練習画面です。
          </p>
        </div>
        <Link
          href="/staff"
          className="inline-flex self-start rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Server Component版へ
        </Link>
      </div>

      <section
        aria-labelledby="query-controls-heading"
        className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="query-controls-heading"
              className="text-lg font-semibold text-gray-900"
            >
              取得コントロール
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              自動取得の条件と手動再取得の動きを確認します。
            </p>
          </div>
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            今すぐ再取得
          </button>
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-md bg-gray-50 px-4 py-3">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(event) => setIsEnabled(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-900">
              データ取得を有効にする
            </span>
            <span className="block text-xs text-gray-600">
              enabledオプションに渡す条件として使用します
            </span>
          </span>
        </label>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <QueryState label="isLoading" active={isLoading} />
          <QueryState label="isFetching" active={isFetching} />
          <QueryState label="isError" active={isError} tone="error" />
        </dl>
      </section>

      <section aria-labelledby="staff-list-heading" className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="staff-list-heading"
              className="text-xl font-semibold text-gray-900"
            >
              スタッフ一覧
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              取得件数: {staff.length}件
            </p>
          </div>
          {isFetching && !isLoading ? (
            <p role="status" className="text-sm text-gray-600">
              更新中…
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div
            role="status"
            className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-600"
          >
            スタッフを取得しています…
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700"
          >
            スタッフの取得に失敗しました。
          </div>
        ) : staff.length === 0 ? (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center">
            <p className="font-medium text-gray-900">
              表示するスタッフはいません
            </p>
            <p className="mt-2 text-sm text-gray-600">
              queryを接続すると、取得したスタッフがここに表示されます。
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    名前
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    役職
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    入社日
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      <Link
                        href={`/staff/${member.id}`}
                        className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                      >
                        {member.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                      {member.position ?? "未設定"}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                      {member.hiredAt
                        ? member.hiredAt.toLocaleDateString("ja-JP", {
                            timeZone: "Asia/Tokyo",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "未設定"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        aria-labelledby="create-staff-heading"
        className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2
          id="create-staff-heading"
          className="text-xl font-semibold text-gray-900"
        >
          スタッフを追加
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          mutation成功後の一覧キャッシュの変化を確認します。
        </p>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            // TODO: mutateを呼び出す
          }}
          className="mt-6 grid gap-6 sm:grid-cols-2"
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
              disabled={isPending}
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50"
            />
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
              disabled={isPending}
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50"
            />
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
              disabled={isPending}
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isPending ? "追加中…" : "追加する"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function QueryState({
  label,
  active,
  tone = "default",
}: {
  label: string;
  active: boolean;
  tone?: "default" | "error";
}) {
  const activeClass =
    tone === "error" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";

  return (
    <div className="rounded-md border border-gray-200 px-4 py-3">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-2">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            active ? activeClass : "bg-gray-100 text-gray-600"
          }`}
        >
          {String(active)}
        </span>
      </dd>
    </div>
  );
}

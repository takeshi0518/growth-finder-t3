import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "@/trpc/server";

type Props = { params: Promise<{ id: string }> };

export default async function StaffDetailPage({ params }: Props) {
  const { id } = await params;
  const staff = await api.staff.getById({ id });

  if (!staff) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        スタッフ詳細
      </h1>

      <dl className="mt-8 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4">
          <dt className="text-sm font-semibold text-gray-900">名前</dt>
          <dd className="mt-2 text-sm break-words text-gray-600">
            {staff.name}
          </dd>
        </div>
        <div className="px-6 py-4">
          <dt className="text-sm font-semibold text-gray-900">役職</dt>
          <dd className="mt-2 text-sm break-words text-gray-600">
            {staff.position ?? "未設定"}
          </dd>
        </div>
        <div className="px-6 py-4">
          <dt className="text-sm font-semibold text-gray-900">入社日</dt>
          <dd className="mt-2 text-sm text-gray-600">
            {staff.hiredAt
              ? staff.hiredAt.toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "未設定"}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href={`/staff/${staff.id}/evaluation`}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          評価する
        </Link>
        <Link
          href="/staff"
          className="rounded-sm text-sm font-medium text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          一覧に戻る
        </Link>
      </div>
    </main>
  );
}

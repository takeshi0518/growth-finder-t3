import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentPeriod } from "@/lib/period";
import { api } from "@/trpc/server";

import { EvaluationForm } from "./_components/evaluation-form";

type Props = { params: Promise<{ id: string }> };

export default async function StaffEvaluationPage({ params }: Props) {
  const { id } = await params;
  const period = getCurrentPeriod();
  const [staff, evaluation] = await Promise.all([
    api.staff.getById({ id }),
    api.evaluation.getForStaff({ staffId: id, period }),
  ]);

  if (!staff) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        スタッフ評価
      </h1>

      <dl className="mt-8 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4">
          <dt className="text-sm font-semibold text-gray-900">名前</dt>
          <dd className="mt-2 text-sm break-words text-gray-600">
            {staff.name}
          </dd>
        </div>
        <div className="px-6 py-4">
          <dt className="text-sm font-semibold text-gray-900">期間</dt>
          <dd className="mt-2 text-sm text-gray-600">{period}</dd>
        </div>
        <div className="px-6 py-4">
          <dt className="text-sm font-semibold text-gray-900">状態</dt>
          <dd className="mt-2 text-sm text-gray-600">
            {evaluation === null ? (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                未作成
              </span>
            ) : evaluation.status === "DRAFT" ? (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                下書き
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                確定済み
              </span>
            )}
          </dd>
        </div>
      </dl>

      <EvaluationForm
        staffId={staff.id}
        period={period}
        evaluation={evaluation}
      />

      <Link
        href="/staff"
        className="mt-8 inline-block rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      >
        スタッフ一覧に戻る
      </Link>
    </main>
  );
}

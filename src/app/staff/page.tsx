import Link from "next/link";

import { api } from "@/trpc/server";

export default async function StaffPage() {
  const staff = await api.staff.getAll();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        スタッフ一覧
      </h1>

      {staff.length === 0 ? (
        <p className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-600">
          スタッフが登録されていません
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
    </main>
  );
}

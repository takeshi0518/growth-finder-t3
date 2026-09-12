import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Growth Finder
      </h1>
      <p className="mt-4 leading-relaxed text-gray-600">
        飲食店のスタッフ評価を記録・管理するアプリです。
        <br />
        日々の評価を振り返り、スタッフの成長をサポートします。
      </p>
      <Link
        href="/staff"
        className="mt-8 inline-flex rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      >
        スタッフ一覧へ
      </Link>
    </main>
  );
}

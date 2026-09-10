"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  EVALUATION_CATEGORIES,
  EVALUATION_ITEMS,
} from "@/lib/evaluation-items";
import { api, type RouterInputs, type RouterOutputs } from "@/trpc/react";

type Props = {
  staffId: string;
  period: string;
  evaluation: RouterOutputs["evaluation"]["getForStaff"];
};

export function EvaluationForm({ staffId, period, evaluation }: Props) {
  const router = useRouter();
  const initialScores = Object.fromEntries(
    EVALUATION_ITEMS.map((item) => [
      item.itemName,
      evaluation?.scores.find((s) => s.itemName === item.itemName)?.score ?? 0,
    ]),
  );
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [comment, setComment] = useState(evaluation?.comment ?? "");
  const { mutate, isPending, error } = api.evaluation.save.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const fieldErrors = error?.data?.zodError?.fieldErrors;

  function save(status: RouterInputs["evaluation"]["save"]["status"]) {
    if (isPending) return;

    mutate({
      staffId,
      period,
      comment,
      status,
      scores: EVALUATION_ITEMS.map((item) => ({
        ...item,
        score: scores[item.itemName] ?? 0,
      })),
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save("COMPLETED");
      }}
      className="mt-8 space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {EVALUATION_CATEGORIES.map(({ key, label }) => (
        <section key={key} aria-labelledby={`category-${key}`}>
          <h2
            id={`category-${key}`}
            className="border-b border-gray-200 pb-3 text-lg font-semibold text-gray-900"
          >
            {label}
          </h2>
          <div className="mt-4 space-y-6">
            {EVALUATION_ITEMS.filter((item) => item.category === key).map(
              (item) => (
                <fieldset key={item.itemName} disabled={isPending}>
                  <legend className="text-sm font-semibold text-gray-900">
                    {item.itemName}
                  </legend>
                  <div className="mt-2 flex gap-2">
                    {Array.from({ length: item.maxScore }, (_, index) => {
                      const value = index + 1;
                      const selected = scores[item.itemName] === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          aria-label={`${value}点`}
                          aria-pressed={selected}
                          onClick={() =>
                            setScores((current) => ({
                              ...current,
                              [item.itemName]: value,
                            }))
                          }
                          className={`h-10 w-10 rounded-md border text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${
                            selected
                              ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-700"
                              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ),
            )}
          </div>
        </section>
      ))}

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-semibold text-gray-900"
        >
          総評 <span className="font-normal text-gray-600">（任意）</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={5}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={isPending}
          aria-invalid={!!fieldErrors?.comment?.length}
          aria-describedby={
            fieldErrors?.comment?.length
              ? "evaluation-error-comment"
              : undefined
          }
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50"
        />
      </div>

      {error && (
        <div role="alert" className="space-y-2 text-sm text-red-600">
          <p>保存に失敗しました。入力内容を確認し、もう一度お試しください。</p>
          {Object.entries(fieldErrors ?? {}).map(([field, messages]) =>
            messages?.length ? (
              <p key={field} id={`evaluation-error-${field}`}>
                {messages.join(" ")}
              </p>
            ) : null,
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => save("DRAFT")}
          disabled={isPending}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          下書き保存
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          確定
        </button>
        {isPending && (
          <p role="status" className="text-sm text-gray-600">
            保存中…
          </p>
        )}
      </div>
    </form>
  );
}

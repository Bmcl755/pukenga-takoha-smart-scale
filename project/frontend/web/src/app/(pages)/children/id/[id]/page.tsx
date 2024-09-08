"use client";
import { useApiContext } from "@/context/ApiContext";
import { useEffect, useState } from "react";
import { Child, Weighing } from "@/models/Children";
import converter from "@/services/date-utils/ConvertIsoStringToDateString";
import { Icon } from "@iconify/react";
import { WeightChart } from "@/app/components/WeightChart";
import CreateWeighing from "@/app/components/CreateWeighing";
import { useObservable } from "@/hooks/useObservable";

export default function RecordPage({ params }: { params: { id: string } }) {
  const api = useApiContext();

  const [child, setChild] = useState<Child | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayWeighings, setDisplayWeighings] = useState<Weighing[]>([]);

  const role = useObservable(api.role, "");

  const NUM_WEIGHINGS_PER_PAGE = 4;

  useEffect(() => {
    (async () => {
      const child: Child = await api.getChildById(params.id);
      child.weighings.sort((a, b) => {
        return a.date > b.date ? -1 : 1;
      });
      setNumPages(Math.ceil(child.weighings.length / NUM_WEIGHINGS_PER_PAGE));
      setDisplayWeighings(child.weighings.slice(0, NUM_WEIGHINGS_PER_PAGE));
      setChild(child);
    })();
  }, [api, params.id]);

  useEffect(() => {
    if (child?.weighings !== null && child?.weighings !== undefined) {
      const start = NUM_WEIGHINGS_PER_PAGE * currentPage;
      const end = start + NUM_WEIGHINGS_PER_PAGE;
      setDisplayWeighings(child?.weighings.slice(start, end));
    }
  }, [currentPage, child?.weighings]);

  return (
    <main className="section-container flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl">
            Name: {child?.first_name} {child?.last_name}
          </h1>
          <div>
            <h3>Address: {child?.address}</h3>
            {child?.last_edited && (
              <h4 className="italic">
                Last edited: {converter(child.last_edited).formattedTime} |{" "}
                {converter(child?.last_edited).formattedDate}
              </h4>
            )}
          </div>
          {role != "parent" && (
            <div className="mt-5 flex w-full justify-center">
              <button
                onClick={() =>
                  (
                    document.getElementById(
                      "createWeightingModal"
                    ) as HTMLDialogElement
                  ).showModal()
                }
                className="btn text-sm"
              >
                <Icon icon="gg:add" className="h-5 w-5" />
                Record new weighing
              </button>
              <dialog id="createWeightingModal" className="modal">
                <CreateWeighing childId={params.id} />
              </dialog>
            </div>
          )}
        </div>
        <div className="h-96 w-96">
          {child?.weighings && child.weighings.length > 0 && (
            <h2 className="text-2xl">Recent weighings</h2>
          )}
          <div className="overflow-x-auto">
            {child?.weighings && child.weighings.length > 0 && (
              <table className="table table-zebra">
                <thead>
                  <tr className="border-gray-200 text-xs text-gray-500">
                    <th>Date</th>
                    <th>Time</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {displayWeighings.map((weighing, idx) => {
                    return (
                      <tr
                        className="border-gray-200 py-3"
                        key={weighing.date.toString()}
                      >
                        <td className="">
                          {converter(weighing.date).formattedDate}
                        </td>
                        <td>{converter(weighing.date).formattedTime}</td>
                        <td className="">{weighing.weight}kg</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {numPages > 1 && (
              <div className="join">
                {currentPage > 0 && (
                  <button
                    className="btn join-item"
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                    }}
                  >
                    «
                  </button>
                )}
                <button className="btn join-item">
                  Page {currentPage + 1}
                </button>
                {currentPage + 1 < numPages && (
                  <button
                    className="btn join-item"
                    onClick={() => {
                      if (child) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                  >
                    »
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {child?.weighings && child.weighings.length > 0 && (
        <WeightChart weighings={child?.weighings.toReversed()} />
      )}
    </main>
  );
}

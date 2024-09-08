import { useApiContext } from "@/context/ApiContext";
import { Weighing } from "@/models/Children";
import converter from "@/services/date-utils/ConvertIsoStringToDateString";
import { Icon } from "@iconify/react/dist/iconify.js";
import { isNumber } from "chart.js/helpers";
import { useEffect, useState } from "react";

export default function CreateWeighing({ childId }: { childId: string }) {
  const api = useApiContext();

  const [scaleId, setScaleId] = useState("");
  const [manualWeight, setManualWeight] = useState("");
  const [weightingFromScale, setWeightingFromScale] = useState<Weighing | null>(
    null
  );

  async function addWeighting(newWeighing: string) {
    const res = await api.postWeighing(childId, parseFloat(newWeighing));
    location.reload();
  }

  async function getWeightFromScale() {
    try {
      if (scaleId === "") {
        setScaleId("");
        setWeightingFromScale(null);
        return;
      }
      const weightsfromScale: Weighing[] = (
        await api.getWeighingByScaleId(scaleId)
      ).weighings;
      const mostRecentWeighing = weightsfromScale.reduce(
        (mostRecentWeighingSoFar, currentWeighing) => {
          if (currentWeighing.date > mostRecentWeighingSoFar.date) {
            return currentWeighing;
          } else {
            return mostRecentWeighingSoFar;
          }
        },
        { date: "-9999-01-01T00:00:00Z" } as Weighing
      );
      setWeightingFromScale(mostRecentWeighing);
    } catch (e) {
      setWeightingFromScale(null);
    }
  }

  return (
    <div className="modal-box">
      <div className="flex flex-col">
        <div className="mx-auto mt-5 w-4/5">
          <div className="flex flex-row">
            <h2 className="card-title text-primary">New Weighing from Scale</h2>
            <div className="modal-action my-auto ml-auto">
              <form method="dialog">
                <button className="btn">
                  <Icon icon="material-symbols:close" width="15" />
                </button>
              </form>
            </div>
          </div>
          <div className="-mt-2 flex flex-col gap-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Scale ID:</span>
              </div>
              <div className="flex w-full items-center gap-2">
                <input
                  type="text"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      getWeightFromScale();
                    }
                  }}
                  onChange={(e) => {
                    setScaleId(e.target.value);
                  }}
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full rounded-md"
                />
                <Icon icon="" />
                <Icon
                  icon="material-symbols-light:search"
                  width="35"
                  onClick={async () => {
                    getWeightFromScale();
                  }}
                  className="mr-2 cursor-pointer"
                />
              </div>
            </label>
            {weightingFromScale != null && (
              <>
                <div className="card card-body flex flex-row border-2">
                  <div>
                    <h2 className="-mt-2 text-center text-base text-primary">
                      Recent Weighing
                    </h2>
                    <table className="table table-zebra">
                      <thead>
                        <tr className="border-gray-200 text-xs text-gray-500">
                          <th>Date</th>
                          <th>Time</th>
                          <th>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-gray-200 py-3">
                          <td className="">
                            {converter(weightingFromScale.date).formattedDate}
                          </td>
                          <td>
                            {converter(weightingFromScale.date).formattedTime}
                          </td>
                          <td className="">{weightingFromScale.weight}kg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="text-right">
                  <form method="dialog">
                    <button
                      onClick={() =>
                        addWeighting(weightingFromScale.weight.toString())
                      }
                      className="btn btn-primary rounded-md text-white"
                    >
                      Add Weighing From Scale
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
          <div className="divider divider-primary my-10 tracking-widest">
            OR
          </div>
          <h2 className="card-title text-primary">New Manual Weighing</h2>
          <div className="flex flex-col gap-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Weight:</span>
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setManualWeight(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    manualWeight !== "" &&
                    isNumber(manualWeight)
                  ) {
                    addWeighting(manualWeight);
                  }
                }}
                placeholder="Type here"
                className="input input-bordered input-primary w-full rounded-md"
              />
            </label>
            <div className="text-right">
              <form method="dialog">
                <button
                  onClick={() => {
                    if (manualWeight !== "" && isNumber(manualWeight)) {
                      addWeighting(manualWeight);
                    }
                  }}
                  className="btn btn-primary rounded-md  text-white"
                >
                  Add Manual Weighing
                </button>
              </form>
            </div>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

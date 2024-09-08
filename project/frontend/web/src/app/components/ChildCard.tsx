import converter from "@/services/date-utils/ConvertIsoStringToDateString";
import { Icon } from "@iconify/react";

interface Child {
  _id: string;
  first_name: string;
  last_name: string;
  address: string;
  weighings: [{ date: string; weight: Number }];
  assigned_nurses: string[];
  last_edited: string;
}

export default function ChildCard({ child }: { child: Child }) {
  const { formattedDate, formattedTime } = converter(child.last_edited);

  return (
    <div
      key={child._id.toString()}
      className="card relative bg-base-100 shadow-xl"
    >
      <a className="w-full-h-full" href={`/children/id/${child._id}`}>
        <Icon className="absolute right-5 top-5" icon="ri:external-link-fill" />
        <Icon className="absolute right-5 top-5" icon="ri:external-link-fill" />
        <div className="card-body">
          <h2 className="card-title">
            {child.first_name} {child.last_name}
          </h2>
          <div className="grid grid-cols-2 grid-rows-2">
            {child.weighings[0] && <p className="order-1">Last weighing:</p>}
            {child.weighings[0] && (
              <p className="order-2">{child.weighings[0]?.weight.toString()}</p>
            )}
            <p className="order-3 row-span-full">Last edited:</p>
            <p className="order-4 row-span-full text-nowrap">
              {formattedDate} | {formattedTime}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}

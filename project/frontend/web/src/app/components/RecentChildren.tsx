import { useApiContext } from "@/context/ApiContext";
import { useEffect, useState } from "react";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import ChildCard from "./ChildCard";
import { Child } from "@/models/Children";

export default function RecentChildren() {
  const api = useApiContext();
  const [assignedChildren, setAssignedChildren] = useState<Child[] | null>(
    null
  );

  const loginState = useRequireLogin();

  useEffect(() => {
    (async () => {
      const res: Child[] = await api.getAssignedChildren();
      res.sort((a, b) => (a > b ? 1 : -1));
      setAssignedChildren(res.slice(0, 1));
    })();
  }, [api]);

  return (
    <div className={`h-full ${loginState ? "" : "skeleton"}`}>
      {assignedChildren &&
        assignedChildren.map((child) => (
          <ChildCard key={child._id.toString()} child={child} />
        ))}
    </div>
  );
}

import BankCategoryInstance from "@/data-layer/bank";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data, isLoading } = BankCategoryInstance.useGetAll({
        showMessage : true,
    });

    return <div>Hello "/"! {isLoading ? 'd' : 's'}</div>;
}

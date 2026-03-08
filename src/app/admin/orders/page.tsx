import { getOrders } from "@/actions/admin-orders";
import OrderListClient from "@/components/admin/OrderListClient";

export default async function AdminOrdersPage() {
    const { orders = [] } = await getOrders();

    return (
        <div className="p-4 sm:p-8 max-w-[1600px] mx-auto text-black">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                <p className="text-slate-500 mt-1">Track customer orders and update delivery status.</p>
            </div>

            <OrderListClient initialOrders={orders} />
        </div>
    );
}

import { EmptyState } from '@/components/empty-state';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import { type Order } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Clock,
    DollarSign,
    Eye,
    Package,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function OrderList({ orders }: { orders: { data: Order[] } }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Calculate statistics
    const stats = useMemo(() => {
        const total = orders.data.length;
        const pendingPayment = orders.data.filter(
            (o) => o.status === 'pending_payment',
        ).length;
        const waitingConfirmation = orders.data.filter(
            (o) => o.status === 'waiting_confirmation',
        ).length;
        const revenue = orders.data
            .filter((o) => o.status === 'completed')
            .reduce((sum, o) => sum + o.total, 0);

        return { total, pendingPayment, waitingConfirmation, revenue };
    }, [orders.data]);

    // Filter and search orders
    const filteredOrders = useMemo(() => {
        return orders.data.filter((order) => {
            const matchesSearch =
                searchQuery === '' ||
                order.id.toString().includes(searchQuery) ||
                order.customer.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                order.customer.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders.data, searchQuery, statusFilter]);

    const statCards = [
        {
            title: 'Total Orders',
            value: stats.total,
            icon: Package,
            description: 'All time orders',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50/50 dark:bg-blue-900/20',
            iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        },
        {
            title: 'Pending Payment',
            value: stats.pendingPayment,
            icon: Clock,
            description: 'Awaiting payment',
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50/50 dark:bg-yellow-900/20',
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
        },
        {
            title: 'Needs Review',
            value: stats.waitingConfirmation,
            icon: AlertCircle,
            description: 'Payment proofs to verify',
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50/50 dark:bg-orange-900/20',
            iconBg: 'bg-orange-100 dark:bg-orange-900/50',
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(stats.revenue),
            icon: DollarSign,
            description: 'Completed orders',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50/50 dark:bg-green-900/20',
            iconBg: 'bg-green-100 dark:bg-green-900/50',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Orders Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card
                                key={card.title}
                                className={`overflow-hidden border-0 ${card.bgColor} shadow-sm`}
                            >
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${card.iconBg}`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 sm:h-6 sm:w-6 ${card.color}`}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                                                {card.title}
                                            </p>
                                            <p className="truncate text-lg font-bold sm:text-2xl">
                                                {card.value}
                                            </p>
                                            <p className="hidden text-xs text-muted-foreground sm:block">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Orders Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {/* Header */}
                    <div className="flex flex-col gap-4 border-b border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Manage Orders
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    View and manage customer orders
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row">
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search orders..."
                                        className="pl-8 md:w-[250px]"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="md:w-[180px]">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="pending_payment">
                                            Pending Payment
                                        </SelectItem>
                                        <SelectItem value="waiting_confirmation">
                                            Waiting Confirmation
                                        </SelectItem>
                                        <SelectItem value="paid">
                                            Paid
                                        </SelectItem>
                                        <SelectItem value="processing">
                                            Processing
                                        </SelectItem>
                                        <SelectItem value="shipped">
                                            Shipped
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    {filteredOrders.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={Package}
                                title={
                                    searchQuery || statusFilter !== 'all'
                                        ? 'No orders found'
                                        : 'No orders yet'
                                }
                                description={
                                    searchQuery || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Orders will appear here once customers start purchasing'
                                }
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-sidebar-border/70 bg-sidebar dark:border-sidebar-border">
                                    <tr>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Order ID
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Product
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Customer
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Date
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Total
                                        </th>
                                        <th className="p-4 text-left text-sm font-medium">
                                            Status
                                        </th>
                                        <th className="p-4 text-right text-sm font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-sidebar-border/70 transition-colors hover:bg-sidebar/50 dark:border-sidebar-border"
                                        >
                                            <td className="p-4">
                                                <span className="font-medium">
                                                    #{order.id}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                                        {order.order_items?.[0]
                                                            ?.book?.images?.[0]
                                                            ?.url ? (
                                                            <img
                                                                src={
                                                                    order
                                                                        .order_items[0]
                                                                        .book
                                                                        .images[0]
                                                                        .url
                                                                }
                                                                alt={
                                                                    order
                                                                        .order_items[0]
                                                                        .book
                                                                        .title
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600">
                                                                <BookOpen className="h-4 w-4 opacity-40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="line-clamp-1 max-w-[200px] font-medium">
                                                            {order
                                                                .order_items?.[0]
                                                                ?.book?.title ||
                                                                'Unknown Book'}
                                                        </span>
                                                        {order.order_items
                                                            .length > 1 && (
                                                            <span className="text-xs text-muted-foreground">
                                                                +
                                                                {order
                                                                    .order_items
                                                                    .length -
                                                                    1}{' '}
                                                                more item
                                                                {order
                                                                    .order_items
                                                                    .length > 2
                                                                    ? 's'
                                                                    : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                                        {order.customer.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                order.customer
                                                                    .name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                order.customer
                                                                    .email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {formatOrderDate(
                                                    order.order_date,
                                                )}
                                            </td>
                                            <td className="p-4 font-medium">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="p-4">
                                                <OrderStatusBadge
                                                    status={order.status}
                                                />
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

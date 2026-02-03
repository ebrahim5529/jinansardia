import clsx from "clsx";

interface StatusBadgeProps {
    status: "active" | "pending" | "inactive" | "banned" | string;
    label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
    const styles = {
        active: "bg-emerald-100 text-emerald-700 border-emerald-200",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        inactive: "bg-slate-100 text-slate-700 border-slate-200",
        banned: "bg-red-100 text-red-700 border-red-200",
    };

    // Default to inactive style if status key not found
    const style = styles[status as keyof typeof styles] || styles.inactive;

    const labels = {
        active: "نشط",
        pending: "قيد المراجعة",
        inactive: "غير نشط",
        banned: "محظور",
    };

    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium border", style)}>
            {label || labels[status as keyof typeof labels] || status}
        </span>
    );
}

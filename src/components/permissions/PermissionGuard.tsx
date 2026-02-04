"use client";

import { ReactNode } from "react";
import { Role, Permission, hasPermission } from "@/lib/permissions";

interface PermissionGuardProps {
    role: Role;
    permission: Permission;
    children: ReactNode;
    fallback?: ReactNode;
}

export function PermissionGuard({ role, permission, children, fallback = null }: PermissionGuardProps) {
    if (hasPermission(role, permission)) {
        return <>{children}</>;
    }
    return <>{fallback}</>;
}

interface RequireAllPermissionsProps {
    role: Role;
    permissions: Permission[];
    children: ReactNode;
    fallback?: ReactNode;
}

export function RequireAllPermissions({ role, permissions, children, fallback = null }: RequireAllPermissionsProps) {
    const hasAll = permissions.every(p => hasPermission(role, p));
    if (hasAll) {
        return <>{children}</>;
    }
    return <>{fallback}</>;
}

interface RequireAnyPermissionProps {
    role: Role;
    permissions: Permission[];
    children: ReactNode;
    fallback?: ReactNode;
}

export function RequireAnyPermission({ role, permissions, children, fallback = null }: RequireAnyPermissionProps) {
    const hasAny = permissions.some(p => hasPermission(role, p));
    if (hasAny) {
        return <>{children}</>;
    }
    return <>{fallback}</>;
}

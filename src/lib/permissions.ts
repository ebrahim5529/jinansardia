// نظام الصلاحيات والأدوار

export enum Role {
    SUPER_ADMIN = "Super Admin",
    FACTORY_MANAGER = "Factory Manager",
    HOSPITAL_ADMIN = "Hospital Admin",
    WAREHOUSE_STAFF = "Warehouse Staff",
    VIEWER = "Viewer"
}

export enum Permission {
    // Users Management
    VIEW_USERS = "view_users",
    CREATE_USERS = "create_users",
    EDIT_USERS = "edit_users",
    DELETE_USERS = "delete_users",
    
    // Factories Management
    VIEW_FACTORIES = "view_factories",
    CREATE_FACTORIES = "create_factories",
    EDIT_FACTORIES = "edit_factories",
    DELETE_FACTORIES = "delete_factories",
    
    // Hospitals Management
    VIEW_HOSPITALS = "view_hospitals",
    CREATE_HOSPITALS = "create_hospitals",
    EDIT_HOSPITALS = "edit_hospitals",
    DELETE_HOSPITALS = "delete_hospitals",
    
    // Orders Management
    VIEW_ORDERS = "view_orders",
    CREATE_ORDERS = "create_orders",
    EDIT_ORDERS = "edit_orders",
    DELETE_ORDERS = "delete_orders",
    
    // Reports
    VIEW_REPORTS = "view_reports",
    EXPORT_REPORTS = "export_reports",
    
    // Settings
    VIEW_SETTINGS = "view_settings",
    EDIT_SETTINGS = "edit_settings",
    
    // Warehouse
    VIEW_WAREHOUSE = "view_warehouse",
    MANAGE_WAREHOUSE = "manage_warehouse",
}

// تعريف الصلاحيات لكل دور
export const rolePermissions: Record<Role, Permission[]> = {
    [Role.SUPER_ADMIN]: [
        // جميع الصلاحيات
        Permission.VIEW_USERS,
        Permission.CREATE_USERS,
        Permission.EDIT_USERS,
        Permission.DELETE_USERS,
        Permission.VIEW_FACTORIES,
        Permission.CREATE_FACTORIES,
        Permission.EDIT_FACTORIES,
        Permission.DELETE_FACTORIES,
        Permission.VIEW_HOSPITALS,
        Permission.CREATE_HOSPITALS,
        Permission.EDIT_HOSPITALS,
        Permission.DELETE_HOSPITALS,
        Permission.VIEW_ORDERS,
        Permission.CREATE_ORDERS,
        Permission.EDIT_ORDERS,
        Permission.DELETE_ORDERS,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_REPORTS,
        Permission.VIEW_SETTINGS,
        Permission.EDIT_SETTINGS,
        Permission.VIEW_WAREHOUSE,
        Permission.MANAGE_WAREHOUSE,
    ],
    [Role.FACTORY_MANAGER]: [
        Permission.VIEW_FACTORIES,
        Permission.EDIT_FACTORIES,
        Permission.VIEW_ORDERS,
        Permission.CREATE_ORDERS,
        Permission.EDIT_ORDERS,
        Permission.VIEW_REPORTS,
        Permission.VIEW_SETTINGS,
    ],
    [Role.HOSPITAL_ADMIN]: [
        Permission.VIEW_HOSPITALS,
        Permission.EDIT_HOSPITALS,
        Permission.VIEW_ORDERS,
        Permission.CREATE_ORDERS,
        Permission.VIEW_REPORTS,
        Permission.VIEW_WAREHOUSE,
        Permission.MANAGE_WAREHOUSE,
    ],
    [Role.WAREHOUSE_STAFF]: [
        Permission.VIEW_ORDERS,
        Permission.VIEW_WAREHOUSE,
        Permission.MANAGE_WAREHOUSE,
    ],
    [Role.VIEWER]: [
        Permission.VIEW_USERS,
        Permission.VIEW_FACTORIES,
        Permission.VIEW_HOSPITALS,
        Permission.VIEW_ORDERS,
        Permission.VIEW_REPORTS,
    ],
};

// فحص الصلاحيات
export function hasPermission(role: Role, permission: Permission): boolean {
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
}

// فحص عدة صلاحيات (يجب أن يكون لديه جميع الصلاحيات)
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

// فحص عدة صلاحيات (يكفي أن يكون لديه واحدة على الأقل)
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

// الحصول على جميع الصلاحيات لدور معين
export function getRolePermissions(role: Role): Permission[] {
    return rolePermissions[role] || [];
}

// الحصول على جميع الأدوار
export function getAllRoles(): Role[] {
    return Object.values(Role);
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role, Permission, rolePermissions, getAllRoles, getRolePermissions } from "@/lib/permissions";
import { UserIcon, LockIcon } from "@/icons";

export default function PermissionsPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role>(Role.SUPER_ADMIN);
    const [isEditing, setIsEditing] = useState(false);
    const [customPermissions, setCustomPermissions] = useState<Permission[]>(getRolePermissions(selectedRole));

    const roles = getAllRoles();

    const allPermissions: { category: string; permissions: { key: Permission; label: string }[] }[] = [
        {
            category: "إدارة المستخدمين",
            permissions: [
                { key: Permission.VIEW_USERS, label: "عرض المستخدمين" },
                { key: Permission.CREATE_USERS, label: "إنشاء مستخدمين" },
                { key: Permission.EDIT_USERS, label: "تعديل المستخدمين" },
                { key: Permission.DELETE_USERS, label: "حذف المستخدمين" },
            ],
        },
        {
            category: "إدارة المصانع",
            permissions: [
                { key: Permission.VIEW_FACTORIES, label: "عرض المصانع" },
                { key: Permission.CREATE_FACTORIES, label: "إنشاء مصانع" },
                { key: Permission.EDIT_FACTORIES, label: "تعديل المصانع" },
                { key: Permission.DELETE_FACTORIES, label: "حذف المصانع" },
            ],
        },
        {
            category: "إدارة المستشفيات",
            permissions: [
                { key: Permission.VIEW_HOSPITALS, label: "عرض المستشفيات" },
                { key: Permission.CREATE_HOSPITALS, label: "إنشاء مستشفيات" },
                { key: Permission.EDIT_HOSPITALS, label: "تعديل المستشفيات" },
                { key: Permission.DELETE_HOSPITALS, label: "حذف المستشفيات" },
            ],
        },
        {
            category: "إدارة الطلبات",
            permissions: [
                { key: Permission.VIEW_ORDERS, label: "عرض الطلبات" },
                { key: Permission.CREATE_ORDERS, label: "إنشاء طلبات" },
                { key: Permission.EDIT_ORDERS, label: "تعديل الطلبات" },
                { key: Permission.DELETE_ORDERS, label: "حذف الطلبات" },
            ],
        },
        {
            category: "التقارير",
            permissions: [
                { key: Permission.VIEW_REPORTS, label: "عرض التقارير" },
                { key: Permission.EXPORT_REPORTS, label: "تصدير التقارير" },
            ],
        },
        {
            category: "الإعدادات",
            permissions: [
                { key: Permission.VIEW_SETTINGS, label: "عرض الإعدادات" },
                { key: Permission.EDIT_SETTINGS, label: "تعديل الإعدادات" },
            ],
        },
        {
            category: "المخزن",
            permissions: [
                { key: Permission.VIEW_WAREHOUSE, label: "عرض المخزن" },
                { key: Permission.MANAGE_WAREHOUSE, label: "إدارة المخزن" },
            ],
        },
    ];

    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        setCustomPermissions(getRolePermissions(role));
        setIsEditing(false);
    };

    const togglePermission = (permission: Permission) => {
        if (customPermissions.includes(permission)) {
            setCustomPermissions(customPermissions.filter(p => p !== permission));
        } else {
            setCustomPermissions([...customPermissions, permission]);
        }
    };

    const toggleCategory = (categoryPermissions: Permission[]) => {
        const allSelected = categoryPermissions.every(p => customPermissions.includes(p));
        if (allSelected) {
            setCustomPermissions(customPermissions.filter(p => !categoryPermissions.includes(p)));
        } else {
            const newPermissions = [...customPermissions];
            categoryPermissions.forEach(p => {
                if (!newPermissions.includes(p)) {
                    newPermissions.push(p);
                }
            });
            setCustomPermissions(newPermissions);
        }
    };

    const handleSave = () => {
        // API call to save custom permissions
        console.log("Saving permissions for role:", selectedRole, customPermissions);
        setIsEditing(false);
    };

    const handleReset = () => {
        setCustomPermissions(getRolePermissions(selectedRole));
        setIsEditing(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Link href="/users" className="hover:text-brand-500">
                        المستخدمين
                    </Link>
                    <span>/</span>
                    <span>إدارة الصلاحيات والأدوار</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    إدارة الصلاحيات والأدوار
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    إدارة الصلاحيات والأدوار الإدارية للمستخدمين
                </p>
            </div>

            {/* Role Selection */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">اختر الدور</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {roles.map((role) => (
                        <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                selectedRole === role
                                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    selectedRole === role
                                        ? "bg-brand-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                }`}>
                                    <LockIcon className="w-5 h-5" />
                                </div>
                                <div className="text-right">
                                    <p className={`font-medium ${selectedRole === role ? "text-brand-600 dark:text-brand-400" : "text-gray-900 dark:text-white"}`}>
                                        {role}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {getRolePermissions(role).length} صلاحية
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Permissions Management */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        صلاحيات دور: {selectedRole}
                    </h2>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                            >
                                تعديل الصلاحيات
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                                >
                                    حفظ التغييرات
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {allPermissions.map((category) => (
                        <div key={category.category} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white">{category.category}</h3>
                                {isEditing && (
                                    <button
                                        onClick={() => toggleCategory(category.permissions.map(p => p.key))}
                                        className="text-sm text-brand-500 hover:text-brand-600"
                                    >
                                        {category.permissions.every(p => customPermissions.includes(p.key)) ? "إلغاء تحديد الكل" : "تحديد الكل"}
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {category.permissions.map((permission) => {
                                    const hasPermission = customPermissions.includes(permission.key);
                                    return (
                                        <label
                                            key={permission.key}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                hasPermission
                                                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                                            } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={hasPermission}
                                                onChange={() => togglePermission(permission.key)}
                                                disabled={!isEditing}
                                                className="w-5 h-5 text-brand-500 rounded focus:ring-brand-500"
                                            />
                                            <span className={`flex-1 ${hasPermission ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                                {permission.label}
                                            </span>
                                            {hasPermission && (
                                                <svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Role Description */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">معلومات عن الدور</h3>
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                    {selectedRole === Role.SUPER_ADMIN && (
                        <p>المسؤول الأعلى لديه جميع الصلاحيات في النظام ويمكنه إدارة كل شيء.</p>
                    )}
                    {selectedRole === Role.FACTORY_MANAGER && (
                        <p>مدير المصنع يمكنه إدارة المصنع والطلبات المتعلقة به وعرض التقارير.</p>
                    )}
                    {selectedRole === Role.HOSPITAL_ADMIN && (
                        <p>مدير المستشفى يمكنه إدارة المستشفى والطلبات والمخزن.</p>
                    )}
                    {selectedRole === Role.WAREHOUSE_STAFF && (
                        <p>موظف المخزن يمكنه عرض وإدارة المخزن والطلبات.</p>
                    )}
                    {selectedRole === Role.VIEWER && (
                        <p>المشاهد يمكنه فقط عرض البيانات بدون إمكانية التعديل.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

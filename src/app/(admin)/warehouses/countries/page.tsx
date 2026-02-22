"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { LoadingScreen } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";

interface Country {
  id: string;
  name: string;
  code: string | null;
  _count?: { warehouses: number };
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const addCountryModal = useModal();
  const confirmDeleteModal = useModal();
  const successModal = useModal();
  const errorModal = useModal();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/countries");
      const data = await res.json();
      if (data.countries) setCountries(data.countries);
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleAddCountry = async () => {
    if (!countryName.trim()) return;
    try {
      const method = editingCountry ? "PATCH" : "POST";
      const res = await fetch("/api/admin/countries", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingCountry ? { id: editingCountry.id } : {}),
          name: countryName.trim(),
          code: countryCode.trim() ? countryCode.trim().toUpperCase() : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(editingCountry ? "تم تحديث الدولة بنجاح" : "تم إضافة الدولة بنجاح");
        successModal.openModal();
        addCountryModal.closeModal();
        setCountryName("");
        setCountryCode("");
        setEditingCountry(null);
        fetchCountries();
      } else {
        setErrorMessage(data.error || "فشل العملية");
        errorModal.openModal();
      }
    } catch {
      setErrorMessage("فشل العملية");
      errorModal.openModal();
    }
  };

  const openEditCountry = (country: Country) => {
    setEditingCountry(country);
    setCountryName(country.name);
    setCountryCode(country.code || "");
    addCountryModal.openModal();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/countries?id=${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("تم حذف الدولة بنجاح");
        confirmDeleteModal.closeModal();
        successModal.openModal();
        fetchCountries();
      } else {
        setErrorMessage(data.error || "فشل الحذف");
        confirmDeleteModal.closeModal();
        errorModal.openModal();
      }
    } catch {
      setErrorMessage("فشل الحذف");
      confirmDeleteModal.closeModal();
      errorModal.openModal();
    }
  };

  const requestDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    confirmDeleteModal.openModal();
  };

  if (loading) {
    return (
      <LoadingScreen
        fullScreen={false}
        overlay
        message="جاري تحميل الدول..."
        className="min-h-[400px] rounded-xl"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">إدارة الدول</h1>
        <p className="text-gray-600 dark:text-gray-400">إضافة وإدارة الدول التي تحتوي على مستودعات</p>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي الدول</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{countries.length}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الدول المسجلة</h3>
          <button
            onClick={() => {
              setCountryName("");
              setCountryCode("");
              setEditingCountry(null);
              addCountryModal.openModal();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إضافة دولة
          </button>
        </div>

        {countries.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">لا توجد دول مسجلة</p>
            <p className="text-sm mt-1">أضف دولة جديدة للبدء</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country) => (
              <div key={country.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{country.name}</h4>
                    </div>
                    {country.code && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mr-7">الرمز: {country.code}</p>
                    )}
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 mr-7">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30">
                        {country._count?.warehouses || 0} مستودع
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditCountry(country)}
                      className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => requestDelete(country.id, country.name)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Country Modal */}
      <Modal isOpen={addCountryModal.isOpen} onClose={addCountryModal.closeModal} className="max-w-lg w-full p-6 mx-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingCountry ? "تعديل الدولة" : "إضافة دولة جديدة"}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم الدولة *</label>
            <input
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="مثال: المملكة العربية السعودية"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رمز الدولة (اختياري)</label>
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="مثال: SA"
              maxLength={5}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddCountry}
              disabled={!countryName.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingCountry ? "حفظ التعديلات" : "إضافة الدولة"}
            </button>
            <button
              onClick={addCountryModal.closeModal}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal isOpen={confirmDeleteModal.isOpen} onClose={confirmDeleteModal.closeModal} className="max-w-md w-full p-6 mx-4">
        <div className="space-y-4 text-center">
          <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">تأكيد الحذف</h3>
          <p className="text-gray-600 dark:text-gray-400">
            هل أنت متأكد من حذف <strong>&quot;{deleteTarget?.name}&quot;</strong>؟ سيتم حذف جميع المستودعات المرتبطة بها.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              نعم، احذف
            </button>
            <button
              onClick={confirmDeleteModal.closeModal}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={successModal.isOpen} onClose={successModal.closeModal} className="max-w-sm w-full p-6 mx-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{successMessage}</p>
          <button
            onClick={successModal.closeModal}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            حسناً
          </button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal isOpen={errorModal.isOpen} onClose={errorModal.closeModal} className="max-w-sm w-full p-6 mx-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{errorMessage}</p>
          <button
            onClick={errorModal.closeModal}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            حسناً
          </button>
        </div>
      </Modal>
    </div>
  );
}

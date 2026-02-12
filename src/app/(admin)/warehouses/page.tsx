"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

interface Country {
  id: string;
  name: string;
  code: string | null;
  _count?: { warehouses: number };
}

interface Product {
  id: string;
  name: string;
  category: string | null;
  price: number;
}

interface StockItem {
  id: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  product: Product;
  updatedAt: string;
}

interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  countryId: string;
  country: Country;
  createdAt: string;
  stocks: StockItem[];
  _count: { stocks: number };
}

export default function WarehousesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCountryFilter, setSelectedCountryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [warehouseCountryId, setWarehouseCountryId] = useState("");
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

  const [stockWarehouseId, setStockWarehouseId] = useState("");
  const [stockProductId, setStockProductId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const addWarehouseModal = useModal();
  const addStockModal = useModal();
  const stockViewModal = useModal();
  const confirmDeleteModal = useModal();
  const successModal = useModal();
  const errorModal = useModal();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/countries");
      const data = await res.json();
      if (data.countries) setCountries(data.countries);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  }, []);

  const fetchWarehouses = useCallback(async () => {
    try {
      const url = selectedCountryFilter
        ? `/api/admin/warehouses?countryId=${selectedCountryFilter}`
        : "/api/admin/warehouses";
      const res = await fetch(url);
      const data = await res.json();
      if (data.warehouses) setWarehouses(data.warehouses);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  }, [selectedCountryFilter]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCountries(), fetchWarehouses(), fetchProducts()]);
      setLoading(false);
    };
    loadData();
  }, [fetchCountries, fetchWarehouses, fetchProducts]);

  useEffect(() => {
    fetchWarehouses();
  }, [selectedCountryFilter, fetchWarehouses]);

  const handleAddWarehouse = async () => {
    if (!warehouseName.trim() || !warehouseCountryId) return;
    try {
      const method = editingWarehouse ? "PATCH" : "POST";
      const body = editingWarehouse
        ? { id: editingWarehouse.id, name: warehouseName, location: warehouseLocation, countryId: warehouseCountryId }
        : { name: warehouseName, location: warehouseLocation, countryId: warehouseCountryId };

      const res = await fetch("/api/admin/warehouses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(editingWarehouse ? "تم تحديث المستودع بنجاح" : "تم إضافة المستودع بنجاح");
        successModal.openModal();
        addWarehouseModal.closeModal();
        resetWarehouseForm();
        fetchWarehouses();
      } else {
        setErrorMessage(data.error || "فشل العملية");
        errorModal.openModal();
      }
    } catch {
      setErrorMessage("فشل العملية");
      errorModal.openModal();
    }
  };

  const resetWarehouseForm = () => {
    setWarehouseName("");
    setWarehouseLocation("");
    setWarehouseCountryId("");
    setEditingWarehouse(null);
  };

  const openEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setWarehouseName(warehouse.name);
    setWarehouseLocation(warehouse.location || "");
    setWarehouseCountryId(warehouse.countryId);
    addWarehouseModal.openModal();
  };

  const handleAddStock = async () => {
    const wId = stockWarehouseId || selectedWarehouse?.id;
    if (!wId || !stockProductId) return;
    try {
      const method = editingStock ? "PATCH" : "POST";
      const body = editingStock
        ? { id: editingStock.id, quantity: parseInt(stockQuantity) || 0 }
        : { warehouseId: wId, productId: stockProductId, quantity: parseInt(stockQuantity) || 0 };

      const res = await fetch("/api/admin/warehouse-stock", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(editingStock ? "تم تحديث الكمية بنجاح" : "تم إضافة المنتج للمستودع بنجاح");
        successModal.openModal();
        addStockModal.closeModal();
        setStockProductId("");
        setStockQuantity("");
        setEditingStock(null);
        fetchWarehouses();
        if (selectedWarehouse) {
          const res2 = await fetch("/api/admin/warehouses");
          const data2 = await res2.json();
          if (data2.warehouses) {
            const updated = data2.warehouses.find((w: Warehouse) => w.id === selectedWarehouse.id);
            if (updated) setSelectedWarehouse(updated);
          }
        }
      } else {
        setErrorMessage(data.error || "فشل العملية");
        errorModal.openModal();
      }
    } catch {
      setErrorMessage("فشل العملية");
      errorModal.openModal();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      let url = "";
      if (deleteTarget.type === "warehouse") url = `/api/admin/warehouses?id=${deleteTarget.id}`;
      else if (deleteTarget.type === "stock") url = `/api/admin/warehouse-stock?id=${deleteTarget.id}`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("تم الحذف بنجاح");
        confirmDeleteModal.closeModal();
        successModal.openModal();
        fetchWarehouses();
        if (selectedWarehouse && deleteTarget.type === "stock") {
          const res2 = await fetch("/api/admin/warehouses");
          const data2 = await res2.json();
          if (data2.warehouses) {
            const updated = data2.warehouses.find((w: Warehouse) => w.id === selectedWarehouse.id);
            if (updated) setSelectedWarehouse(updated);
          }
        }
        if (deleteTarget.type === "warehouse" && selectedWarehouse?.id === deleteTarget.id) {
          setSelectedWarehouse(null);
          stockViewModal.closeModal();
        }
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

  const requestDelete = (type: string, id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    confirmDeleteModal.openModal();
  };

  const openStockView = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setStockWarehouseId(warehouse.id);
    stockViewModal.openModal();
  };

  const openAddStockForWarehouse = () => {
    setEditingStock(null);
    setStockProductId("");
    setStockQuantity("");
    addStockModal.openModal();
  };

  const openEditStock = (stock: StockItem) => {
    setEditingStock(stock);
    setStockQuantity(stock.quantity.toString());
    addStockModal.openModal();
  };

  const filteredWarehouses = warehouses.filter((w) => {
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      (w.location && w.location.toLowerCase().includes(q)) ||
      w.country.name.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">إدارة المستودعات</h1>
        <p className="text-gray-600 dark:text-gray-400">إدارة المستودعات والمخزون</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">الدول</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{countries.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">المستودعات</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{warehouses.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">المنتجات</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouses Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="space-y-4">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <input
                type="text"
                placeholder="بحث في المستودعات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">كل الدول</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                resetWarehouseForm();
                addWarehouseModal.openModal();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة مستودع
            </button>
          </div>

          {/* Warehouses Table */}
          {filteredWarehouses.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-lg font-medium">لا توجد مستودعات</p>
              <p className="text-sm mt-1">أضف مستودعاً جديداً للبدء</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">اسم المستودع</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">الموقع</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">الدولة</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">عدد المنتجات</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">تاريخ الإنشاء</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarehouses.map((warehouse) => (
                    <tr key={warehouse.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">{warehouse.name}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{warehouse.location || "—"}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {warehouse.country.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {warehouse._count.stocks} منتج
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {new Date(warehouse.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openStockView(warehouse)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="عرض المخزون"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditWarehouse(warehouse)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => requestDelete("warehouse", warehouse.id, warehouse.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Add/Edit Warehouse Modal */}
      <Modal isOpen={addWarehouseModal.isOpen} onClose={addWarehouseModal.closeModal} className="max-w-lg w-full p-6 mx-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingWarehouse ? "تعديل المستودع" : "إضافة مستودع جديد"}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المستودع *</label>
            <input
              type="text"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: مستودع الرياض الرئيسي"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموقع</label>
            <input
              type="text"
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: حي الصناعية، الرياض"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الدولة *</label>
            <select
              value={warehouseCountryId}
              onChange={(e) => setWarehouseCountryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر الدولة</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {countries.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">يجب إضافة دولة أولاً من صفحة &quot;الدول&quot;</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddWarehouse}
              disabled={!warehouseName.trim() || !warehouseCountryId}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingWarehouse ? "حفظ التعديلات" : "إضافة المستودع"}
            </button>
            <button
              onClick={addWarehouseModal.closeModal}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>

      {/* Stock View Modal */}
      <Modal isOpen={stockViewModal.isOpen} onClose={stockViewModal.closeModal} className="max-w-3xl w-full p-6 mx-4">
        {selectedWarehouse && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  مخزون: {selectedWarehouse.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedWarehouse.country.name} {selectedWarehouse.location ? `- ${selectedWarehouse.location}` : ""}
                </p>
              </div>
              <button
                onClick={openAddStockForWarehouse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إضافة منتج للمخزون
              </button>
            </div>

            {selectedWarehouse.stocks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>لا توجد منتجات في هذا المستودع</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">المنتج</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">التصنيف</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">الكمية</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">آخر تحديث</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWarehouse.stocks.map((stock) => (
                      <tr key={stock.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{stock.product.name}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{stock.product.category || "—"}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stock.quantity > 100
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : stock.quantity > 0
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {stock.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(stock.updatedAt).toLocaleDateString("ar-SA")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditStock(stock)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                              title="تعديل الكمية"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => requestDelete("stock", stock.id, stock.product.name)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add/Edit Stock Modal */}
      <Modal isOpen={addStockModal.isOpen} onClose={addStockModal.closeModal} className="max-w-lg w-full p-6 mx-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingStock ? "تعديل الكمية" : "إضافة منتج للمخزون"}
          </h2>
          {!editingStock && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المنتج *</label>
              <select
                value={stockProductId}
                onChange={(e) => setStockProductId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر المنتج</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} {p.category ? `(${p.category})` : ""}</option>
                ))}
              </select>
              {products.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">يجب إضافة منتجات أولاً من صفحة &quot;المنتجات&quot;</p>
              )}
            </div>
          )}
          {editingStock && (
            <p className="text-gray-600 dark:text-gray-400">المنتج: <strong>{editingStock.product.name}</strong></p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الكمية *</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddStock}
              disabled={!editingStock && !stockProductId}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingStock ? "حفظ التعديلات" : "إضافة للمخزون"}
            </button>
            <button
              onClick={addStockModal.closeModal}
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
            هل أنت متأكد من حذف <strong>&quot;{deleteTarget?.name}&quot;</strong>؟ لا يمكن التراجع عن هذا الإجراء.
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

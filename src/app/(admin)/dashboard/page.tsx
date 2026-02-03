import KPICard from "@/components/admin/KPICard";
import { OrdersChart, StatusChart } from "@/components/admin/DashboardCharts";
import { GridIcon, PlusIcon, TaskIcon, UserIcon } from "@/icons";

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">نظرة عامة</h2>
                <p className="text-slate-500">ملخص ومؤشرات الأداء للنظام.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="المصانع المسجلة"
                    value="24"
                    icon={<GridIcon className="w-6 h-6" />}
                    trend="12%"
                    trendUp={true}
                    color="blue"
                />
                <KPICard
                    title="المستشفيات النشطة"
                    value="56"
                    icon={<PlusIcon className="w-6 h-6" />}
                    trend="5%"
                    trendUp={true}
                    color="green"
                />
                <KPICard
                    title="إجمالي الطلبات"
                    value="1,245"
                    icon={<TaskIcon className="w-6 h-6" />}
                    trend="18%"
                    trendUp={true}
                    color="purple"
                />
                <KPICard
                    title="مستخدمين جدد"
                    value="12"
                    icon={<UserIcon className="w-6 h-6" />}
                    trend="2%"
                    trendUp={false}
                    color="orange"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <OrdersChart />
                </div>
                <div>
                    <StatusChart />
                </div>
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">آخر النشاطات</h3>
                    <button className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">عرض الكل</button>
                </div>
                <div className="space-y-3">
                    {[
                        { id: 1024, text: 'طلب جديد من مستشفى "الأمل"', time: 'منذ 2 ساعة', amount: '2,500 ريال', status: 'قيد الانتظار', color: 'yellow' },
                        { id: 1023, text: 'تسجيل مصنع "الخليج للأدوية"', time: 'منذ 5 ساعات', amount: '-', status: 'مفعل', color: 'green' },
                        { id: 1022, text: 'اكتمال طلب #998', time: 'أمس', amount: '15,400 ريال', status: 'مكتمل', color: 'blue' },
                        { id: 1021, text: 'تحذير انخفاض مخزون "باراسيتامول"', time: 'أمس', amount: 'المخزن الرئيسي', status: 'تنبيه', color: 'red' },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-default group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm group-hover:scale-110 transition-transform">
                                    {item.status === 'تنبيه' ? '!' : '#'}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{item.text}</p>
                                    <p className="text-xs text-slate-500">{item.time} • {item.amount}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-700`}>
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حساب قيد المراجعة | JinanSardia",
  description: "حسابك قيد المراجعة من قبل الإدارة",
};

export default function AccountPendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              حسابك قيد المراجعة
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              شكراً لتسجيلك في منصة جينان سارديا
            </p>
          </div>

          <div className="space-y-4 text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              تم إنشاء حسابك بنجاح، وهو الآن قيد المراجعة من قبل فريق الإدارة.
              سيتم تفعيل حسابك قريباً وستتلقى إشعاراً عند تفعيله.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              يمكنك محاولة تسجيل الدخول لاحقاً بعد تفعيل حسابك من قبل الإدارة.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/signin"
              className="block w-full px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors text-center"
            >
              العودة لصفحة تسجيل الدخول
            </Link>
            <Link
              href="/"
              className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors text-center"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


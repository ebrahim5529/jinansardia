"use client";

import React, { useEffect, useState } from "react";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function HospitalSettingsPage() {
  const [locale, setLocale] = useState<Locale>("ar");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    newRequests: true,
    statusUpdates: true,
    warehouseUpdates: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    const currentLocale = getCookie("NEXT_LOCALE") as Locale;
    if (currentLocale === "en" || currentLocale === "ar") {
      setLocale(currentLocale);
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }, 1500);
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t(locale, "hospital.settings.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t(locale, "hospital.settings.description")}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {t(locale, "hospital.settings.account")}
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t(locale, "hospital.settings.email")}
          </label>
          <input
            type="email"
            value="hospital@example.com"
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t(locale, "hospital.settings.emailNote")}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {t(locale, "hospital.settings.security")}
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t(locale, "hospital.settings.currentPassword")}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t(locale, "hospital.settings.newPassword")}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t(locale, "hospital.settings.confirmPassword")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={
              isChangingPassword ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isChangingPassword
              ? t(locale, "hospital.settings.changingPassword")
              : t(locale, "hospital.settings.changePassword")}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {t(locale, "hospital.settings.notifications")}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t(locale, "hospital.settings.newRequestsNotif")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(locale, "hospital.settings.newRequestsDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newRequests}
                onChange={() => handleNotificationToggle("newRequests")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t(locale, "hospital.settings.statusUpdatesNotif")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(locale, "hospital.settings.statusUpdatesDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.statusUpdates}
                onChange={() => handleNotificationToggle("statusUpdates")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t(locale, "hospital.settings.warehouseUpdatesNotif")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(locale, "hospital.settings.warehouseUpdatesDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.warehouseUpdates}
                onChange={() => handleNotificationToggle("warehouseUpdates")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t(locale, "hospital.settings.emailNotif")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(locale, "hospital.settings.emailDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationToggle("emailNotifications")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t(locale, "hospital.settings.smsNotif")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(locale, "hospital.settings.smsDesc")}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsNotifications}
                onChange={() => handleNotificationToggle("smsNotifications")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-error-900 dark:text-error-200 mb-4">
          {t(locale, "hospital.settings.dangerZone")}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-error-900 dark:text-error-200">
              {t(locale, "hospital.settings.deactivateAccount")}
            </p>
            <p className="text-sm text-error-700 dark:text-error-300 mt-1">
              {t(locale, "hospital.settings.deactivateDesc")}
            </p>
          </div>
          <button className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors font-medium">
            {t(locale, "hospital.settings.deactivateAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}

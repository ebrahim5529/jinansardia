import { Noto_Sans_Arabic, Outfit } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import AuthSessionProvider from '@/context/AuthSessionProvider';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

const outfit = Outfit({
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["600"],
  style: "normal",
  variable: "--font-noto-sans-arabic",
});

import ToastProvider from '@/components/providers/ToastProvider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = localeCookie === 'ar' ? 'ar' : 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClassName = locale === 'ar' ? notoSansArabic.className : outfit.className;

  return (
    <html lang={locale} dir={dir} className={locale === 'ar' ? notoSansArabic.variable : ''}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
        />
      </head>
      <body className={`${fontClassName} dark:bg-gray-900`}>
        <AuthSessionProvider>
          <ThemeProvider>
            <ToastProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

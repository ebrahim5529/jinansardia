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
// #region agent log
  console.log('DEBUG: RootLayout Locale/Dir', { locale, dir });
  fetch('http://127.0.0.1:7732/ingest/38974f4f-fb7c-47a7-8a89-84aebd4fa6dd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6bd7a9'},body:JSON.stringify({sessionId:'6bd7a9',location:'layout.tsx:31',message:'RootLayout Locale/Dir',data:{locale,dir},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
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

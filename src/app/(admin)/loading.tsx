import { LoadingScreen } from "@/components/ui/loader";

export default function AdminLoading() {
  return (
    <LoadingScreen
      fullScreen={false}
      overlay
      message="جاري التحميل..."
      className="min-h-[400px] rounded-xl"
    />
  );
}

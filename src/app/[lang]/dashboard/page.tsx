import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "لوحة التحكم | عيادة د. داليا عبد الموجود زريع",
  description:
    "لوحة التحكم الخاصة بموقع عيادة الدكتورة داليا عبد الموجود زريع - نظرة عامة على الأداء وإدارة المقالات الطبية.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocalizedDashboardPage() {
  return <DashboardClient />;
}

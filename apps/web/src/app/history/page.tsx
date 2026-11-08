import { AppShell } from "@/components/layout/app-shell";
import { HistoryList } from "@/features/visits/components/history-list";

export default function HistoryPage() {
  return (
    <AppShell>
      <HistoryList />
    </AppShell>
  );
}

import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  // Query for unique visitors count
  const { data: visitorsCount = 0, isLoading: isLoadingVisitors } = useQuery({
    queryKey: ['uniqueVisitors'],
    queryFn: async () => {
      const { count } = await supabase
        .from('page_visits')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Query for ticket button clicks count
  const { data: ticketClicksCount = 0, isLoading: isLoadingClicks } = useQuery({
    queryKey: ['ticketClicks'],
    queryFn: async () => {
      const { count } = await supabase
        .from('ticket_button_clicks')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visitors Card */}
          <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Visiteurs Uniques
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {isLoadingVisitors ? (
                  <div className="h-8 w-24 animate-pulse bg-gray-200 rounded" />
                ) : (
                  visitorsCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total des visites sur le site
              </p>
            </CardContent>
          </Card>

          {/* Ticket Clicks Card */}
          <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clics sur Billetterie
              </CardTitle>
              <Ticket className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {isLoadingClicks ? (
                  <div className="h-8 w-24 animate-pulse bg-gray-200 rounded" />
                ) : (
                  ticketClicksCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total des clics sur "Acheter des tickets"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
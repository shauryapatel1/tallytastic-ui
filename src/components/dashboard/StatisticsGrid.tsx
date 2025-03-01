
import { motion } from "framer-motion";
import { StatisticsCard } from "./StatisticsCard";
import { BarChart, Box, Clock, Grid } from "lucide-react";

interface StatisticsGridProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    responses: number;
  };
}

export const StatisticsGrid = ({ stats }: StatisticsGridProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <StatisticsCard 
        title="Total Forms"
        value={stats.total}
        icon={Grid}
        iconColor="text-indigo-600"
        iconBgColor="bg-indigo-100"
      />
      
      <StatisticsCard
        title="Published"
        value={stats.published}
        icon={Box}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
      />
      
      <StatisticsCard
        title="Drafts"
        value={stats.draft}
        icon={Clock}
        iconColor="text-amber-600"
        iconBgColor="bg-amber-100"
      />
      
      <StatisticsCard
        title="Total Responses"
        value={stats.responses}
        icon={BarChart}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
      />
    </motion.div>
  );
};

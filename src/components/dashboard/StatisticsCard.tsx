
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export const StatisticsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor 
}: StatisticsCardProps) => {
  return (
    <motion.div 
      className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -5, boxShadow: "0 12px 20px -10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${iconBgColor} p-2 rounded-md`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
};

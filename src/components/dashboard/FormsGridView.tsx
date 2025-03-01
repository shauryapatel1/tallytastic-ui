
import { Form } from "@/lib/types";
import { FormCard } from "./FormCard";
import { motion } from "framer-motion";

interface FormsGridViewProps {
  forms: Form[];
}

export const FormsGridView = ({ forms }: FormsGridViewProps) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{ 
        visible: { 
          transition: { 
            staggerChildren: 0.1
          } 
        } 
      }}
    >
      {forms.map((form) => (
        <motion.div
          key={form.id}
          variants={itemVariants}
          transition={{ 
            duration: 0.4,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FormCard form={form} />
        </motion.div>
      ))}
    </motion.div>
  );
};

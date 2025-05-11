
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LightbulbIcon, ZapIcon, ShieldCheckIcon } from "lucide-react";

const benefits = [
  {
    icon: <LightbulbIcon className="h-6 w-6" />,
    title: "Intelligent Form Creation",
    description: "Our AI generates forms tailored to your specific needs, saving you hours of design time."
  },
  {
    icon: <ZapIcon className="h-6 w-6" />,
    title: "Lightning Fast Setup",
    description: "Get your form up and running in minutes, not days, with our intuitive drag-and-drop builder."
  },
  {
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    title: "Enterprise-Grade Security",
    description: "Your data is protected with industry-leading encryption and compliance measures."
  }
];

export const Benefits = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700 bg-indigo-50 mb-4">
            Why Choose FormCraft
          </Badge>
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Benefits that make a difference
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto">
            FormCraft combines powerful features with simplicity to deliver the ultimate form building experience.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
              <p className="text-primary/70">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

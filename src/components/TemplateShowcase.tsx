
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Template categories with sample templates
const templateCategories = [
  {
    category: "Business",
    templates: [
      { name: "Contact Form", color: "#4F46E5" },
      { name: "Feedback Survey", color: "#7C3AED" },
      { name: "Job Application", color: "#8B5CF6" }
    ]
  },
  {
    category: "Events",
    templates: [
      { name: "Event Registration", color: "#EC4899" },
      { name: "RSVP Form", color: "#D946EF" },
      { name: "Ticket Booking", color: "#F472B6" }
    ]
  },
  {
    category: "Education",
    templates: [
      { name: "Course Enrollment", color: "#10B981" },
      { name: "Quiz Form", color: "#059669" },
      { name: "Student Feedback", color: "#34D399" }
    ]
  }
];

export const TemplateShowcase = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700 bg-indigo-50 mb-4">
            Ready-to-Use Templates
          </Badge>
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Start with professionally designed templates
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto">
            Choose from our library of templates designed for every use case and customize them to match your brand.
          </p>
        </div>
        
        <div className="space-y-12">
          {templateCategories.map((category, categoryIndex) => (
            <motion.div 
              key={category.category}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-xl font-medium text-center mb-6">{category.category} Templates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.templates.map((template, templateIndex) => (
                  <motion.div
                    key={template.name}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (categoryIndex * 0.1) + (templateIndex * 0.05) }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md border border-gray-100">
                      {/* Template preview background with gradient */}
                      <div 
                        className="h-48 w-full"
                        style={{ 
                          background: `linear-gradient(135deg, ${template.color}22, ${template.color}44)`,
                        }}
                      >
                        {/* Template mock content */}
                        <div className="p-6">
                          <div className="w-2/3 h-4 mb-3 rounded bg-white/50"></div>
                          <div className="w-4/5 h-8 mb-4 rounded bg-white/60"></div>
                          <div className="w-full h-6 mb-3 rounded bg-white/40"></div>
                          <div className="w-full h-6 mb-3 rounded bg-white/40"></div>
                          <div className="w-1/2 h-8 mt-6 rounded" style={{ background: template.color }}></div>
                        </div>
                      </div>
                      
                      {/* Template name */}
                      <div className="p-4 bg-white">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-500">Fully customizable</p>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          className="bg-white hover:bg-gray-100"
                          onClick={() => navigate("/auth")}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Explore all templates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};


import { Check } from "lucide-react";

const features = [
  {
    title: "Intuitive Builder",
    description: "Drag and drop interface makes form creation a breeze",
  },
  {
    title: "Smart Templates",
    description: "Start with professionally designed templates",
  },
  {
    title: "Real-time Preview",
    description: "See changes as you make them",
  },
  {
    title: "Advanced Logic",
    description: "Create dynamic forms with conditional logic",
  },
  {
    title: "File Uploads",
    description: "Securely collect files from respondents",
  },
  {
    title: "Custom Styling",
    description: "Match your brand with custom themes",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Everything you need to create perfect forms
          </h2>
          <p className="text-primary/60">
            Powerful features that make form building effortless
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-primary/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

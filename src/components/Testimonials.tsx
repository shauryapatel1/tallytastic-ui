
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
};

const Testimonial = ({ quote, author, role }: TestimonialProps) => {
  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4 text-primary/40">
          <Quote className="h-6 w-6" />
        </div>
        <p className="text-primary/80 italic mb-6 flex-1">{quote}</p>
        <div>
          <p className="font-semibold text-primary">{author}</p>
          <p className="text-sm text-primary/60">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const Testimonials = () => {
  const testimonials = [
    {
      quote: "FormCraft revolutionized how we collect data. The intuitive interface saved us countless hours of development time.",
      author: "Sarah Johnson",
      role: "Product Manager, TechFlow"
    },
    {
      quote: "I've tried many form builders, but none compare to FormCraft's combination of simplicity and powerful features.",
      author: "Alex Rodriguez",
      role: "Marketing Director, GrowthLabs"
    },
    {
      quote: "The conditional logic feature is a game-changer. Our forms now feel like they were custom-coded, but took minutes to build.",
      author: "Michael Chen",
      role: "UX Designer, DesignHub"
    }
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Loved by creators everywhere
          </h2>
          <p className="text-primary/60">
            See why thousands choose FormCraft for their form needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

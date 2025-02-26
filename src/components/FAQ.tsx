
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How easy is it to get started with FormCraft?",
    answer: "Very easy! You can create your first form in minutes without any coding knowledge. Simply sign up for a free account, choose a template or start from scratch, and customize your form using our intuitive drag-and-drop builder."
  },
  {
    question: "Can I customize the look and feel of my forms?",
    answer: "Absolutely! FormCraft offers extensive customization options. You can change colors, fonts, add your logo, and adjust the layout to match your brand identity. With the Professional and Enterprise plans, you get even more advanced branding options."
  },
  {
    question: "What types of forms can I create?",
    answer: "FormCraft is versatile and supports a wide range of form types including contact forms, surveys, registration forms, application forms, order forms, feedback forms, and more. With conditional logic, you can create dynamic forms that adapt to user input."
  },
  {
    question: "How do I receive form submissions?",
    answer: "Form submissions are stored securely in your FormCraft dashboard. You can also set up email notifications to receive submissions instantly. Additionally, you can export submissions to CSV or connect with other tools via our integrations."
  },
  {
    question: "Is FormCraft secure?",
    answer: "Yes, security is our priority. FormCraft uses encryption to protect data in transit and at rest. All forms are hosted on secure servers, and we comply with data protection regulations. Enterprise plans include additional security features like SSO and advanced data retention policies."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with FormCraft, simply contact our support team within 14 days of your purchase for a full refund, no questions asked."
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-primary/60">
            Everything you need to know about FormCraft
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 py-1">
                <AccordionTrigger className="text-left font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-primary/70 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

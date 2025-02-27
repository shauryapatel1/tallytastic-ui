
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  FileText, 
  MessageSquare, 
  CreditCard, 
  CalendarDays, 
  ClipboardCheck, 
  HandHeart 
} from "lucide-react";

const useCases = [
  {
    id: "contact",
    title: "Contact Form",
    description: "Collect customer inquiries professionally",
    icon: <MessageSquare className="h-6 w-6" />,
    screenshot: "/placeholder.svg",
    features: ["Custom fields", "File attachments", "Auto-responders", "Spam protection"],
    preview: (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your full name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea className="w-full px-3 py-2 border rounded-md h-24 resize-none" placeholder="How can we help you?"></textarea>
        </div>
        <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Submit</button>
      </div>
    )
  },
  {
    id: "survey",
    title: "Feedback Survey",
    description: "Collect valuable customer insights",
    icon: <ClipboardCheck className="h-6 w-6" />,
    screenshot: "/placeholder.svg",
    features: ["Rating scales", "Multiple choice", "Logic jumps", "Response analytics"],
    preview: (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Customer Satisfaction Survey</h3>
          <p className="text-sm text-gray-500">Please rate your experience with our service</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">How would you rate our service?</label>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-indigo-50 cursor-pointer">{num}</div>
                {num === 1 && <span className="text-xs mt-1">Poor</span>}
                {num === 5 && <span className="text-xs mt-1">Excellent</span>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">What could we improve?</label>
          <textarea className="w-full px-3 py-2 border rounded-md h-24 resize-none" placeholder="Please share your thoughts..."></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Would you recommend us to others?</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" name="recommend" className="mr-2" />
              <span>Yes</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="recommend" className="mr-2" />
              <span>No</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="recommend" className="mr-2" />
              <span>Maybe</span>
            </label>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "event",
    title: "Event Registration",
    description: "Streamline attendee sign-ups",
    icon: <CalendarDays className="h-6 w-6" />,
    screenshot: "/placeholder.svg",
    features: ["Custom tickets", "Calendar integration", "Attendee management", "Email confirmations"],
    preview: (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Conference Registration</h3>
          <p className="text-sm text-gray-500">Register for our annual tech conference</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ticket Type</label>
          <select className="w-full px-3 py-2 border rounded-md">
            <option>General Admission ($99)</option>
            <option>VIP ($199)</option>
            <option>Workshop Bundle ($299)</option>
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Sign me up for event updates</span>
          </label>
        </div>
        <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Register Now</button>
      </div>
    )
  },
  {
    id: "payment",
    title: "Payment Form",
    description: "Collect payments securely",
    icon: <CreditCard className="h-6 w-6" />,
    screenshot: "/placeholder.svg",
    features: ["Secure payment processing", "Multiple payment methods", "Invoice generation", "Subscription options"],
    preview: (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Secure Payment</h3>
          <p className="text-sm text-gray-500">Complete your purchase securely</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="0000 0000 0000 0000" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="MM/YY" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Security Code</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="CVC" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name on Card</label>
          <input type="text" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$99.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tax</span>
            <span>$9.90</span>
          </div>
          <div className="flex justify-between font-medium mt-2 pt-2 border-t">
            <span>Total</span>
            <span>$108.90</span>
          </div>
        </div>
        <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Pay Now</button>
      </div>
    )
  },
  {
    id: "donation",
    title: "Donation Form",
    description: "Accept charitable contributions",
    icon: <HandHeart className="h-6 w-6" />,
    screenshot: "/placeholder.svg",
    features: ["Multiple donation amounts", "Recurring options", "Tax receipts", "Campaign tracking"],
    preview: (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Support Our Cause</h3>
          <p className="text-sm text-gray-500">Your donation makes a difference</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Donation Amount</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button className="py-2 border rounded-md hover:bg-indigo-50">$25</button>
            <button className="py-2 border rounded-md bg-indigo-50 border-indigo-200">$50</button>
            <button className="py-2 border rounded-md hover:bg-indigo-50">$100</button>
          </div>
          <div>
            <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Custom amount" />
          </div>
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Make this a monthly donation</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Donor Information</label>
          <input type="text" className="w-full px-3 py-2 border rounded-md mb-2" placeholder="Full Name" />
          <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="Email Address" />
        </div>
        <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Donate Now</button>
      </div>
    )
  },
  {
    id: "application",
    title: "Job Application",
    description: "Streamline your hiring process",
    icon: <FileText className="h-6 w-6" />,
    screenshot: "/placeholder.svg",
    features: ["Resume uploads", "Custom questions", "Applicant tracking", "Automated responses"],
    preview: (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Software Developer Application</h3>
          <p className="text-sm text-gray-500">Join our growing team</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resume</label>
          <div className="border-2 border-dashed rounded-md p-4 text-center text-sm text-gray-500">
            <p>Drag and drop your resume here, or click to browse</p>
            <p className="mt-1 text-xs">PDF, DOC, or DOCX up to 5MB</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Why do you want to work with us?</label>
          <textarea className="w-full px-3 py-2 border rounded-md h-24 resize-none"></textarea>
        </div>
        <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Submit Application</button>
      </div>
    )
  },
];

export const UseCaseDemo = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700 bg-indigo-50 mb-4">
            Use Cases
          </Badge>
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            See FormCraft in action
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto">
            Explore how FormCraft can power virtually any type of form you need, from simple contact forms to complex payment solutions.
          </p>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="w-full flex overflow-x-auto justify-start mb-8 pb-2 space-x-2">
              {useCases.map(useCase => (
                <TabsTrigger 
                  key={useCase.id}
                  value={useCase.id}
                  className="px-4 py-2 flex items-center gap-2 whitespace-nowrap"
                >
                  {useCase.icon}
                  {useCase.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {useCases.map(useCase => (
              <TabsContent key={useCase.id} value={useCase.id} className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{useCase.title}</h3>
                      <p className="text-primary/60">{useCase.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Key Features:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {useCase.features.map(feature => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-primary/60 text-sm mb-4">
                        This is just one of many ways to configure your {useCase.title.toLowerCase()}. 
                        With FormCraft, you have complete flexibility to design the perfect form for your needs.
                      </p>
                      <div className="flex gap-3">
                        <Button variant="default">Try This Template</Button>
                        <Button variant="outline">View More Examples</Button>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:pl-6"
                  >
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                      {useCase.preview}
                    </div>
                  </motion.div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

import { Check } from "lucide-react";

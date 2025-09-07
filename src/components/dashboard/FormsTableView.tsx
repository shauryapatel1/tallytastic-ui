
import { Button } from "@/components/ui/button";
import { Form } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface FormsTableViewProps {
  forms: Form[];
}

export const FormsTableView = ({ forms }: FormsTableViewProps) => {
  return (
    <motion.div 
      className="bg-white rounded-lg border shadow-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {forms.map((form, index) => (
            <motion.tr 
              key={form.id} 
              className="hover:bg-gray-50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{form.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{form.description || "No description"}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${form.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {form.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {Math.floor(Math.random() * 50)} {/* Mock response count */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(form.updated_at), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" asChild className="h-8">
                    <Link to={`/dashboard/forms/${form.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="h-8">
                    <Link to={`/dashboard/forms/${form.id}/preview`}>
                      Preview
                    </Link>
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

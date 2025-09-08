import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink, Share2, QrCode, Code } from "lucide-react";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function ShareStep() {
  const { formData } = useOutletContext<ContextType>();
  const { toast } = useToast();
  
  const isPublished = formData?.status === 'published';
  const formUrl = `${window.location.origin}/public/form/${formData.id}`;
  
  const [embedCode] = useState(`<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      toast({
        title: "Link copied!",
        description: "Form URL has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually.",
        variant: "destructive"
      });
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Embed code copied!",
        description: "HTML embed code has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the embed code manually.",
        variant: "destructive"
      });
    }
  };

  const handleOpenForm = () => {
    window.open(formUrl, '_blank');
  };

  if (!isPublished) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Share Your Form
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Share your form link and embed it on websites.
          </p>
        </div>

        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Form Not Published
          </h3>
          <p className="text-gray-500 mb-4">
            Your form needs to be published before you can share it.
          </p>
          <Badge variant="secondary">Draft Status</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Share Your Form
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your form is live! Share the link or embed it on your website.
        </p>
      </div>

      {/* Direct Link */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="form-url" className="text-base font-medium">
            Direct Link
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            Share this link to let people fill out your form
          </p>
          <div className="flex gap-2">
            <Input
              id="form-url"
              value={formUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={handleCopyUrl} variant="outline" size="icon">
              <Copy className="w-4 h-4" />
            </Button>
            <Button onClick={handleOpenForm} variant="outline" size="icon">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button onClick={handleCopyUrl} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button onClick={handleOpenForm} variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Form
          </Button>
        </div>
      </div>

      {/* Embed Code */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="embed-code" className="text-base font-medium">
            Embed Code
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            Copy this HTML code to embed the form on your website
          </p>
          <div className="space-y-2">
            <textarea
              id="embed-code"
              value={embedCode}
              readOnly
              className="w-full h-20 p-3 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900"
            />
            <Button onClick={handleCopyEmbed} variant="outline" size="sm">
              <Code className="w-4 h-4 mr-2" />
              Copy Embed Code
            </Button>
          </div>
        </div>
      </div>

      {/* Sharing Stats */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sharing Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
            <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Direct Link</h4>
            <p className="text-sm text-gray-500">Share via email, social media, or messaging</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
            <Code className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Website Embed</h4>
            <p className="text-sm text-gray-500">Add to your website or blog</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
            <QrCode className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">QR Code</h4>
            <p className="text-sm text-gray-500">Generate QR code for offline sharing</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          <span className="text-green-600">✓ Form is published and ready to share</span>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleCopyUrl} className="bg-indigo-600 hover:bg-indigo-700">
            <Share2 className="w-4 h-4 mr-2" />
            Share Form
          </Button>
        </div>
      </div>
    </div>
  );
}
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink, Share2, QrCode, Mail, MessageSquare, Code } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import QRCodeLib from 'qrcode';

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function ShareStep() {
  const { formData } = useOutletContext<ContextType>();
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const formUrl = `${window.location.origin}/f/${formData.id}`;
  
  // Enhanced embed code with auto-resize script
  const embedCode = `<iframe 
  id="formcraft-embed-${formData.id}" 
  src="${formUrl}?embedded=true" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: none; width: 100%;"
></iframe>
<script>
  // Auto-resize script
  window.addEventListener('message', function(e) {
    if (e.origin !== '${window.location.origin}') return;
    if (e.data.type === 'formcraft-resize') {
      const iframe = document.getElementById('formcraft-embed-${formData.id}');
      if (iframe && e.data.height) {
        iframe.style.height = e.data.height + 'px';
      }
    }
  });
</script>`;

  // Generate QR code
  useEffect(() => {
    if (qrCanvasRef.current && formUrl) {
      QRCodeLib.toCanvas(qrCanvasRef.current, formUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(err => {
        console.error('QR code generation error:', err);
      });

      // Also generate data URL for download
      QRCodeLib.toDataURL(formUrl, {
        width: 400,
        margin: 2
      }).then(url => {
        setQrCodeUrl(url);
      }).catch(err => {
        console.error('QR code data URL error:', err);
      });
    }
  }, [formUrl]);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Fill out: ${formData.title}`);
    const body = encodeURIComponent(`I'd like you to fill out this form: ${formUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSocialShare = () => {
    const text = encodeURIComponent(`Check out this form: ${formData.title}`);
    const url = encodeURIComponent(formUrl);
    
    if (navigator.share) {
      navigator.share({
        title: formData.title,
        text: `Fill out: ${formData.title}`,
        url: formUrl,
      });
    } else {
      // Fallback to Twitter
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${formData.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
    }
  };

  if (formData.status !== 'published') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Share Your Form
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your form needs to be published before you can share it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Form Not Published
            </CardTitle>
            <CardDescription>
              Publish your form first to get a shareable link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Share2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">
                Go back to the Publish step to make your form live.
              </p>
              <Badge variant="outline">Draft</Badge>
            </div>
          </CardContent>
        </Card>
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
          Your form is live! Share it with your audience using the options below.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Direct Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Direct Link
            </CardTitle>
            <CardDescription>
              Share this URL directly with anyone you want to fill out your form.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="form-url">Form URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="form-url"
                  value={formUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => handleCopy(formUrl, 'url')}
                  className="shrink-0"
                >
                  {copiedField === 'url' ? 'Copied!' : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(formUrl, '_blank')}
                  className="shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code
            </CardTitle>
            <CardDescription>
              Let users scan this QR code to access your form on mobile devices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <canvas ref={qrCanvasRef} className="border rounded-lg p-2 bg-white" />
              <Button
                variant="outline"
                onClick={handleDownloadQR}
                disabled={!qrCodeUrl}
                className="w-full sm:w-auto"
              >
                Download QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Embed Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Embed on Website
            </CardTitle>
            <CardDescription>
              Embed this form directly on your website with automatic height adjustment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="embed-code">HTML Embed Code (with auto-resize)</Label>
              <div className="flex gap-2 mt-1">
                <textarea
                  id="embed-code"
                  value={embedCode}
                  readOnly
                  className="flex-1 min-h-[200px] p-3 text-xs border rounded-md resize-none font-mono bg-muted"
                />
                <Button
                  variant="outline"
                  onClick={() => handleCopy(embedCode, 'embed')}
                  className="shrink-0"
                >
                  {copiedField === 'embed' ? 'Copied!' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                The form will automatically adjust its height based on content. Works on any website.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Share */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Quick Share
            </CardTitle>
            <CardDescription>
              Share your form through popular channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleEmailShare}
                className="flex items-center gap-2 h-auto p-4"
              >
                <Mail className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-500">Send via email</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSocialShare}
                className="flex items-center gap-2 h-auto p-4"
              >
                <MessageSquare className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Social Media</div>
                  <div className="text-sm text-gray-500">Share on social platforms</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Status */}
        <Card>
          <CardHeader>
            <CardTitle>Form Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Status</p>
                <p className="text-sm text-gray-500">Your form is live and accepting responses</p>
              </div>
              <Badge className="bg-green-500 text-white">Published</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
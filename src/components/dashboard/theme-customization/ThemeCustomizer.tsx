
import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FormTheme } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ThemeCustomizerProps {
  initialTheme: FormTheme;
  onThemeChange: (theme: FormTheme) => void;
}

export function ThemeCustomizer({ initialTheme, onThemeChange }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState<FormTheme>(initialTheme);
  
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>, colorProperty: 'primaryColor' | 'backgroundColor') => {
    const updatedTheme = { ...theme, [colorProperty]: e.target.value };
    setTheme(updatedTheme);
    onThemeChange(updatedTheme);
  };
  
  const handleFontChange = (fontFamily: string) => {
    const updatedTheme = { ...theme, fontFamily };
    setTheme(updatedTheme);
    onThemeChange(updatedTheme);
  };
  
  const handleBorderRadiusChange = (values: number[]) => {
    const borderRadius = values[0];
    const updatedTheme = { ...theme, borderRadius };
    setTheme(updatedTheme);
    onThemeChange(updatedTheme);
  };
  
  const handleLogoChange = (logoUrl: string) => {
    const updatedTheme = { ...theme, logo: logoUrl };
    setTheme(updatedTheme);
    onThemeChange(updatedTheme);
  };
  
  const fontFamilies = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif" },
    { name: "Playfair Display", value: "Playfair Display, serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Lato", value: "Lato, sans-serif" },
  ];
  
  const predefinedColors = [
    { name: "Indigo", primary: "#6366f1", background: "#ffffff" },
    { name: "Blue", primary: "#3b82f6", background: "#ffffff" },
    { name: "Green", primary: "#10b981", background: "#ffffff" },
    { name: "Red", primary: "#ef4444", background: "#ffffff" },
    { name: "Purple", primary: "#8b5cf6", background: "#ffffff" },
    { name: "Pink", primary: "#ec4899", background: "#ffffff" },
    { name: "Orange", primary: "#f97316", background: "#ffffff" },
    { name: "Dark", primary: "#6366f1", background: "#1f2937" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Customization</CardTitle>
        <CardDescription>Personalize your form's appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-6 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {predefinedColors.map((preset) => (
                <button
                  key={preset.name}
                  className={cn(
                    "flex flex-col items-center p-4 rounded-lg border transition-all hover:border-primary",
                    theme.primaryColor === preset.primary && theme.backgroundColor === preset.background
                      ? "border-primary shadow-sm"
                      : "border-border"
                  )}
                  onClick={() => {
                    const updatedTheme = {
                      ...theme,
                      primaryColor: preset.primary,
                      backgroundColor: preset.background
                    };
                    setTheme(updatedTheme);
                    onThemeChange(updatedTheme);
                  }}
                >
                  <div className="flex mb-2">
                    <div 
                      className="h-6 w-6 rounded-full mr-1" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="h-6 w-6 rounded-full border" 
                      style={{ backgroundColor: preset.background }}
                    />
                  </div>
                  <span className="text-sm">{preset.name}</span>
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <Input
                    id="primary-color"
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange(e, 'primaryColor')}
                    className="h-8 w-16"
                  />
                  <Input
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange(e, 'primaryColor')}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: theme.backgroundColor }}
                  />
                  <Input
                    id="background-color"
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => handleColorChange(e, 'backgroundColor')}
                    className="h-8 w-16"
                  />
                  <Input
                    value={theme.backgroundColor}
                    onChange={(e) => handleColorChange(e, 'backgroundColor')}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Font Family</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fontFamilies.map((font) => (
                <Button
                  key={font.value}
                  type="button"
                  variant={theme.fontFamily === font.value ? "default" : "outline"}
                  className="h-10"
                  onClick={() => handleFontChange(font.value)}
                >
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Border Radius</Label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[theme.borderRadius]}
                min={0}
                max={16}
                step={1}
                onValueChange={handleBorderRadiusChange}
                className="flex-1"
              />
              <span className="w-12 text-center">{theme.borderRadius}px</span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="logo-url">Logo URL (optional)</Label>
            <Input
              id="logo-url"
              placeholder="https://example.com/logo.png"
              value={theme.logo || ""}
              onChange={(e) => handleLogoChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <div className="border rounded-lg p-4 overflow-hidden" style={{
            backgroundColor: theme.backgroundColor,
            borderRadius: `${theme.borderRadius}px`,
            fontFamily: theme.fontFamily
          }}>
            <h3 className="font-medium mb-4" style={{ color: theme.primaryColor }}>Theme Preview</h3>
            {theme.logo && (
              <img 
                src={theme.logo} 
                alt="Form Logo" 
                className="h-12 object-contain mb-4" 
                onError={(e) => {
                  // Hide the image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Sample field</label>
                <input 
                  type="text" 
                  className="border w-full px-3 py-2" 
                  style={{ 
                    borderRadius: `${theme.borderRadius}px`,
                    borderColor: theme.primaryColor
                  }}
                  placeholder="Sample input"
                />
              </div>
              <button 
                className="px-4 py-2 text-white" 
                style={{ 
                  backgroundColor: theme.primaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

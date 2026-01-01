import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormTheme } from "@/lib/types";

interface CompactThemeCustomizerProps {
  theme: FormTheme;
  onThemeChange: (theme: FormTheme) => void;
}

const fontFamilies = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Playfair", value: "Playfair Display, serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
];

const colorPresets = [
  { name: "Indigo", primary: "#6366f1", background: "#ffffff" },
  { name: "Blue", primary: "#3b82f6", background: "#ffffff" },
  { name: "Green", primary: "#10b981", background: "#ffffff" },
  { name: "Rose", primary: "#f43f5e", background: "#ffffff" },
  { name: "Purple", primary: "#8b5cf6", background: "#ffffff" },
  { name: "Orange", primary: "#f97316", background: "#ffffff" },
  { name: "Dark", primary: "#6366f1", background: "#1f2937" },
  { name: "Cream", primary: "#78716c", background: "#faf7f5" },
];

export function CompactThemeCustomizer({ theme, onThemeChange }: CompactThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    onThemeChange({
      ...theme,
      primaryColor: preset.primary,
      backgroundColor: preset.background,
    });
  };

  const handlePrimaryColorChange = (color: string) => {
    onThemeChange({ ...theme, primaryColor: color });
  };

  const handleBackgroundColorChange = (color: string) => {
    onThemeChange({ ...theme, backgroundColor: color });
  };

  const handleFontChange = (fontFamily: string) => {
    onThemeChange({ ...theme, fontFamily });
  };

  const handleBorderRadiusChange = (values: number[]) => {
    onThemeChange({ ...theme, borderRadius: `${values[0]}px` });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          <span>Theme</span>
          <div 
            className="w-4 h-4 rounded-full border" 
            style={{ backgroundColor: theme.primaryColor }}
          />
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Color Presets
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleColorPreset(preset)}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-md border transition-all hover:border-primary",
                    theme.primaryColor === preset.primary && theme.backgroundColor === preset.background
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex gap-0.5 mb-1">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ backgroundColor: preset.background }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Primary
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handlePrimaryColorChange(e.target.value)}
                  className="w-8 h-8 p-0.5 cursor-pointer"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => handlePrimaryColorChange(e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Background
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="w-8 h-8 p-0.5 cursor-pointer"
                />
                <Input
                  value={theme.backgroundColor}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Font Family
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {fontFamilies.map((font) => (
                <Button
                  key={font.value}
                  type="button"
                  variant={theme.fontFamily === font.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleFontChange(font.value)}
                >
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Border Radius
              </Label>
              <span className="text-xs text-muted-foreground">{theme.borderRadius}</span>
            </div>
            <Slider
              value={[parseInt(theme.borderRadius) || 6]}
              min={0}
              max={16}
              step={1}
              onValueChange={handleBorderRadiusChange}
            />
          </div>

          {/* Mini preview */}
          <div 
            className="p-3 rounded-md border"
            style={{
              backgroundColor: theme.backgroundColor,
              fontFamily: theme.fontFamily,
              borderRadius: theme.borderRadius,
            }}
          >
            <p className="text-xs mb-2" style={{ color: theme.primaryColor }}>
              Preview
            </p>
            <button
              className="px-3 py-1.5 text-xs text-white rounded"
              style={{ 
                backgroundColor: theme.primaryColor,
                borderRadius: theme.borderRadius,
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

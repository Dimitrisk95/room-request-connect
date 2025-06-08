
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accessibility, Eye, Type, Zap } from "lucide-react";
import { useAccessibility } from "./AccessibilityProvider";

const AccessibilitySettings = () => {
  const { settings, updateSettings } = useAccessibility();

  const fontSizeOptions = [
    { value: "small", label: "Small", size: "14px" },
    { value: "medium", label: "Medium", size: "16px" },
    { value: "large", label: "Large", size: "18px" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              High Contrast Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Increase contrast for better visibility
            </p>
          </div>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Font Size
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {fontSizeOptions.map((option) => (
              <Button
                key={option.value}
                variant={settings.fontSize === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateSettings({ fontSize: option.value as any })}
                style={{ fontSize: option.size }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Reduce Motion
            </Label>
            <p className="text-sm text-muted-foreground">
              Minimize animations and transitions
            </p>
          </div>
          <Switch
            checked={settings.reduceMotion}
            onCheckedChange={(checked) => updateSettings({ reduceMotion: checked })}
          />
        </div>

        <div className="p-4 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Keyboard Navigation</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Use Tab to navigate between elements</p>
            <p>• Use Enter or Space to activate buttons</p>
            <p>• Use Arrow keys in menus and lists</p>
            <p>• Use Escape to close dialogs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MarkdownEditor = ({ value, onChange, placeholder, className }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>("write");

  // Convert markdown-style links to HTML for preview
  const renderPreview = (text: string) => {
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 mb-2">
          <TabsTrigger value="write" className="font-mono text-xs">
            <Code className="w-3 h-3 mr-1" />
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="font-mono text-xs">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-background border-border min-h-[120px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Tip: Use [link text](url) for clickable links
          </p>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[120px] p-3 rounded-md border border-border bg-background/50 font-mono text-sm text-foreground">
            {value ? (
              <span dangerouslySetInnerHTML={{ __html: renderPreview(value) }} />
            ) : (
              <span className="text-muted-foreground">Preview will appear here...</span>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

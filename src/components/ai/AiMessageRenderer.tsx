import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface AiMessageRendererProps {
  content: string;
  isUser?: boolean;
}

export const AiMessageRenderer: React.FC<AiMessageRendererProps> = ({ content, isUser = false }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  if (isUser) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  // Parse markdown code blocks and basic markdown formatting
  // Matches ```[language]\n[code]\n```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; language?: string; code?: string; text?: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        text: content.slice(lastIndex, match.index)
      });
    }

    parts.push({
      type: 'code',
      language: match[1] || 'code',
      code: match[2].trimEnd()
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      text: content.slice(lastIndex)
    });
  }

  // Format inline elements: **bold**, `code`, bullet points, and headers
  const formatTextSegment = (text: string, segIdx: number) => {
    const lines = text.split('\n');

    return (
      <div key={`seg-${segIdx}`} className="space-y-1.5">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();

          // Empty line -> small gap
          if (!trimmed) {
            return <div key={lIdx} className="h-1" />;
          }

          // Header ### or ##
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={lIdx} className="font-bold text-emerald-900 text-xs sm:text-sm mt-2 mb-0.5">
                {parseInlineFormatting(trimmed.slice(4))}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={lIdx} className="font-bold text-emerald-950 text-sm mt-2.5 mb-1">
                {parseInlineFormatting(trimmed.slice(3))}
              </h3>
            );
          }

          // Bullet points (* or -)
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <div key={lIdx} className="flex items-start gap-2 pl-1 text-xs sm:text-sm leading-relaxed text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="flex-1">{parseInlineFormatting(trimmed.slice(2))}</span>
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={lIdx} className="text-xs sm:text-sm leading-relaxed text-slate-800">
              {parseInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Helper to parse **bold** and `inline_code`
  const parseInlineFormatting = (str: string): React.ReactNode[] => {
    const inlineRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    const segments = str.split(inlineRegex);

    return segments.map((seg, i) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      if (seg.startsWith('`') && seg.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-emerald-100/90 text-emerald-900 font-mono text-[11px] sm:text-xs font-semibold border border-emerald-200"
          >
            {seg.slice(1, -1)}
          </code>
        );
      }
      return seg;
    });
  };

  return (
    <div className="space-y-2.5">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return formatTextSegment(part.text || '', index);
        }

        if (part.type === 'code') {
          const isCopied = copiedCodeIndex === index;
          return (
            <div
              key={`code-${index}`}
              className="my-2 rounded-xl overflow-hidden border border-emerald-300/60 bg-slate-950 text-slate-100 shadow-sm"
            >
              {/* Code Header Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold uppercase tracking-wider text-[10px]">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{part.language || 'code'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(part.code || '', index)}
                  className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Copy code"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Content */}
              <pre className="p-3 text-[11px] sm:text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300/90 bg-slate-950 selection:bg-emerald-800 selection:text-white">
                <code>{part.code}</code>
              </pre>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

import React from 'react';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Safely renders text with inline vertical fractions and bold formatting:
 * - [[frac:3/4]] -> vertical 3/4
 * - [[mixed:2:1/3]] -> 2 and vertical 1/3
 * - **bold** -> <strong>...</strong> (supports nested fractions!)
 * - \n -> line breaks
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const lines = text.split('\n');

  const renderFractions = (segment: string, keyPrefix: string): React.ReactNode[] => {
    const fracRegex = /(\[\[mixed:[^:\]]+:[^/\]]+\/[^\]]+\]\]|\[\[frac:[^/\]]+\/[^\]]+\]\])/g;
    const parts = segment.split(fracRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

      if (part.startsWith('[[mixed:') && part.endsWith(']]')) {
        const inner = part.slice(8, -2);
        const colonIdx = inner.indexOf(':');
        const whole = inner.slice(0, colonIdx);
        const fracPart = inner.slice(colonIdx + 1);
        const [num, den] = fracPart.split('/');
        return (
          <span key={`${keyPrefix}-m-${idx}`} className="math-mixed">
            <span className="font-semibold">{whole}</span>
            <span className="math-frac">
              <span className="math-frac-num">{num}</span>
              <span className="math-frac-den">{den}</span>
            </span>
          </span>
        );
      }

      if (part.startsWith('[[frac:') && part.endsWith(']]')) {
        const inner = part.slice(7, -2);
        const [num, den] = inner.split('/');
        return (
          <span key={`${keyPrefix}-f-${idx}`} className="math-frac">
            <span className="math-frac-num">{num}</span>
            <span className="math-frac-den">{den}</span>
          </span>
        );
      }

      return <React.Fragment key={`${keyPrefix}-t-${idx}`}>{part}</React.Fragment>;
    });
  };

  const renderLine = (line: string, lineIdx: number): React.ReactNode[] => {
    const boldRegex = /(\*\*[^*]+\*\*)/g;
    const parts = line.split(boldRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${lineIdx}-b-${idx}`} className="font-semibold text-slate-900">
            {renderFractions(part.slice(2, -2), `${lineIdx}-b-${idx}`)}
          </strong>
        );
      }

      return (
        <React.Fragment key={`${lineIdx}-n-${idx}`}>
          {renderFractions(part, `${lineIdx}-n-${idx}`)}
        </React.Fragment>
      );
    });
  };

  return (
    <span className={className}>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {renderLine(line, idx)}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
};

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderMathTextToHtml(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(
      /\[\[mixed:([^:\]]+):([^/\]]+)\/([^\]]+)\]\]/g,
      '<span class="math-mixed"><span style="font-weight:600">$1</span><span class="math-frac"><span class="math-frac-num">$2</span><span class="math-frac-den">$3</span></span></span>'
    )
    .replace(
      /\[\[frac:([^/\]]+)\/([^\]]+)\]\]/g,
      '<span class="math-frac"><span class="math-frac-num">$1</span><span class="math-frac-den">$2</span></span>'
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}

'use client';

/* eslint-disable react/no-array-index-key */
import {Highlight, themes} from 'prism-react-renderer';

export function Codeblock({
  codeBlock,
  language,
}: {
  codeBlock: string;
  language: string;
}) {
  return (
    <Highlight theme={themes.oceanicNext} code={codeBlock} language={language}>
      {({tokens, getLineProps, getTokenProps}) => (
        <pre className="text-sm p-3 dark:bg-dark-surface2 rounded-md">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({line})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

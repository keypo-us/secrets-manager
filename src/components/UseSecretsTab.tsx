import React, { useState } from "react";

const CopyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: 'rgb(var(--primary))' }}>
    <rect x="8" y="8" width="8" height="12" rx="2" className="fill-background" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
  </svg>
);

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="absolute top-3 right-3 z-10">
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full shadow"
        style={{ background: 'rgb(var(--primary-foreground))', border: 'none' }}
        onClick={async (e) => {
          e.preventDefault();
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        type="button"
        title={copied ? 'Copied!' : 'Copy'}
        aria-label="Copy"
      >
        {CopyIcon}
      </button>
      {copied && (
        <span className="absolute top-1/2 -translate-y-1/2 left-full ml-2 px-2 py-0.5 rounded text-xs font-bold text-white bg-black/80 shadow whitespace-nowrap">Copied!</span>
      )}
    </div>
  );
}

export function UseSecretsTab() {
  const installCmd = "npm install -g @keypo/cli";
  const setupCmd = "keypo setup";
  const syncCmd = "keypo sync <input-file> <output-file>";
  const exampleCmd = `# config.txt\nAPI_KEY=${'{api_key}'}\nDATABASE_URL=${'{database_url}'}\n\nkeypo sync config.txt config-decrypted.txt\n\n# config-decrypted.txt will contain:\nAPI_KEY=actual_decrypted_api_key_value\nDATABASE_URL=actual_decrypted_database_url_value`;

  return (
    <div className="h-screen flex flex-col justify-start overflow-y-auto px-8 py-8">
      <h2 className="text-2xl font-bold mb-4">1. Installation</h2>
      <p className="mb-2 text-sm">Install the Keypo CLI globally using npm:</p>
      <div className="relative max-w-4xl mx-auto mb-8">
        <pre
          className="rounded p-4 pr-16 text-sm relative"
          style={{ background: 'rgb(var(--primary))', color: 'rgb(var(--primary-foreground))' }}
        >
          <CopyButton code={installCmd} />
          <code>{installCmd}</code>
        </pre>
      </div>

      <h2 className="text-2xl font-bold mb-4">2. Setup</h2>
      <p className="mb-2 text-sm">
        Initialize and configure your Keypo CLI environment:
      </p>
      <div className="relative max-w-4xl mx-auto mb-2">
        <pre
          className="rounded p-4 pr-16 text-sm relative"
          style={{ background: 'rgb(var(--primary))', color: 'rgb(var(--primary-foreground))' }}
        >
          <CopyButton code={setupCmd} />
          <code>{setupCmd}</code>
        </pre>
      </div>
      <p className="mb-8 text-sm">
        This will prompt you for your private key and RPC URL. <br/>
        <div className="max-w-xl mx-auto my-4">
          <span className="font-bold">Tip:</span> You can retrieve your private key by pressing the Export Private Key button on the bottom left side of this page.
        </div>
      </p>

      <h2 className="text-2xl font-bold mb-4">3. Sync</h2>
      <p className="mb-2 text-sm">
        Replace placeholders in your files with decrypted values from the Keypo network:
      </p>
      <div className="relative max-w-4xl mx-auto mb-2">
        <pre
          className="rounded p-4 pr-16 text-sm relative"
          style={{ background: 'rgb(var(--primary))', color: 'rgb(var(--primary-foreground))' }}
        >
          <CopyButton code={syncCmd} />
          <code>{syncCmd}</code>
        </pre>
      </div>
      <p className="mb-2 text-sm">
        Example:
      </p>
      <div className="relative max-w-4xl mx-auto">
        <pre
          className="rounded p-4 pr-16 text-sm relative"
          style={{ background: 'rgb(var(--primary))', color: 'rgb(var(--primary-foreground))' }}
        >
          <CopyButton code={exampleCmd} />
          <code>{exampleCmd}</code>
        </pre>
      </div>
    </div>
  );
} 
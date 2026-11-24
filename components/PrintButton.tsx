'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#9a5424] print:hidden"
    >
      Print program
    </button>
  );
}

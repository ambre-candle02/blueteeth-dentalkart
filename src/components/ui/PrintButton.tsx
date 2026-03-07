'use client';

export function PrintButton() {
    return (
        <button
            autoFocus
            onClick={() => window.print()}
            className="bg-brand-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_10px_40px_rgba(0,86,210,0.3)] hover:bg-brand-dark transition-all flex items-center justify-center transform hover:-translate-y-1"
        >
            Print Invoice
        </button>
    );
}

'use client';

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-brand-primary text-white px-6 py-3 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all transform active:scale-95 flex items-center justify-center font-black"
        >
            Print Invoice
        </button>
    );
}

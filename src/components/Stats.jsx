import React from 'react';

const Stats = () => {
    return (
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 py-20 bg-[var(--color-bg-primary)] border-b-4 border-black">
            <div className="neo-card bg-[var(--color-bg-secondary)] p-8 -rotate-3 hover:rotate-0 transition-transform flex flex-col items-center min-w-[200px]">
                <span className="block text-5xl md:text-6xl font-black text-[var(--color-accent-primary)] mb-2">10k+</span>
                <span className="text-xl font-bold uppercase text-[var(--color-text-primary)]">Events</span>
            </div>
            <div className="neo-card bg-[var(--color-bg-secondary)] p-8 rotate-2 hover:rotate-0 transition-transform flex flex-col items-center min-w-[200px]">
                <span className="block text-5xl md:text-6xl font-black text-[var(--color-accent-secondary)] mb-2">50k+</span>
                <span className="text-xl font-bold uppercase text-[var(--color-text-primary)]">Users</span>
            </div>
            <div className="neo-card bg-[var(--color-bg-secondary)] p-8 -rotate-2 hover:rotate-0 transition-transform flex flex-col items-center min-w-[200px]">
                <span className="block text-5xl md:text-6xl font-black text-[var(--color-success)] mb-2">1k+</span>
                <span className="text-xl font-bold uppercase text-[var(--color-text-primary)]">Organizers</span>
            </div>
        </div>
    );
};

export default Stats;

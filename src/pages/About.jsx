import React from 'react';
import SEOHead from '../components/SEOHead';
import saranshImg from '../assets/team/saransh.jpg';
import madhavImg from '../assets/team/madhav.jpg';

const About = () => {
    return (
        <>
            <SEOHead
                title="About Us - Our Mission & Story"
                description="Learn about Tickify's mission to revolutionize event ticketing in India. Meet our team of innovators dedicated to providing seamless, transparent, and zero-fee event booking experiences for millions of users."
                keywords={[
                    'about tickify',
                    'tickify team',
                    'event ticketing company',
                    'ticketing platform india',
                    'event booking company',
                    'tickify story',
                    'tickify mission'
                ]}
                canonical="https://tickify.co.in/about"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'About Us' }
                ]}
            />
            <div className="min-h-screen bg-[var(--color-bg-primary)] pt-32 md:pt-40 pb-12 px-4">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black uppercase text-[var(--color-text-primary)] tracking-tighter">
                            We Are <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Tickify.</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                            Disrupting the event industry with bold design, seamless tech, and zero hidden fees.
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="neo-card bg-[var(--color-bg-surface)] border-4 border-[var(--color-text-primary)] p-8 md:p-12 shadow-[12px_12px_0_var(--color-text-primary)] transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[16px_16px_0_var(--color-text-primary)] transition-all">
                        <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-4">
                            <span className="text-4xl text-[var(--color-accent-primary)]">🚀</span>
                            Our Mission
                        </h2>
                        <p className="text-lg font-medium leading-relaxed mb-6">
                            We believe buying tickets shouldn't be a headache. It should be the start of the excitement.
                            Tickify was born from the frustration of clunky interfaces, hidden service charges, and boring designs.
                        </p>
                        <p className="text-lg font-medium leading-relaxed">
                            We're here to give control back to organizers and joy back to attendees.
                            <span className="font-black bg-yellow-300 px-1 mx-1 text-black">No BS. Just Tickets.</span>
                        </p>
                    </div>

                    {/* Team Section */}
                    <div>
                        <h2 className="text-4xl font-black uppercase text-center mb-10 text-[var(--color-text-primary)]">The Squad</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                            {/* Saransh Mittal */}
                            <div className="neo-card bg-[var(--color-bg-surface)] border-4 border-[var(--color-text-primary)] p-6 text-center group shadow-[8px_8px_0_var(--color-text-primary)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_var(--color-accent-primary)] transition-all">
                                <div className="w-full h-64 bg-blue-100 border-2 border-[var(--color-text-primary)] mb-4 overflow-hidden relative">
                                    <img src={saranshImg} alt="Saransh Mittal" className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="font-black uppercase text-xl text-[var(--color-text-primary)]">Saransh Mittal</h3>
                                <p className="text-sm font-bold text-[var(--color-accent-primary)] uppercase">Co-founder & CEO</p>
                            </div>

                            {/* Madhav Arora */}
                            <div className="neo-card bg-[var(--color-bg-surface)] border-4 border-[var(--color-text-primary)] p-6 text-center group shadow-[8px_8px_0_var(--color-text-primary)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_var(--color-accent-secondary)] transition-all">
                                <div className="w-full h-64 bg-purple-100 border-2 border-[var(--color-text-primary)] mb-4 overflow-hidden relative">
                                    <img src={madhavImg} alt="Madhav Arora" className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="font-black uppercase text-xl text-[var(--color-text-primary)]">Madhav Arora</h3>
                                <p className="text-sm font-bold text-[var(--color-accent-secondary)] uppercase">CTO & Co-founder</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default About;

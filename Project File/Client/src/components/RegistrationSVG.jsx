import React from 'react';

const RegistrationSVG = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circles for depth */}
            <circle cx="250" cy="250" r="200" fill="#f0f9ff" />
            <circle cx="250" cy="250" r="150" fill="#e0f2fe" />

            {/* Abstract Medical Symbol / Shield */}
            <rect x="200" y="150" width="100" height="180" rx="50" fill="#003366" />
            <rect x="160" y="190" width="180" height="100" rx="50" fill="#003366" />

            {/* Plus sign */}
            <path d="M250 200V280M210 240H290" stroke="white" strokeWidth="25" strokeLinecap="round" />

            {/* Floating UI Elements (Circles and Lines) representing data/profiles */}
            <circle cx="100" cy="150" r="15" fill="#38bdf8" />
            <rect x="130" y="145" width="60" height="10" rx="5" fill="#cbd5e1" />

            <circle cx="400" cy="300" r="20" fill="#009999" />
            <rect x="330" y="315" width="50" height="10" rx="5" fill="#cbd5e1" />

            <circle cx="120" cy="350" r="25" fill="#003366" opacity="0.2" />
            <rect x="160" y="365" width="80" height="10" rx="5" fill="#cbd5e1" />

            {/* Subtle lines connecting symbols */}
            <path d="M115 150H185M385 300H320" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
    );
};

export default RegistrationSVG;

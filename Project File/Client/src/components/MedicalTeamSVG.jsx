import React from 'react';

const MedicalTeamSVG = ({ className }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className={className}>
            <defs>
                <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#003366", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#38bdf8", stopOpacity: 1 }} />
                </linearGradient>
                <filter id="svgShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                    <feOffset dx="0" dy="5" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Atmosphere */}
            <circle cx="400" cy="300" r="300" fill="url(#teamGrad)" opacity="0.03" />
            <g opacity="0.2" stroke="#003366" strokeWidth="2">
                <circle cx="100" cy="100" r="5" fill="none" />
                <path d="M700 100 L720 100 M710 90 L710 110" />
                <circle cx="150" cy="500" r="8" fill="none" opacity="0.5" />
            </g>

            {/* Team Composition */}
            <g filter="url(#svgShadow)" transform="translate(100, 50)">
                {/* Doctor 1 - Specialist (Background Left) */}
                <g transform="translate(0, 100) scale(0.85)">
                    <path d="M50 500 L50 300 Q50 200 150 200 L250 200 Q350 200 350 300 L350 500" fill="#f1f5f9" />
                    <path d="M150 200 L200 300 L250 200" fill="#003366" opacity="0.1" />
                    <circle cx="200" cy="110" r="90" fill="#e0ac69" />
                    <path d="M110 110 Q110 0 200 0 Q290 0 290 110 L270 110 Q270 30 200 30 Q130 30 130 110 Z" fill="#1e293b" />
                </g>

                {/* Doctor 2 - Lead (Foreground Center) */}
                <g transform="translate(150, 20)">
                    <path d="M80 500 L80 320 Q80 220 180 220 L320 220 Q420 220 420 320 L420 500" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                    <path d="M180 220 L250 350 L320 220" fill="#003366" opacity="0.05" />
                    {/* Stethoscope */}
                    <path d="M180 220 Q180 380 250 380 Q320 380 320 220" fill="none" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="250" cy="130" r="95" fill="#ffdbac" />
                    <path d="M155 130 Q155 10 250 10 Q345 10 345 130 L320 130 Q320 40 250 40 Q180 40 180 130 Z" fill="#334155" />
                </g>

                {/* Doctor 3 - Nurse/Assistant (Background Right) */}
                <g transform="translate(350, 100) scale(0.85)">
                    <path d="M50 500 L50 300 Q50 200 150 200 L250 200 Q350 200 350 300 L350 500" fill="#f1f5f9" />
                    <circle cx="200" cy="110" r="90" fill="#8d5524" />
                    <path d="M110 110 Q110 0 200 0 Q290 0 290 110 L270 110 Q270 30 200 30 Q130 30 130 110 Z" fill="#0f172a" />
                </g>
            </g>
        </svg>
    );
};

export default MedicalTeamSVG;

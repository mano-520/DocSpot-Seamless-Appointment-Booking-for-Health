import React from "react";

const DoctorAuthSVG = ({ className }) => {
    return (
        <svg viewBox="0 0 900 600" className={className}>
            <defs>
                {/* soft gradient background */}
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#eef5ff" />
                    <stop offset="100%" stopColor="#f7fbff" />
                </linearGradient>

                {/* coat shading */}
                <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#eaf1f9" />
                </linearGradient>

                {/* face tone */}
                <radialGradient id="face" cx="40%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffe0b8" />
                    <stop offset="100%" stopColor="#f2c38f" />
                </radialGradient>

                {/* main shadow */}
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="14" />
                </filter>
            </defs>

            {/* soft card background */}
            <rect width="100%" height="100%" fill="url(#bg)" rx="24" />

            {/* floating circle */}
            <circle cx="700" cy="140" r="70" fill="#dbeafe" opacity="0.5" />

            {/* doctor group */}
            <g transform="translate(300,70)">

                {/* body */}
                <path
                    d="M50 380 L50 200 C50 160 90 120 160 120 L280 120
             C350 120 390 160 390 200 L390 380 Z"
                    fill="url(#coat)"
                    stroke="#e2e8f0"
                />

                {/* neck */}
                <rect x="190" y="95" width="40" height="40" rx="10" fill="url(#face)" />

                {/* face */}
                <ellipse cx="210" cy="70" rx="70" ry="75" fill="url(#face)" />

                {/* hair */}
                <path
                    d="M140 70 Q140 -10 210 -10 Q280 -10 280 70
             Q240 40 210 45 Q170 45 140 70Z"
                    fill="#2b3742"
                />

                {/* eyes */}
                <circle cx="185" cy="70" r="4" fill="#1f2937" />
                <circle cx="235" cy="70" r="4" fill="#1f2937" />

                {/* smile */}
                <path d="M180 95 Q210 115 240 95" stroke="#8d5524" strokeWidth="3" fill="none" />

                {/* glasses */}
                <rect x="170" y="60" width="30" height="20" rx="6"
                    stroke="#1f2937" fill="none" />
                <rect x="220" y="60" width="30" height="20" rx="6"
                    stroke="#1f2937" fill="none" />
                <line x1="200" y1="70" x2="220" y2="70" stroke="#1f2937" />

                {/* shirt */}
                <rect x="180" y="120" width="60" height="70" rx="8" fill="#6c63ff" />

                {/* stethoscope */}
                <path
                    d="M170 120 Q170 200 210 210 Q250 200 250 120"
                    stroke="#64748b"
                    strokeWidth="10"
                    fill="none"
                />
                <circle cx="210" cy="240" r="20" fill="#94a3b8" />

                {/* tablet */}
                <g transform="translate(-20,230)">
                    <rect width="90" height="130" rx="14" fill="#0f172a" />
                    <rect x="10" y="15" width="70" height="90" rx="8" fill="#020617" />
                </g>

            </g>

            {/* ground shadow */}
            <ellipse cx="450" cy="520" rx="180" ry="30"
                fill="#000"
                opacity="0.08"
                filter="url(#shadow)"
            />
        </svg>
    );
};

export default DoctorAuthSVG;

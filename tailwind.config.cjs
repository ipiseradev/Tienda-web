/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#ededf0",
          200: "#d6d7dd",
          300: "#b2b4bf",
          400: "#8a8da0",
          500: "#6b6f85",
          600: "#55596f",
          700: "#44475c",
          800: "#2a2c3b",
          900: "#141623",
          950: "#0a0b12"
        },
        volt: {
          50: "#f4ffe4",
          100: "#e6ffc2",
          200: "#d0ff88",
          300: "#b7ff1a",
          400: "#9ae400",
          500: "#7bc100",
          600: "#5e9500",
          700: "#476f00",
          800: "#395a00",
          900: "#2f4a00"
        },
        steel: {
          50: "#f4f7fb",
          100: "#e6edf6",
          200: "#cfdceb",
          300: "#a8bfdb",
          400: "#7b9fc7",
          500: "#5a7eb0",
          600: "#446396",
          700: "#374e78",
          800: "#2f4263",
          900: "#2a3751"
        },
        ember: {
          50: "#fff4ed",
          100: "#ffe4d4",
          200: "#ffc6a8",
          300: "#ff9f6d",
          400: "#ff7c3f",
          500: "#ff5f1f",
          600: "#e6480a",
          700: "#bf3508",
          800: "#992b0e",
          900: "#7b2510"
        },
        brass: {
          50: "#fbf7e9",
          100: "#f6edc7",
          200: "#ecd79a",
          300: "#e1bc63",
          400: "#d7a23b",
          500: "#c9892a",
          600: "#ad6a23",
          700: "#8a4f20",
          800: "#6f3f20",
          900: "#5b341e"
        }
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 95, 31, 0.25)",
        soft: "0 20px 50px rgba(20, 35, 60, 0.12)",
        ink: "0 18px 60px rgba(8, 10, 18, 0.28)"
      },
      transitionTimingFunction: {
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)"
      },
      transitionDuration: {
        450: "450ms",
        650: "650ms",
        900: "900ms"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        sweep: {
          "0%": { transform: "translateX(-20%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        revealBlur: {
          "0%": { opacity: "0", transform: "translateY(16px)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0px)" }
        },
        shine: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        sweep: "sweep 0.8s ease-out forwards",
        shimmer: "shimmer 6s ease infinite",
        marquee: "marquee 18s linear infinite",
        revealUp: "revealUp 700ms cubic-bezier(0.2, 0.9, 0.2, 1) both",
        revealBlur: "revealBlur 850ms cubic-bezier(0.2, 0.9, 0.2, 1) both",
        shine: "shine 1.1s cubic-bezier(0.22, 1, 0.36, 1) both"
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(circle at 10% 20%, rgba(255,95,31,0.25) 0%, rgba(255,95,31,0) 50%), radial-gradient(circle at 80% 10%, rgba(90,126,176,0.35) 0%, rgba(90,126,176,0) 55%), radial-gradient(circle at 80% 80%, rgba(217,162,59,0.25) 0%, rgba(217,162,59,0) 55%)",
        "grid-soft":
          "linear-gradient(transparent 0 0), linear-gradient(90deg, rgba(47,66,99,0.08) 1px, transparent 1px), linear-gradient(rgba(47,66,99,0.08) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(47,66,99,0.18) 0%, rgba(47,66,99,0) 55%)",
        "ink-fade":
          "radial-gradient(circle at 40% 0%, rgba(10,11,18,0.75) 0%, rgba(10,11,18,0) 60%)",
        "volt-glow":
          "radial-gradient(circle at 60% 30%, rgba(183,255,26,0.25) 0%, rgba(183,255,26,0) 55%)"
      }
    }
  },
  plugins: []
};

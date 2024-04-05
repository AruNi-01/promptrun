import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-slow-2500": "bounce 2.5s infinite",
        "bounce-slow-3500": "bounce 3.5s infinite",
        "slide-in-to-up-500": "slideInUp 0.5s ease-in",
        "slide-in-to-up-1000": "slideInUp 1s ease-in",
        "slide-in-to-up-1500": "slideInUp 1.5s ease-in",
        "slide-in-to-down-1000": "slideInDown 1s ease-in",
        "slide-in-to-down-2000": "slideInDown 2s ease-in",
        "slide-in-from-left-500": "slideInLeft 0.5s ease-in",
        "slide-in-from-left-1000": "slideInLeft 1s ease-in",
        "slide-in-from-right-800": "slideInRight 0.8s ease-in",
        "slide-in-from-right-1000": "slideInRight 1s ease-in",
        "slide-out-to-up-500": "slideOutUp 0.5s ease-out forwards",
        "scale-5000": "scale 5s ease-in-out infinite",

        // 首页光影背景 animation
        "blob-tr-7000": "blobTopRight 7s infinite",
        "blob-lb-7000": "blobLeftBottom 7s infinite",
      },
      keyframes: {
        // 首页光影背景 keyframe
        blobTopRight: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "32%": {
            transform: "translate(30px, -50px) scale(1.2)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.8)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        blobLeftBottom: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "32%": {
            transform: "translate(-30px, 50px) scale(1.2)",
          },
          "66%": {
            transform: "translate(20px, -20px) scale(0.8)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },

        bounce: {
          "0%, 100%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        slideInUp: {
          "0%": {
            transform: "translateY(100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        slideInDown: {
          "0%": {
            transform: "translateY(-100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        slideInLeft: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        slideInRight: {
          "0%": {
            transform: "translateX(100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
        slideOutUp: {
          from: {
            opacity: 1,
            transform: "translateY(0)",
          },
          to: {
            opacity: 0,
            transform: "translateY(-100%)",
          },
        },
        scale: {
          "0%": {
            transform: "scale(1)",
          },
          "25%": {
            transform: "scale(1.2)",
          },
          "50%": {
            transform: "scale(1)",
          },
          "75%": {
            transform: "scale(1.2)",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

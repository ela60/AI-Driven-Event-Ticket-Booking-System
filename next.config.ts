import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            },
            {
                protocol: "https",
                hostname: "i.imgur.com"
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com"
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com" // Added for Google profile pictures
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com" 
            },
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
            },
        ],
    }
};

export default nextConfig;
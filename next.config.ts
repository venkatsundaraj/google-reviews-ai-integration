import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zkok4chdpn.ufs.sh",
        pathname: "/f/**", // Matches everything under /f/
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**", // Matches everything under /f/
      },
    ],
  },
};

export default nextConfig;

//https://lh3.googleusercontent.com

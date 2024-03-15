/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'i.ibb.co'],
    },
    trailingSlash: true,
    output: 'export',
};

export default nextConfig;

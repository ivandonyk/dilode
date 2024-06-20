/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"metacore.mobula.io"
            }
        ]
    }
};

export default nextConfig;

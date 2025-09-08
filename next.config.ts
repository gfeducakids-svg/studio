
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack(config, { isServer }) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Garante que o diretório das functions seja excluído do build do Next.js
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
        };
    }
    
    config.externals = [
        ...config.externals,
        // Adiciona aqui outros módulos que você queira manter externos se necessário
    ];
    
    // Excluir o diretório 'functions' do processamento do Webpack
    config.module.rules.push({
        test: /functions\//,
        use: 'null-loader',
    });


    return config;
  }
};

export default nextConfig;

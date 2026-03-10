import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/'], // Admin panelinin indexlenmesini istemiyoruz
        },
        sitemap: 'https://omervision.com/sitemap.xml', // Canlı alan adınızı buraya yazın
    }
}

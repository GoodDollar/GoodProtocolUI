import { formatter } from '@lingui/format-json'
export default {
    format: formatter({ style: 'minimal' }),
    catalogs: [
        {
            path: '<rootDir>/src/language/locales/{locale}/catalog',
            include: ['<rootDir>/src'],
        },
    ],
    locales: ['de', 'en', 'es-AR', 'es', 'it', 'he', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja', 'fr'],
}

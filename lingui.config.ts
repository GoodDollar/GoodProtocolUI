// import { formatter } from '@lingui/format-json'
import { formatter } from '@lingui/format-po'

export default {
    format: formatter(),
    catalogs: [
        {        
            path: '<rootDir>/src/language/locales/{locale}/catalog',
            include: ['<rootDir>/src'],
        },
    ],
    locales: ['de', 'en', 'es-AR', 'es', 'it', 'he', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja', 'fr'],
}

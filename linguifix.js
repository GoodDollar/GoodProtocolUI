const createPoFormatter = require('@lingui/format-po').formatter
const createJsonFormatter = require('@lingui/format-json').formatter
const { generateMessageId } = require('@lingui/message-utils/generateMessageId')

const fs = require('fs')

const poFormatter = createPoFormatter()
const jsonFormatter = createJsonFormatter({ style: 'lingui' })
const lFormatter = createJsonFormatter({ style: 'minimal' })
const dir = fs.readdirSync('src/language/locales')
// "messageId": {
//     "translation": "Translated message",
//     "message": "Default message",
//     "description": "Comment for translators",
//     "origin": [["src/App.js", 3]]
//  },
const ps = dir.map(async (item) => {
    const catalog = jsonFormatter.parse(fs.readFileSync(`src/language/locales/${item}/catalog.json.bak`, 'utf8'))
    const newCatalog = poFormatter.parse(fs.readFileSync(`src/language/locales/${item}/catalog.po`, 'utf8'))
    Object.keys(newCatalog).forEach((k) => {
        const msg = newCatalog[k].message
        const translation = catalog[msg]
        if (translation && translation !== msg) newCatalog[k].translation = translation
    })
    const output = poFormatter.serialize(newCatalog, {})
    fs.writeFileSync(`src/language/locales/${item}/catalog.po`, output)
})
Promise.all(ps).then((_) => console.log('done'))

// console.log({ catalog, output })

// async main() {
//   const catalog = jsonFormatter.parse(await fs.readFile('myfile.json', "utf8"));
//   await fs.writeFile('myfile.po', poFormatter.serialize(newFileConent))
//   console.log('Done!')
// }

// main();

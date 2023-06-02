const { readdir, readFile, writeFile } = require('fs')
const { promisify } = require('util')
const { mapValues } = require('lodash')
const { formatter: createPoFormatter } = require('@lingui/format-po')
const { formatter: createJsonFormatter } = require('@lingui/format-json')

const poFormatter = createPoFormatter()
const jsonFormatter = createJsonFormatter({ style: 'lingui' })
const lFormatter = createJsonFormatter({ style: 'minimal' })

const [readdirAsync, readFileAsync, writeFileAsync] = [readdir, readFile, writeFile].map(promisify)
const [parseJSON, parsePO] = [jsonFormatter, poFormatter].map(formatter => buffer => formatter.parse(buffer))

readdirAsync('src/language/locales')
  .then(async dir => Promise.all(dir.map(async item => {
    const path = 'src/language/locales/item' + item
    const catalog = await readFileAsync(path + '/catalog.json.bak', 'utf8').then(parseJSON)
    const compiledCatalog = await readFileAsync(path + '/catalog.po', 'utf8').then(parsePO)

    const newCatalog = mapValues(compiledCatalog, item => {
      const { message } = item
      const translation = catalog[message]

      return !translation || translation === message ? item : { ...item, translation }
    })
    
    const output = poFormatter.serialize(newCatalog, {})

    await writeFileAsync(path + '/catalog.po', output)
  })))
  .then(() => console.log('done'))


const Warning = require('../lib/warning')
const postcss = require('../lib/postcss')
const Result = require('../lib/result')

it('stringifies', () => {
  const result = new Result()
  result.css = 'a{}'
  expect('' + result).toEqual(result.css)
})

it('adds warning', () => {
  let warning
  const plugin = postcss.plugin('test-plugin', () => {
    return (css, res) => {
      warning = res.warn('test', { node: css.first })
    }
  })
  const result = postcss([plugin]).process('a{}').sync()

  expect(warning).toEqual(new Warning('test', {
    plugin: 'test-plugin',
    node: result.root.first
  }))

  expect(result.messages).toEqual([warning])
})

it('allows to override plugin', () => {
  const plugin = postcss.plugin('test-plugin', () => {
    return (css, res) => {
      res.warn('test', { plugin: 'test-plugin#one' })
    }
  })
  const result = postcss([plugin]).process('a{}').sync()

  expect(result.messages[0].plugin).toEqual('test-plugin#one')
})

it('allows Root', () => {
  const result = new Result()
  const root = postcss.parse('a{}')
  result.warn('TT', { node: root })

  expect(result.messages[0].toString()).toEqual('<css input>:1:1: TT')
})

it('returns only warnings', () => {
  const result = new Result()
  result.messages = [
    { type: 'warning', text: 'a' },
    { type: 'custom' },
    { type: 'warning', text: 'b' }
  ]
  expect(result.warnings()).toEqual([
    { type: 'warning', text: 'a' },
    { type: 'warning', text: 'b' }
  ])
})

// Consult https://www.snowpack.dev to learn about these options
module.exports = {
  extends: '@sveltejs/snowpack-config',
  mount: {
  'src/blocks': '/_app/blocks',
  'src/styles': '/_app/styles'
  },
  alias: {
    $blocks: './src/blocks',
    $styles: './src/styles'

  },
}

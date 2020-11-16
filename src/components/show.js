export default function show (SvelteElement, props) {
  const element = new SvelteElement({
    target: document.body,
    props: {
      data: props
    },
    intro: true
  })

  element.$on('destroy', () => {
    element.$destroy()
  })

  return element.promise
}

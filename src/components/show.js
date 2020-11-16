export default function show (SvelteElement, props) {
  return new Promise((resolve, reject) => {
    const element = new SvelteElement({
      target: document.body,
      props,
      intro: true
    })

    element.$on('destroy', ({ detail }) => {
      element.$destroy()
      resolve(detail)
    })
  })
}

<script>
  export let segment;

  // @sveltejs/kit has the getStores() method, but I have no idea how to expose it
  //#region Current page store
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  let store = writable(segment);
  setContext("page", { subscribe: store.subscribe });
  $: store.set(segment);
  //#endregion

  import { Navbar, NavbarSection, NavbarLink } from "$blocks/Navbar";
</script>

<style global lang="scss">
  @import "../styles/globals.scss";

  #app {
    margin: 0 auto;
    padding: 5px;
  }
</style>

<main id="app">
  <Navbar>
    <NavbarSection>
      <NavbarLink href="view" text="View" />
      <NavbarLink href="edit" text="Edit" />
    </NavbarSection>
  </Navbar>
  <slot />
</main>

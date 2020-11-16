<script>
  export let segment;

  //#region Current page store
  // @sveltejs/kit has the getStores() method, but I have no idea how to expose it
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  let store = writable(segment);
  setContext("page", { subscribe: store.subscribe });
  $: store.set(segment);
  //#endregion

  import { Navbar, NavbarSection, NavbarLink } from "$blocks/Navbar";

  import { onMount } from "svelte";
  let statusStore = writable({});
  setContext("status", { subscribe: statusStore.subscribe });
  onMount(() => {
    let SSE = new EventSource("/api/status#nosw");
    SSE.addEventListener("status", function ({ data }) {
      statusStore.set(JSON.parse(data));
    });
  });
</script>

<style global lang="scss">
  @import "../styles/globals.scss";

  #app {
    margin: 0 auto;
    padding: 5px;
  }
</style>

<svelte:head>
  <title>Wakey</title>
</svelte:head>

<main id="app">
  <!-- <Navbar>
    <NavbarSection>
      <NavbarLink href="view" text="View" />
      <NavbarLink href="edit" text="Edit" />
    </NavbarSection>
  </Navbar> -->
  <slot />
</main>

<script>
  import { getContext } from "svelte";
  const page = getContext('page')

  export let href = "#";
  export let text = "";
</script>

<a {href} class="btn" class:btn-primary={$page === href}>{text}</a>

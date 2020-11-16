<script>
  const defaultClassName = "text-gray"; // separate class name
  export let classNames = "text-gray";
</script>

<div class="card-subtitle {classNames ? classNames : defaultClassName}">
  <slot />
</div>

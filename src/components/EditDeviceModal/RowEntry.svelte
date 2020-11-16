<script>
  export let title = "";
  export let placeholder = "";
  export let value;

  export let required = false;
  export let validation;

  export let type = "text";
  export let min = 1; // Used for number types

  let isValid = true;

  function handleInput(evt) {
    let inputValue = evt.target.value

    if (
      (isValid = (function () {
        if (required && (inputValue === undefined || inputValue === "")) {
          return false;
        }

        if (validation) {
          if (validation instanceof RegExp) {
            return validation.test(inputValue);
          }

          if (validation instanceof Function) {
            return validation(inputValue);
          }
        }

        return true;
      })())
    ) {
      value = type === 'number' ? Number(inputValue) : inputValue;
    }
  }
</script>

<style>
  .form-input-hint {
    margin-bottom: 0;
  }
</style>

<div class="form-group">
  <div class="col-3 col-sm-12">
    <label class="form-label" for="input-example-4">{title}</label>
  </div>
  <div class="col-9 col-sm-12">
    <input
      class="form-input {isValid ? '' : 'is-error'}"
      {placeholder}
      {min}
      {type}
      value={value || ''}
      on:input={handleInput} />
    {#if !isValid}
      <p class="form-input-hint">Invalid value / value required</p>
    {/if}
  </div>
</div>

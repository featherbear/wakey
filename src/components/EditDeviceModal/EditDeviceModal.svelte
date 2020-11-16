<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const doClose = () => dispatch("destroy");
  const doSave = () => dispatch("destroy", { ...currentDevice });

  import { fade } from "svelte/transition";
  import RowEntry from "./RowEntry.svelte";

  import { default as deviceDefaults } from "../../wol/defaults";
  export let device = {};

  let currentDevice = { ...device };
</script>

<div class="modal active" transition:fade>
  <span on:click={doClose} class="modal-overlay" aria-label="Close" />
  <div class="modal-container">
    <div class="modal-header">
      <span
        on:click={doClose}
        class="btn btn-clear float-right"
        aria-label="Close" />
      <div class="modal-title h5">Device Edit</div>
    </div>
    <div class="modal-body">
      <div class="content">
        <div class="column col-9 col-sm-12">
          <form class="form-horizontal" action="#forms">
            <RowEntry
              title="Name"
              placeholder={deviceDefaults.name}
              bind:value={currentDevice.name}
              required={true} />
            <RowEntry
              title="MAC Address"
              placeholder={deviceDefaults.mac}
              bind:value={currentDevice.mac}
              required={true}
              validation={/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/} />
            <RowEntry
              title="IP Address"
              placeholder={deviceDefaults.address}
              bind:value={currentDevice.address}
              required={true}
              validation={/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/} />
            <RowEntry
              title="Port (UDP)"
              placeholder={deviceDefaults.port}
              bind:value={currentDevice.port}
              required={true}
              type="number"
              validation={(n) => n > 0 && n <= 65535} />
            <RowEntry
              title="Packet Count"
              placeholder={deviceDefaults.count}
              bind:value={currentDevice.count}
              validation={/^\d+$/}
              required={true}
              type="number" />
            {#if currentDevice.count > 1}
              <RowEntry
                title="Interval (ms)"
                placeholder={deviceDefaults.interval}
                bind:value={currentDevice.interval}
                required={true}
                type="number" />
            {/if}
          </form>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button on:click={doSave} class="btn btn-success">Save</button>
    </div>
  </div>
</div>

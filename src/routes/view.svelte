<script context="module">
  export async function preload() {
    return {
      devices: await this.fetch("/api/list").then((r) => r.json()),
    };
  }
</script>

<script>
  export let devices = [];

  import show from "$components/show.js";
  import { Card } from "$blocks/Card";
  import DeviceCard from "$components/DeviceCard.svelte";
  import EditDeviceModal from "$components/EditDeviceModal";

  let mode = "card"; // 'card' or 'table' // TODO: Implement

  import { getContext } from "svelte";
  const deviceStatus = getContext("status");

  let combinedData = {};
  $: combinedData = devices.map((d) => ({
    ...d,
    meta: $deviceStatus[d.mac] || {},
  }));

  import deviceDefaults from "../wol/defaults";

  async function handleEditRequest({ detail: device } = {}) {
    let result = await show(EditDeviceModal, { device });
    if (result) {
      let targetDevice = devices.find((device) => device.id === result.id);
      //#region Create device
      if (!targetDevice) {
        for (let key in deviceDefaults) {
          if (typeof result[key] === "undefined") {
            result[key] = deviceDefaults[key];
          }
        }

        let resp = await fetch("/api/device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        }).then((r) => r.json());
        if (!resp.id) {
          throw new Error(":(");
        }
        devices = [...devices, { ...result, id: resp.id }];
        //#endregion
      } else {
        //#region Edit device
        // Check if MAC of the entry was changed - invalidate any meta states
        let macChanged = targetDevice.mac !== result.mac;

        let resp = await fetch("/api/device", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        });

        if (resp.status !== 200) {
          throw new Error(":(");
        }

        Object.assign(targetDevice, result);
        macChanged && (targetDevice.meta = {});
        devices = devices;
        //#endregion
      }
    }
  }
</script>

<style lang="scss">
  @import "spectre.css/src/spectre-icons.scss";

  .columns {
    .column {
      padding-bottom: 0.8rem;
    }
  }

  #newDevice {
    cursor: pointer;
    user-select: none;
  }
</style>

<div class="container">
  {#if combinedData.length !== 0}
    {#if mode === 'list'}
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Device</th>
            <th>MAC</th>
            <th>Port</th>
            <th>Address</th>
            <th>Count</th>
            <th>Interval</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each combinedData as device}
            <tr>
              <td>{device.name}</td>
              <td>{device.mac}</td>
              <td>{device.port}</td>
              <td>{device.address}</td>
              <td>{device.count}</td>
              <td>{device.interval}</td>
              <td>OFFLINE</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <div class="columns">
        {#each combinedData as device}
          <div class="column col-3">
            <DeviceCard {device} on:edit={handleEditRequest} />
          </div>
        {/each}
        <div class="column col-3">
          <Card>
            <div
              class="empty"
              id="newDevice"
              on:click={() => handleEditRequest()}>
              <div class="empty-icon"><i class="icon icon-plus icon-3x" /></div>
              <p class="empty-title h5">Add a new device</p>
            </div>
          </Card>
        </div>
      </div>
    {/if}
  {:else}
    <div class="empty">
      <div class="empty-icon"><i class="icon icon-copy icon-3x" /></div>
      <p class="empty-title h5">You have no devices added</p>
      <!-- <p class="empty-subtitle">Let's get one added!</p> -->
      <div class="empty-action">
        <button class="btn btn-primary"><i class="icon icon-plus" />
          Add a device</button>
      </div>
    </div>
  {/if}
</div>

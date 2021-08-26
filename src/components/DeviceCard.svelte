<script>
  import {
    Card,
    CardHeader,
    CardTitle,
    CardSubtitle,
    CardBody,
    CardFooter,
  } from "$blocks/Card";
  export let device;

  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  dayjs.extend(relativeTime);

  $: seen = device.meta.seen && dayjs(device.meta.seen);

  // this subtracts the current UNIX-timestamp from the UNIX-timestamp of last seen
  // the result will be 'seen from now' in seconds which is then compared to three minutes
  // hence a computer is marked as offline if it hasn't been seen for three minutes
  $: online = (seen) ? ((dayjs().unix() - seen.unix()) < 180) : false;

  let isWaking = false;
  function doWake() {
    isWaking = true;
    fetch("/api/wake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: device.id, wait: true }),
    }).finally(() => (isWaking = false));
  }

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style lang="scss">
  @import "spectre.css/src/spectre-icons.scss";

  .icon-edit {
    transition: opacity 0.3s;
    opacity: 0.6;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
</style>

<Card>
  <CardHeader>
    <i on:click={dispatch('edit', device)} class="icon icon-edit float-right" />
    <CardTitle>{device.name}</CardTitle>
    <CardSubtitle classNames={online && 'text-success'}>
      {online ? 'Online' : 'Offline'}
    </CardSubtitle>
  </CardHeader>
  <CardBody>
    <dl>
      <dd>MAC: {device.mac}</dd>
      <!-- <dd>Address: {device.address}</dd>
      <dd>Port: {device.port}</dd>
      <dd>Count: {device.count}</dd>
      <dd>Interval: {device.interval}</dd> -->
      {#if online}{device.meta.ips}{/if}
    </dl>
    Last seen:
    {#if seen}
      <abbr
        class="tooltip"
        data-tooltip={seen.format('h:mma DD/MM/YYYY')}
        title>{seen.fromNow()}</abbr>
    {:else}Never{/if}
  </CardBody>
  <CardFooter>
    <button
      class="btn btn-primary"
      class:loading={isWaking}
      on:click={doWake}>Wake Device</button>
  </CardFooter>
</Card>

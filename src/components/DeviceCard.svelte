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

  $: online = device.ips && device.ips.length > 0;
  $: seen = device.seen && dayjs(device.seen);
</script>

<Card>
  <CardHeader>
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
      {#if online}{device.ips}{/if}
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
      on:click={() => fetch('/api/wake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: device.id }),
        })}>Wake Device</button>
  </CardFooter>
</Card>

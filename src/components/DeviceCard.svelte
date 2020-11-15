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
</script>

<Card>
  <CardHeader>
    <CardTitle>{device.name}</CardTitle>
    <CardSubtitle>Offline</CardSubtitle>
  </CardHeader>
  <CardBody>
    <dl>
      <dd>MAC: {device.mac}</dd>
      <dd>Address: {device.address}</dd>
      <dd>Port: {device.port}</dd>
      <dd>Count: {device.count}</dd>
      <dd>Interval: {device.interval}</dd>
    </dl>
  </CardBody>
  <CardFooter>Footer</CardFooter>
</Card>

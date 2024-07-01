<script>
  import Select from "svelte-select";

  let items = [
    { value: "districts", label: "118th Congressional districts" },
    { value: "solar", label: "Solar power", group: "Potential energy resources" },
    { value: "wind", label: "Wind power", group: "Potential energy resources" },
  ];

  export let activeLayer;
</script>

<div class="g-controls">
  <div class="g-controls__title">Additional layers</div>

  <Select
    {items}
    groupBy={(item) => item.group}
    bind:justValue={activeLayer}
    --width="250px"
    --group-title-text-transform="none"
  />
</div>

<style lang="scss">
  .g-controls {
    margin-bottom: 1rem;

    &__title {
      font-weight: bold;
      padding-bottom: 0.25rem;
      display: block;
    }
  }
</style>

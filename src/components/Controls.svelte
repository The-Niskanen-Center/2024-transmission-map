<script>
  import Select from "svelte-select";
  import { Search, Layers } from "lucide-svelte";
  import {isMobile} from "../stores/global"

  export let lines;
  export let activeLine = undefined;
  export let activeLayer;

  let layers = [
    { value: "districts", label: "118th Congressional districts" },
    {
      value: "solar",
      label: "Solar power",
      group: "Potential energy resources",
    },
    { value: "wind", label: "Wind power", group: "Potential energy resources" },
  ];

  let controlsWidth;
</script>

<div class="g-controls" bind:clientWidth={controlsWidth}>
  <Select
    bind:justValue={activeLine}
    items={lines.map((d) => d.Name)}
    placeholder="Search all projects"
    --width="{controlsWidth / ($isMobile ? 1 : 2)}px"
  >
    <div slot="prepend">
      <Search size="16" color="#7B8792" />
    </div>
  </Select>

  <Select
    items={layers}
    groupBy={(item) => item.group}
    bind:justValue={activeLayer}
    placeholder="Add additional map layers"
    --width="{controlsWidth / ($isMobile ? 1 : 2)}px"
    --group-title-text-transform="none"
  >
    <div slot="prepend">
      <Layers size="16" color="#7B8792" />
    </div>
  </Select>
</div>

<style lang="scss">
  .g-controls {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;

    @include mq("600px", "max-width") {
      flex-wrap: wrap;
    }
  }
</style>

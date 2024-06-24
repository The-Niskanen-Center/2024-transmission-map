<script>
  import { onMount } from "svelte";
  import { geoAlbersUsa, geoPath } from "d3-geo";
  import states from "../data/states.json";
  import lines from "../data/lines.json";

  export let activeLine = undefined;

  let svg;
  let width;
  let height;
  let statePaths = [];
  let linePaths = [];

  let activeLayer;

  onMount(() => {
    resize();
    window.addEventListener("resize", resize);
    drawMap();
  });

  function resize() {
    const boundingBox = svg.getBoundingClientRect();
    width = boundingBox.width;
    height = width * 0.6;
    drawMap();
  }

  function drawMap() {
    const projection = geoAlbersUsa()
      .scale(width * 1.35) // Adjust the scale factor based on your desired map size
      .translate([width / 2, height / 2]);

    const path = geoPath().projection(projection);

    statePaths = states.features.map((feature) => path(feature));
    linePaths = lines.features.map((feature) => path(feature));
  }

  $: if (width) {
    drawMap();
  }

  function handleClick(val) {
    activeLine == val ? (activeLine = undefined) : (activeLine = val);
  }

  function getColor(category) {
    const categoryColors = {
      "115 - 199": "#E50076",
      "200 - 299": "#7AE300",
      "300 - 399": "#00E2A4",
      "500 - 599": "#0074D9",
      "+600": "#00BFFF",
    };

    return categoryColors[category] || null; // Return null if the category is not found
  }
</script>

<div class="g-controls">
  <button on:click={() => (activeLayer = "wind")}>Wind</button>
  <button on:click={() => (activeLayer = "solar")}>Solar</button>
</div>

<svg
  bind:this={svg}
  viewBox="0 0 {width} {height}"
  preserveAspectRatio="xMidYMid meet"
>
  {#each statePaths as statePath}
    <path class="states" d={statePath}></path>
  {/each}

  {#if activeLayer == "wind"}
    <image href="wind.png" x="0" y="0" {width} {height} />
  {/if}

  {#if activeLayer == "solar"}
    <image href="solar.png" x="0" y="0" {width} {height} />
  {/if}

  {#each linePaths as linePath, i}
    {@const line = lines.features[i]}
    <path
      class="line-halo"
      class:active={line.properties.name == activeLine}
      on:click={() => handleClick(line.properties.name)}
      d={linePath}
      fill="none"
    ></path>
  {/each}

  {#each linePaths as linePath, i}
    <path
      class="line"
      d={linePath}
      fill="none"
      style:--stroke={getColor(lines.features[i].properties.category)}
    ></path>
  {/each}
</svg>

<style lang="scss">
  
  .g-controls {
    margin-bottom: 1rem;
  }
  
  svg {
    width: 100%;
    height: auto;

    .states {
      fill: #ddd;
      stroke: #fff;
      stroke-width: 1;
    }

    .line-halo {
      stroke: transparent;
      stroke-width: 6px;
      cursor: pointer;
      opacity: 0.3;

      &:hover {
        stroke: black;
      }

      &.active {
        stroke: black;
      }
    }

    .line {
      stroke: var(--stroke);
      stroke-width: 2px;
    }
  }

  image {
    opacity: 0.75;
  }
</style>

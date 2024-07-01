<script>
  import { onMount } from "svelte";
  import { geoAlbersUsa, geoPath } from "d3-geo";
  import * as topojson from "topojson-client";

  import tippy, { followCursor } from "tippy.js";
  import "tippy.js/dist/tippy.css";
  import "tippy.js/themes/light.css";

  import states from "../data/states.json";
  import lines from "../data/lines.json";
  import topology from "../data/districts.json";

  import Legend from "./Legend.svelte";

  export let activeLine = undefined;

  let svg;
  let width;
  let height;
  let path;

  let fillAccessor = "PARTY";

  export let activeLayer;

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

    path = geoPath().projection(projection);

    setTimeout(setTippy, 1000);
  }

  $: if (width) {
    drawMap();
  }

  function handleClick(val) {
    activeLine == val ? (activeLine = undefined) : (activeLine = val);
  }

  let lineCategories = [
    "115 - 199",
    "200 - 299",
    "300 - 399",
    "500 - 599",
    "+600",
  ];

  let lineColors = ["#E50076", "#7AE300", "#00E2A4", "#0074D9", "#00BFFF"];

  function getCategoryColor(category) {
    const categoryColors = lineCategories.reduce((acc, category, index) => {
      acc[category] = lineColors[index];
      return acc;
    }, {});

    return categoryColors[category] || null; // Return null if the category is not found
  }

  function getPartyColor(party) {
    if (party == "Democrat") {
      return "#7498F6";
    } else if (party == "Republican") {
      return "#F0694D";
    } else if (party == "Independent") {
      return "#B1A3CC";
    } else {
      return "#ddd";
    }
  }

  function setTippy() {
    tippy(".line-halo", {
      theme: "light",
      followCursor: true,
      plugins: [followCursor],
      maxWidth: 250,
    });
  }

  const windColors = [
    "#091D58", // ≥ 10
    "#263595", // 9.0 to 9.9
    "#235FA8", // 8.0 to 8.9
    "#3A91C0", // 7.0 to 7.9
    "#4BB7C5", // 6.0 to 6.9
    "#80CDBB", // 5.0 to 5.9
    "#C7EAB4", // 4.0 to 4.9
    "#EDF8DA", // 3.0 to 3.9
    "#FFFFD9", // < 3.0
  ];

  const windValues = [
    "≥ 10",
    "9.0 to 9.9",
    "8.0 to 8.9",
    "7.0 to 7.9",
    "6.0 to 6.9",
    "5.0 to 5.9",
    "4.0 to 4.9",
    "3.0 to 3.9",
    "< 3.0",
  ];
</script>

<Legend
  values={lineCategories}
  colors={lineColors}
  title="Voltage range of line"
  suffix="kv"
  layout="center"
/>

<div class="g-map">
  <svg
    bind:this={svg}
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMidYMid meet"
  >
    {#if path}
      <g data-group="states-fill">
        {#each states.features as feature}
          <path class="state-fill" d={path(feature)}></path>
        {/each}
      </g>

      <g data-group="layers">
        {#if activeLayer == "wind"}
          <image class="layer" href="wind.png" x="0" y="0" {width} {height} />
        {/if}

        {#if activeLayer == "solar"}
          <image class="layer" href="solar.png" x="0" y="0" {width} {height} />
        {/if}

        {#if activeLayer == "districts"}
          {#each topojson.feature(topology, "districts").features as feature}
            <path
              class="district"
              d={path(feature)}
              style:--fill={getPartyColor(feature.properties[fillAccessor])}
            ></path>
          {/each}
        {/if}
      </g>

      <g data-group="states-stroke">
        {#each states.features as feature}
          <path class="state-stroke" d={path(feature)}></path>
        {/each}
      </g>

      <g data-group="lines">
        {#each lines.features as feature}
          <path
            class="line-halo"
            class:active={feature.properties.name == activeLine}
            on:click={() => handleClick(feature.properties.name)}
            on:keydown={() => handleClick(feature.properties.name)}
            d={path(feature)}
            fill="none"
            data-tippy-content={feature.properties.name}
          ></path>
        {/each}

        {#each lines.features as feature}
          <path
            class="line"
            class:active={feature.properties.name == activeLine}
            d={path(feature)}
            fill="none"
            style:--stroke={getCategoryColor(feature.properties.category)}
          ></path>
        {/each}
      </g>
    {/if}
  </svg>

  {#if activeLayer == "wind"}
    <!-- <div class="g-floating-legend">
      <Legend
        values={windValues}
        colors={windColors}
        title="Wind speed"
        suffix=""
        layout="center"
        direction="column"
        type="ruler"
      />
    </div> -->
  {/if}
</div>

<style lang="scss">
  .g-map {
    position: relative;
    svg {
      width: 100%;
      height: auto;

      .state-fill {
        fill: #ddd;
      }

      .state-stroke {
        fill: none;
        stroke: #fff;
        stroke-width: 1;
      }

      .district {
        fill: var(--fill);
        stroke: #fff;
        stroke-width: 0.5;
        opacity: 0.5;
      }

      .line-halo {
        stroke: transparent;
        stroke-width: 7px;
        cursor: pointer;
        opacity: 0.25;
        stroke: black;

        &:hover {
          stroke: black;
          opacity: 0.5;
        }

        &.active {
          stroke: black;
          opacity: 1;
        }
      }

      .line {
        stroke: var(--stroke);
        stroke-width: 3px;
        &.active {
          stroke: #ffffcc;
        }
      }
    }

    image.layer {
      opacity: 1;
    }

    .g-floating-legend {
      position: absolute;
      bottom: 0px;
      right: 0px;
      background: white;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
  }

  :global {
    .tippy-box {
      font-weight: bold;
    }
  }
</style>

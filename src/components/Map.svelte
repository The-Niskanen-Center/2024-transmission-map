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
  import districtsDict from "../data/districts-dict.json";

  import Legend from "./Legend.svelte";

  export let activeLine = undefined;

  let svg;
  let width;
  let height;
  let path;

  export let activeLayer;

  onMount(() => {
    resize();
    window.addEventListener("resize", resize);
    drawMap();
    setTimeout(setTippy, 1000);
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
    } else if (party == "Vacant") {
      return "#ddd";
    } else if (party == "Independent") {
      return "#B1A3CC";
    } else {
      return "#fff";
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

  let districtValues = ["Democrat", "Republican", "Vacant"];
  let districtColors = ["#7498F6", "#F0694D", "#ddd"];

  const windColors = [
    "#FFFFD9",
    "#EDF8DA",
    "#C7EAB4",
    "#80CDBB",
    "#4BB7C5",
    "#3A91C0",
    "#263595",
    "#091D58",
  ];

  const windValues = ["< 3.0", "4", "5", "6", "7", "8", "9", "≥ 10"];


  const solarColors = [
    "#FFFFCE",
    "#FCEDA1",
    "#FADA76",
    "#F5B24C",
    "#F28D3D",
    "#EF4D2B",
    "#E4201B",
    "#BD1825",
  ];

  const solarValues = ["< 4", "4.25", "4.5", "4.75", "5", "5.25", "5.5", "≥ 5.75"];
</script>

<div class="legends">
  <Legend
    values={lineCategories}
    colors={lineColors}
    type="groups"
    title="Voltage range of line"
    suffix="kv"
    layout="center"
  />

  {#if activeLayer == "districts"}
    <Legend
      values={districtValues}
      colors={districtColors}
      title="118th Congressional district control"
      layout="center"
      type="groups"
    />
  {/if}

  {#if activeLayer == "wind"}
    <Legend
      values={windValues}
      colors={windColors}
      title="Annual average wind speed at 80 meters above surface level"
      subtitle="Wind speed (meter/second)"
      layout="center"
      type="gradient"
    />
  {/if}

  {#if activeLayer == "solar"}
    <Legend
      values={solarValues}
      colors={solarColors}
      title="Global Horizontal Irradiance"
      subtitle="kWh/m<sup>2</sup>/Day"
      layout="center"
      type="gradient"
    />
  {/if}
</div>

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
              style:--fill={getPartyColor(
                districtsDict[feature.properties.DISTRICTID]
              )}
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
        opacity: 0.9;
      }

      .line-halo {
        stroke: transparent;
        stroke-width: 7px;
        cursor: pointer;
        opacity: 0.75;
        stroke: black;

        &:hover {
          stroke: black;
          opacity: 1;
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
  }

  :global {
    .tippy-box {
      font-weight: bold;
    }
  }

  .legends {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>

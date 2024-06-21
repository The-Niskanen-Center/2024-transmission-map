<script>
  import Window from "./components/Window.svelte";
  import Map from "./components/Map.svelte";
  import Table from "./components/Table.svelte";

  // Handle responsive iframes for embeds
  import pym from "pym.js";

  new pym.Child({
    polling: 500,
  });

  function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  let includeCredit = getUrlParameter("credit") != "false";

  let activeLine;

  function reset() {
    overlayInfo = undefined;
    marker.remove();
  }

  $: console.log(activeLine)
</script>

<Window />
<!-- Outer div must have class 'chart-container' don't change -->
<div class="chart-container">
  <h1 class="headline">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit
  </h1>
  <p class="dek">
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </p>

  <p class="sr-only"></p>

  <div id="g-viz">
    <Map bind:activeLine />
    <Table bind:activeLine />
  </div>

  {#if includeCredit}
    <div class="credit"></div>
  {/if}
</div>

<style lang="scss">
  .chart-container {
    max-width: 800px;
    width: 100%;
    padding: 1rem;
  }

  :root {
    --color-likely: #7fb6d9;
    --color-potentially: #dda3fa;
  }

  #g-viz {
    position: relative;
    overflow: hidden;
  }

  :global {
    .highlight {
      $size: 12px;
      margin-left: calc($size + 4px);
      position: relative;

      &::after {
        width: $size;
        height: $size;
        content: "";
        border: 1px;
        position: absolute;
        left: calc($size * -1 - 2px);
        top: 50%;
        transform: translateY(-50%);
        border: 1px solid;
        border-radius: 100%;
      }

      &.unlikely {
        &::after {
          background: #fff;
          border-color: #999;
        }
      }
      &.potentially {
        &::after {
          background: var(--color-potentially);
          border-color: var(--color-potentially);
        }
      }
      &.likely {
        &::after {
          background: var(--color-likely);
          border-color: var(--color-likely);
        }
      }
    }
  }
</style>

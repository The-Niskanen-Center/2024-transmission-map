<script>
  import Window from "./components/Window.svelte";
  import Map from "./components/Map.svelte";
  import Summary from "./components/Summary.svelte";
  import Table from "./components/Table.svelte";
  import Controls from "./components/Controls.svelte";

  import data from "./data/data.json";

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
  let activeLayer;

  function reset() {
    overlayInfo = undefined;
    marker.remove();
  }

  $: console.log(activeLine);
</script>

<Window />
<!-- Outer div must have class 'chart-container' don't change -->
<div class="chart-container">
  <h1 class="headline">
    Visualizing electric transmission permitting: data from 2010 to 2020
  </h1>
  <p class="dek">
    The Niskanen Center and Clean Air Task Force published a report in March
    2024 that assesses how federal permitting impacted new transmission lines
    added to the U.S. bulk power system from 2010 to 2020. This companion
    visualization provides a mapping tool and tabular data based on the dataset
    that our teams compiled and analyzed during the development of the report.
    We hope this interactive tool, alongside our <a
      href="https://www.niskanencenter.org/contextualizing-electric-transmission-permitting-data-from-2010-to-2020/"
      target="_blank">data</a
    >
    report and
    <a
      href="https://www.niskanencenter.org/evidence-based-recommendations-for-overcoming-barriers-to-federal-transmission-permitting/"
      target="_blank">full set of recommendations</a
    > for overcoming barriers to federal transmission permitting, helps to better
    inform policy debates about this critical topic.
  </p>

  <p class="dek">
    In addition to the data from our report, the map below provides several data
    layers from external sources. The layers can help preliminary exploration of
    how these transmission infrastructure projects align with some example
    jurisdictional boundaries and energy resource potentials.
  </p>

  <p class="sr-only"></p>

  <div id="g-viz">
    <Controls bind:activeLayer bind:activeLine lines={data} />

    <Map bind:activeLine {activeLayer} />
    <Summary {activeLine} />
    <Table bind:activeLine {data} />
  </div>

  <p class="credit">
    Note: Note: All data is current through March 2024. Three additional lines
    were added to the dataset since the report publication. All data is current
    through March 2024. A more nuanced picture of some data entries, such as
    Lead Federal Agency and Line Voltage, can be found in the original data
    sources linked in Table A of our <a
      href="https://www.niskanencenter.org/contextualizing-electric-transmission-permitting-data-from-2010-to-2020/"
      target="_blank">data report</a
    >.
  </p>

  <p class="credit">
    Data: Niskanen Center and Clean Air Task Force; Solar and wind energy
    resource data from <a href="https://www.nrel.gov/gis/">NREL</a>; Credit:
    Niskanen Center
  </p>
</div>

<style lang="scss">
  .chart-container {
    // max-width: 800px;
    width: 100%;
    padding: 1rem;
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
    }
  }
</style>

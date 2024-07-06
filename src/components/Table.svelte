<script>
  import { onMount } from "svelte";

  import { afterUpdate } from "svelte";

  export let data;
  export let activeLine = undefined;

  let columns = [];
  let tableData = [];
  let colsToRemove = ["Mapped"];

  onMount(() => {
    columns = Object.keys(data[0]).filter(
      (column) => !colsToRemove.includes(column)
    );
    tableData = data.map((row) => {
      let filteredRow = {};
      columns.forEach((column) => {
        filteredRow[column] = row[column];
      });
      return filteredRow;
    });
  });

  afterUpdate(() => {
    if (activeLine !== undefined) {
      const activeRow = document.querySelector(`tr.active`);
      if (activeRow) {
        activeRow.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    }
  });

  function handleClick(val) {
    activeLine == val ? (activeLine = undefined) : (activeLine = val);
  }

  // let asteriskColumns = ["Lead Federal Agency"];
  // let daggerColumns = [
  //   "Year Federal EIS Issued",
  //   "Date last ROD published",
  //   "Time in Days (NOI to last ROD)",
  //   "Time in Years (NOI to last ROD)",
  //   "Status of NEPA review",
  //   "Energized?",
  // ];
</script>

<!-- <p class="credit">
  All data is current through March 2024. A more nuanced picture of some data
  entries, such as Lead Federal Agency and Line Voltage, can be found in the
  original data sources linked in Table A of our <a
    href="https://www.niskanencenter.org/contextualizing-electric-transmission-permitting-data-from-2010-to-2020/"
    target="_blank">data report</a
  >.
</p> -->

<div class="g-instructions">Scroll right →</div>

<div class="table-container">
  <table>
    <thead>
      <tr>
        {#each columns as column}
          <th>{column}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each tableData as row}
        <tr
          class:active={activeLine == row["Name"]}
          class:inactive={activeLine && activeLine != row["Name"]}
          on:click={() => handleClick(row["Name"])}
        >
          {#each columns as column}
            <td data-column={column.toLowerCase()}>{row[column]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .table-container {
    overflow: auto;
    // border-radius: 10px;
    height: 500px;

    thead {
      position: sticky;
      top: 0px;
      z-index: 1000;
    }
  }

  .g-instructions {
    text-align: right;
    padding-bottom: 1rem;
    color: #666;
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    border-bottom: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    white-space: nowrap;
    font-size: 14px;
  }

  td[data-column="name"] {
    max-width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  tr:hover {
    background-color: #eee;
    cursor: pointer;
  }

  tr.active {
    background-color: #ffffcc;
  }

  tr.inactive {
    opacity: 0.6;
  }

  th {
    background-color: #1d515e;
    color: white;
  }

  :global {
    .svelte-select {
      .prepend {
        padding-right: 0.25rem;
      }
    }
  }
</style>

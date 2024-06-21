<script>
    import { onMount } from "svelte";
    import data from "../data/data.json";
    import Select from "svelte-select";
    import { Search } from "lucide-svelte";
    import { afterUpdate } from "svelte";
  
    export let activeLine = undefined;
  
    let columns = [];
    let tableData = [];
    let colsToInclude = [
      "Name",
      "Category",
      "Line Length (mi)",
      "Dominant Line Voltage (kV)",
      "Voltage range",
      "States",
    ];
  
    onMount(() => {
      columns = Object.keys(data[0]).filter((column) =>
        colsToInclude.includes(column)
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
          activeRow.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  </script>
  
  <div class="controls">
    <Select items={data.map((d) => d.Name)} placeholder="Search all projects">
      <div slot="prepend">
        <Search size=16 color="#7B8792" />
      </div>
    </Select>
  </div>
  
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
          <tr class:active={activeLine == row['Name']}>
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
      border-radius: 10px;
      height: 500px;
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
  
    tr:hover, tr.active {
      background-color: #ffffcc;
    }
  
    th {
      background-color: #1d515e;
      color: white;
    }
  
    .controls {
      margin-bottom: 1rem;
    }
  
    :global {
      .svelte-select {
        .prepend {
          padding-right: 0.25rem;
        }
      }
    }
  </style>
  
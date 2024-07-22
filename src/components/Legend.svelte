<script>
  export let values;
  export let colors;
  export let title = "";
  export let subtitle = undefined;
  export let prefix = undefined;
  export let suffix = undefined;
  export let type;
  export let layout = "left";
  export let direction = "row";
  export let minValue = undefined;

  let legendItems = values.map((category, index) => ({
    category,
    color: colors[index],
  }));

  let gradient = `linear-gradient(0.25turn, ${colors.join(", ")})`;
</script>

<div class="g-legend {layout}" style:--direction={direction}>
  <div class="g-legend__title">{@html title}</div>
  {#if subtitle}
    <div class="g-legend__subtitle">{@html subtitle}</div>{/if}
  {#if type == "groups"}
    <div class="g-legend__items {layout} {type}">
      {#each legendItems as item}
        <div class="g-legend__item">
          <div
            class="g-legend__swatch"
            style="background-color: {item.color}"
          ></div>
          <span>{prefix || ""}{item.category}{suffix || ""}</span>
        </div>
      {/each}
    </div>
  {:else if type == "gradient"}
    <div class="g-legend__gradient-container">
      <div class="g-legend__gradient-bar-container">
        <span class="g-legend__gradient-bar" style="background: {gradient};"
        ></span>
        <div class="g-legend__gradient-labels">
          {#each values as value}
            <div class="g-legend__gradient-label">
              <span>{value}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else if type == "ruler"}
    <div class="g-legend__ruler">
      {#if minValue}
        <div class="g-legend__ruler-tick">
          <div class="g-legend__ruler-label">{minValue}</div>
        </div>
      {/if}
      {#each values as value, index}
        <div class="g-legend__ruler-item">
          <div
            class="g-legend__ruler-bar"
            style="background-color: {colors[index]};"
          ></div>
          <div class="g-legend__ruler-tick">
            <div class="g-legend__ruler-label">{value}</div>
          </div>
        </div>
      {/each}
      <div class="g-legend__ruler-item">
        <div
          class="g-legend__ruler-bar"
          style="background-color: {colors[colors.length - 1]};"
        ></div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .g-legend {
    margin: 0.25rem 0;
    filter: drop-shadow(0px 0px 5px #ccc);

    &.center {
      text-align: center;
    }

    &__title {
      padding-bottom: 0.5rem;
      display: block;
      font-weight: bold;
    }
    &__subtitle {
      margin-top: -0.5rem;
      padding-bottom: 0.5rem;
      display: block;
      font-weight: 300;
      font-style: italic;
    }

    &__items {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      flex-direction: var(--direction);
      font-size: 0.9rem;

      &.center {
        justify-content: center;
      }
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    &__swatch {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    &__gradient-container {
      display: flex;
      gap: 5px;
      padding-bottom: 5px;
      justify-content: center;
    }

    &__gradient-bar-container {
      margin-left: 10px;
      position: relative;
      width: 250px;
      padding-bottom: 14px;
      display: block;
    }

    &__gradient-bar {
      height: 14px;
      display: block;
    }

    &__gradient-labels {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-between;
      top: 0;
    }

    &__gradient-label {
      width: 1px;
      height: 20px;
      background-color: rgb(34, 34, 34);
      position: relative;
    }

    &__gradient-label span {
      position: absolute;
      top: 27px;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgb(101, 101, 104);
      font-size: 12px;
      white-space: nowrap;
    }

    &__ruler {
      display: flex;
      justify-content: center;
      @include mq("600px", "max-width") {
        margin-bottom: 15px;
      }
    }

    &__ruler-item {
      display: flex;
      align-items: start;
    }

    &__ruler-tick {
      width: 1px;
      height: 20px;
      background-color: #999;
      position: relative;
    }

    &__ruler-label {
      position: absolute;
      top: 27px;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgb(101, 101, 104);
      font-size: 12px;
    }

    &__ruler-bar {
      width: 35px;
      height: 14px;
    }
  }
</style>

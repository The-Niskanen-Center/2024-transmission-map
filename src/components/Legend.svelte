<script>
  export let values;
  export let colors;
  export let title = "";
  export let prefix = undefined;
  export let suffix = undefined;
  export let type;
  export let layout = "left";
  export let direction = "row";

  let legendItems = values.map((category, index) => ({
    category,
    color: colors[index],
  }));
</script>

<div class="g-legend {layout} " style:--direction={direction}>
  <b class="g-legend__title">{title}</b>
  <div class="g-legend__items {layout} {type}">
    {#each legendItems as item}
      <div class="g-legend__items__item">
        <div
          class="g-legend__items__item__swatch"
          style="background-color: {item.color}"
        ></div>
        <span>{prefix || ""}{item.category}{suffix || ""}</span>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .g-legend {
    margin: 0.25rem 0;

    &.center {
      text-align: center;
    }

    &__title {
      padding-bottom: 0.5rem;
      display: block;
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

      &__item {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        &__swatch {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }

      &.ruler {
        gap: 0px;
        .g-legend__items__item {
          display: flex;

          .g-legend__items__item__swatch {
            width: 15px;
            height: 20px;
            border-radius: 0;
          }
        }
      }
    }
  }
</style>

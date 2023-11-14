<template>
  <div ref="chartRef"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3';
import { rgb } from 'd3-color';

export default defineComponent({
  props: {
    data: {
      type: Array as () => number[],
      required: true
    },
    colors: {
      type: Array as () => string[],
      required: true
    },
    labels: {
      type: Array as () => string[],
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      const svg = d3.select(chartRef.value)
        .append('svg')
        .attr('width', props.size)
        .attr('height', props.size);

      const g = svg.append('g')
        .attr('transform', `translate(${props.size / 2}, ${props.size / 2})`);

      const pie = d3.pie<number>();

      const arc = d3.arc<PieArcDatum<number>>()
        .innerRadius(0)
        .outerRadius(props.size / 2);

      const arcs = pie(props.data);

      const path = g.selectAll('path')
        .data(arcs)
        .enter()
        .append('path')
        .attr('fill', (_d, i) => props.colors[i])
        .attr('stroke', '#ddd')
        .attr('stroke-width', 2)
        .attr('d', arc as any)
        .each(function(d, i) {
          d.index = i;
        });

      const tooltip = d3.select(chartRef.value).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

        path.on('mouseover', function(this: SVGPathElement, event: any, d: PieArcDatum<number>) {
          d3.select(this).attr('fill', clarify(props.colors[d.index], 0.4));
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(props.labels[d.index])
            .style("left", (d3.pointer(event)[0]) + "px")
            .style("top", (d3.pointer(event)[1]) + "px")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("padding", "10px")
            .style("font", "12px sans-serif")
            .style("border", "0px")
            .style("border-radius", "8px")
            .style("background-color", "#111827")
            .style("pointer-events", "none");
        });

        path.on('mousemove', function(_event: any, _d: PieArcDatum<number>) {
          tooltip.style("left", (d3.pointer(event)[0] + 500) + "px")
            .style("top", (d3.pointer(event)[1] + 180) + "px");
        });

        path.on('mouseout', function(this: SVGPathElement, _event: any, d: PieArcDatum<number>) {
          d3.select(this).attr('fill', props.colors[d.index]);

          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        } as any);
    });

    return { chartRef };
  }
});

function clarify(couleur: string, pourcentage: number): string {
  const color = rgb(couleur);
  color.r = Math.round(color.r + (255 - color.r) * pourcentage);
  color.g = Math.round(color.g + (255 - color.g) * pourcentage);
  color.b = Math.round(color.b + (255 - color.b) * pourcentage);
  return color.toString();
}
</script>
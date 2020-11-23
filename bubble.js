const data = [
  { name: 'news', parent: '' },
  { name: 'tech', parent: 'news' },
  { name: 'sport', parent: 'news' },
  { name: 'music', parent: 'news' },
  { name: 'ai', parent: 'tech', amount: 7 },
  { name: 'coding', parent: 'tech', amount: 5 },
  { name: 'tablets', parent: 'tech', amount: 4 },
  { name: 'laptops', parent: 'tech', amount: 6 },
  { name: 'd3', parent: 'tech', amount: 3 },
  { name: 'gaming', parent: 'tech', amount: 3 },
  { name: 'football', parent: 'sport', amount: 6 },
  { name: 'hockey', parent: 'sport', amount: 3 },
  { name: 'baseball', parent: 'sport', amount: 5 },
  { name: 'tennis', parent: 'sport', amount: 6 },
  { name: 'f1', parent: 'sport', amount: 1 },
  { name: 'house', parent: 'music', amount: 3 },
  { name: 'rock', parent: 'music', amount: 2 },
  { name: 'punk', parent: 'music', amount: 5 },
  { name: 'jazz', parent: 'music', amount: 2 },
  { name: 'pop', parent: 'music', amount: 3 },
  { name: 'classical', parent: 'music', amount: 5 },
]

const box = document.getElementById('section')
// create svg
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 900)
  .attr('height', 800)

// create graph group
const graph = svg.append('g')

const stratify = d3
  .stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent)

const rootNode = stratify(data).sum((d) => d.amount)

const pack = d3.pack().size([900, 800]).padding(5)

const bubbleData = pack(rootNode).descendants()

// create ordinal scale
const color = d3.scaleOrdinal(['#247ba0', '#50514f', '#c3b299'])

// join data and group for each node
const nodes = graph
  .selectAll('g')
  .data(bubbleData)
  .enter()
  .append('g')
  .attr('transform', (d) => `translate(${d.x}, ${d.y})`)

nodes
  .append('circle')
  .attr('r', (d) => d.r)
  .attr('stroke', 'white')
  .attr('stroke-width', 2)
  .attr('fill', (d) => color(d.depth))

nodes
  .filter((d) => !d.children)
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '.3em')
  .attr('fill', '#fffcff')
  .style('font-size', (d) => d.value * 5)
  .text((d) => d.data.name)

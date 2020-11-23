const dimensions = {
  height: 500,
  width: 1100,
  margin: 100,
}

const treeSvg = d3
  .select('.tree-canvas')
  .append('svg')
  .attr('height', dimensions.height + dimensions.margin)
  .attr('width', dimensions.width + dimensions.margin)

const treeGraph = treeSvg
  .append('g')
  .attr(
    'transform',
    `translate(${dimensions.margin / 2}, ${dimensions.margin / 2})`
  )

// data stratify
const stratifyTree = d3
  .stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent)

const tree = d3.tree().size([dimensions.width, dimensions.height])
// const colorScale = d3.scaleOrdinal(d3['schemeSet3'])
const colorScale = d3.scaleOrdinal([
  '#006466',
  '#0B525B',
  '#1B3A4B',
  '#272640',
  '#3E1F47',
  '#4D194D',
])

// update function
const update = (data) => {
  // remove current nodes
  treeGraph.selectAll('.node').remove()
  treeGraph.selectAll('.link').remove()

  // update ordinal scale
  colorScale.domain(data.map((d) => d.department))

  // get updated root node data
  const rootNode = stratifyTree(data)
  const treeData = tree(rootNode).descendants()

  // get nodes selection and join data
  const nodes = treeGraph.selectAll('.node').data(treeData)

  // get link selection and join data
  const links = treeGraph.selectAll('.link').data(tree(rootNode).links())

  // enter new links
  links
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#c3b299')
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)
    )

  // create enter node groups
  const enterNodes = nodes
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`)

  // append rects to enter nodes
  enterNodes
    .append('rect')
    .attr('fill', (d) => colorScale(d.data.department))
    .attr('stroke', '#50514f')
    .attr('stroke-width', 2)
    .attr('height', 50)
    .attr('width', (d) => d.data.name.length * 20)
    .attr('transform', (d) => `translate(-${d.data.name.length * 10}, -30)`)

  // append name text
  enterNodes
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', '#fffcff')
    .text((d) => d.data.name)
}

// access data
let currData = []

db.collection('employees').onSnapshot((res) => {
  res.docChanges().forEach((ch) => {
    const doc = { ...ch.doc.data(), id: ch.doc.id }

    switch (ch.type) {
      case 'added':
        currData.push(doc)
        break
      case 'modified':
        const index = currData.findIndex((it) => it.id === doc.id)
        currData[index] = doc
        break
      case 'removed':
        currData = currData.filter((it) => it.id !== doc.id)
        break
      default:
        break
    }
  })

  update(currData)
})

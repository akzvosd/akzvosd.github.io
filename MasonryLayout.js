const DEFAULT_CONFIG = {
  containerId: 'grid-layout-container',
  width: 1920,
  columns: 7,
  gap: 10,
  delay: 0.5,
  shuffleOnResize: true,
}

class MasonryLayout {
  isInitialized = false
  itemsOrder = []

  constructor({
    containerId = DEFAULT_CONFIG.containerId,
    width = DEFAULT_CONFIG.width,
    columns = DEFAULT_CONFIG.columns,
    gap = DEFAULT_CONFIG.gap,
    delay = DEFAULT_CONFIG.delay,
    shuffleOnResize = DEFAULT_CONFIG.shuffleOnResize,
  } = DEFAULT_CONFIG) {
    this.width = width
    this.initialColumns = columns
    this.gap = gap
    this.delay = delay
    this.shuffleOnResize = shuffleOnResize

    this.container = document.getElementById(containerId)

    this.container.style.position = 'relative'
    this.container.style.overflow = 'hidden'

    this.items = [...this.container.children]

    this.items.forEach((item, i) => {
      this.itemsOrder[i] = i

      item.style.position = 'absolute'
      item.style.transition = `${delay}s ease-in-out`
    })
  }

  #shuffle() {
    const order = this.itemsOrder

    for (let i = 0; i < this.items.length; i++) {
      const j = ~~(Math.random() * i)

      ;[order[i], order[j]] = [order[j], order[i]]
    }
  }

  #calcLayout(containerWidth = this.width) {
    const ratio = containerWidth / this.width

    this.columns = Math.round(ratio * this.initialColumns)

    const itemWidth =
      (containerWidth - (this.columns + 1) * this.gap) / this.columns

    this.items.forEach(item => {
      item.style.width = `${itemWidth}px`
    })

    if (this.isInitialized && this.shuffleOnResize) {
      this.#shuffle()
    }

    setTimeout(() => {
      let height = 0

      this.itemsOrder
        .map(i => this.items[i])
        .forEach((item, i, items) => {
          const itemAbove = items[i - this.columns]
          const row = ~~(i / this.columns)
          const column = i - row * this.columns
          const x = column * itemWidth + this.gap * (column + 1)
          const y =
            (itemAbove
              ? parseInt(itemAbove.style.top) + itemAbove.clientHeight
              : 0) + this.gap
          const h = y + item.clientHeight

          if (h > height) {
            height = h
          }

          item.style.left = `${x}px`
          item.style.top = `${y}px`
        })

      this.container.style.height = `${height + this.gap}px`
    }, this.delay * 1000)
  }

  init() {
    window.addEventListener('load', () => {
      let prevWidth = 0

      const observer = new ResizeObserver(([entry]) => {
        const { width } = entry.contentRect

        if (width === prevWidth) {
          return
        }

        prevWidth = width

        this.#calcLayout(width)

        if (!this.isInitialized) {
          this.isInitialized = true
        }
      })

      observer.observe(this.container)
    })
  }
}

new MasonryLayout({ shuffleOnResize: false }).init()

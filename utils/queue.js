class Queue {
    constructor() {
        this.queue = []
        this.instance = null
    }
    static getIntanse () {
        if (!this.instance) {
            this.instance = new Queue()
            return this.instance
        }
        return this.queue
    }
    enqueue (item) {
        this.queue.push(item)
    }
    dequeue () {
        return this.queue.shift()
    }
    front () {
        return this.queue[this.queue.length - 1]
    }
    isEmpty () {
        return this.queue.length === 0
    }
    size () {
        return this.queue.length
    }
    toString () {
        return this.queue.join(',').replace(/,/g, " ")
    }
}

function Node (data) {
    this.data = data
    this.next = null
}

class LinkedQueue {
    constructor() {
        this.head = null
        this.tail = null
        this.length = 0
    }
    enqueue (data) {
        const newNode = new Node(data)
        if (this.length === 0) {
            this.head = newNode
            this.tail = newNode
        } else {
            this.tail.next = newNode
            this.tail = newNode
        }
        ++this.length
    }
    dequeue () {
        if (this.length === 0) return
        const deleteContent = this.head
        if (this.length === 1) {
            this.head = null
            this.tail = null
        } else {
            this.head = this.head.next
        }
        --this.length
        return deleteContent
    }
    remove (name) {
        if (this.length === 0) return
        let current = this.head
        if (this.length === 1) {
            this.head = null
            this.tail = null
            --this.length
            return current
        }
        if (name === this.head.data.name) {
          --this.length
          this.head = this.head.next
          return current
        }
        let preCurrent = this.head
        while (current && current.data.name !== name) {
            preCurrent = current
            current = current.next
        }
        if (current) {
          --this.length
          if (!current.next) {
              preCurrent.next = null; 
              this.tail = preCurrent;
          } else {
              preCurrent.next = current.next
          }
        }
        return current
    }
    size () {
        return this.length
    }
    front () {
        return this.head
    }
    toString () {
        if (this.length === 0) return ''
        let resultStr = ''
        let current = this.head
        while (current) {
            resultStr += (JSON.stringify(current.data) + '\n')
            current = current.next
        }
        return resultStr
    }
}

module.exports = { Queue, LinkedQueue }
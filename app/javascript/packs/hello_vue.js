/* eslint no-console: 0 */

import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(TurbolinksAdapter)
Vue.use(VueResource)

document.addEventListener('turbolinks:load', () => {
  Vue.http.headers.common['X-CSRF-token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  var element = document.getElementById("note-form")

  if(element != null) {
    var note = JSON.parse(element.dataset.note)
    var items_attributes = JSON.parse(element.dataset.itemsAttributes)
    items_attributes.forEach((item) => item._destroy = null )
    note.items_attributes = items_attributes

    const app = new Vue({
      el: element,
      data() {
        return {
          calculatedTotal: 0,
          note: note
        }
      },
      computed: {
        generatedTotal() {
          return this.generateTotal()
        }
      },
      watch: {
        note: function() {
          this.generateTotal()
        }
      },
      methods: {
        generateTotal() {
          var incorrect = (this.note.items_attributes || []).reduce((total, item) => {
            return (total + (item.evaluation.match(/\-/g) || []).length)
          }, 0)

          var correct = (this.note.items_attributes || []).reduce((total, item) => {
            return (total + (item.evaluation.match(/\+/g) || []).length)
          }, 0)

          var ttal = Math.round((correct / (incorrect + correct)) * 100)
          return `${correct}/${incorrect + correct}=${ttal}%`
        },
        parse() {
          this.parseGoalType()
          this.parseDescription()
          this.parseTotal()
          this.parseItems()
          this.generateTotal()
        },
        parseGoalType() {
          var arr = this.note.content.match(/STG[0-9]|LTG[0-9]/) || []
          var goal = arr[0]
          this.note.goal_type = goal
        },
        parseDescription() {
          var txt = this.note.content 
          var description = txt.substring(txt.indexOf("*") + 1, txt.lastIndexOf("*"))
          if(description != "*") { this.note.description = description }
        },
        parseTotal() {
          var txt = this.note.content 
          var total = txt.substring(txt.indexOf("$") + 1, txt.lastIndexOf("$"))
          if(total != "$") { this.note.total = total }
        },
        parseItems() {
          var self = this

          var filter_items = this.note.content.split("\n").filter((item) => {
            return !(item.toLowerCase().match(/^\*|\*$/) || item.toLowerCase().includes('total'))
          })

          var mapped_items = filter_items.map((item, idx) => (
            { name: item.split(/\+|\-/)[0].replace(/:\s/g, ''),
              evaluation: self.resultsFilterer(item.split(/\w+/)[1]),
              id: null, 
              _destroy: null, 
              errors_made: self.produceErrors(filter_items[idx + 1] || '')
            }
          ))
          var items = mapped_items.filter((item) => {
            return !(item.name.toLowerCase().match(/^errors/))
          });

          this.note.items_attributes = items
          return items
        },
        produceErrors(possible_errors) {
          if ((possible_errors).toLowerCase().match(/^errors/)) {
            return possible_errors.toLowerCase().replace(/^errors/g, '').replace(/:/g, '').replace(/0/g, '')
          } else {
            return ''
          }
        },
        resultsFilterer(chars) {
          if(chars.indexOf(' ') >= 0 || chars.indexOf(':') >= 0 ) {
            return chars.replace(/\s|\:/g, '')
          } else {
            return chars
          }
        },
        addItem() {
          this.note.items_attributes.push({
            id: null, 
            _destroy: null, 
            name: "", 
            errors_made: "", 
            evaluation: "" 
          })
        },
        removeItem(index) {
          var item = this.note.items_attributes[index]

          if(item.id == null) {
            this.note.items_attributes.splice(index, 1)
          } else {
            this.note.items_attributes[index]._destroy = "1"
          }
        },
        retrieveItem(index) {
          this.note.items_attributes[index]._destroy = null
        },
        generateItemTotal(evaluation) {
          var ttal = 0
          var correct = (evaluation.match(/\+/g) || []).length
          var incorrect = (evaluation.match(/\-/g) || []).length
          var total = correct + incorrect

          if(total > 0) {
            ttal = Math.round((correct / total) * 100)
          }

          return ttal
        },
        saveNote() {
          var ttal = this.generatedTotal
          var self = this 

          this.note.total = ttal.substring(ttal.indexOf("=") + 1, ttal.lastIndexOf("%"))
          this.note.items_attributes = this.note.items_attributes.map((item) => {
            item.total = self.generateItemTotal(item.evaluation)
            return item
          })

          if (this.note.id == null) {
            this.$http.post("/notes", { note: this.note }).then(response => {
              Turbolinks.visit(`/notes/${response.body.id}`)
            }, response => {
              console.log(response, "failed huh?")
            })
          } else {
            this.$http.put(`/notes/${this.note.id}`, { note: this.note }).then(response => {
              Turbolinks.visit(`/notes/${response.body.id}`)
            }, response => {
              console.log(response, "failed huh?")
            })
          }
        },
        cancel() {
          Turbolinks.visit('/notes')
        }
      }
    })
  }
})


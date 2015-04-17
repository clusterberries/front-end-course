var app=app||{},ENTER_KEY=13,ESC_KEY=27;$(function(){"use strict";new app.AppView});
var app=app||{};!function(){"use strict";var e=Backbone.Collection.extend({model:app.Todo,localStorage:new Backbone.LocalStorage("todos-backbone"),completed:function(){return this.where({completed:!0})},remaining:function(){return this.where({completed:!1})},nextOrder:function(){return this.length?this.last().get("order")+1:1},comparator:"order"});app.todos=new e}();
var app=app||{};!function(){"use strict";app.Todo=Backbone.Model.extend({defaults:{title:"",completed:!1},toggle:function(){this.save({completed:!this.get("completed")})}})}();
var app=app||{};!function(){"use strict";var t=Backbone.Router.extend({routes:{"*filter":"setFilter"},setFilter:function(t){app.TodoFilter=t||"",app.todos.trigger("filter")}});app.TodoRouter=new t,Backbone.history.start()}();
var app=app||{};!function(t){"use strict";app.AppView=Backbone.View.extend({el:"#todoapp",statsTemplate:_.template(t("#stats-template").html()),events:{"keypress #new-todo":"createOnEnter","click #clear-completed":"clearCompleted","click #toggle-all":"toggleAllComplete"},initialize:function(){this.allCheckbox=this.$("#toggle-all")[0],this.$input=this.$("#new-todo"),this.$footer=this.$("#footer"),this.$main=this.$("#main"),this.$list=t("#todo-list"),this.listenTo(app.todos,"add",this.addOne),this.listenTo(app.todos,"reset",this.addAll),this.listenTo(app.todos,"change:completed",this.filterOne),this.listenTo(app.todos,"filter",this.filterAll),this.listenTo(app.todos,"all",this.render),app.todos.fetch({reset:!0})},render:function(){var t=app.todos.completed().length,e=app.todos.remaining().length;app.todos.length?(this.$main.show(),this.$footer.show(),this.$footer.html(this.statsTemplate({completed:t,remaining:e})),this.$("#filters li a").removeClass("selected").filter('[href="#/'+(app.TodoFilter||"")+'"]').addClass("selected")):(this.$main.hide(),this.$footer.hide()),this.allCheckbox.checked=!e},addOne:function(t){var e=new app.TodoView({model:t});this.$list.append(e.render().el)},addAll:function(){this.$list.html(""),app.todos.each(this.addOne,this)},filterOne:function(t){t.trigger("visible")},filterAll:function(){app.todos.each(this.filterOne,this)},newAttributes:function(){return{title:this.$input.val().trim(),order:app.todos.nextOrder(),completed:!1}},createOnEnter:function(t){t.which===ENTER_KEY&&this.$input.val().trim()&&(app.todos.create(this.newAttributes()),this.$input.val(""))},clearCompleted:function(){return _.invoke(app.todos.completed(),"destroy"),!1},toggleAllComplete:function(){var t=this.allCheckbox.checked;app.todos.each(function(e){e.save({completed:t})})}})}(jQuery);
var app=app||{};!function(e){"use strict";app.TodoView=Backbone.View.extend({tagName:"li",template:_.template(e("#item-template").html()),events:{"click .toggle":"toggleCompleted","dblclick label":"edit","click .destroy":"clear","keypress .edit":"updateOnEnter","keydown .edit":"revertOnEscape","blur .edit":"close"},initialize:function(){this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"destroy",this.remove),this.listenTo(this.model,"visible",this.toggleVisible)},render:function(){return void 0===this.model.changed.id?(this.$el.html(this.template(this.model.toJSON())),this.$el.toggleClass("completed",this.model.get("completed")),this.toggleVisible(),this.$input=this.$(".edit"),this):void 0},toggleVisible:function(){this.$el.toggleClass("hidden",this.isHidden())},isHidden:function(){return this.model.get("completed")?"active"===app.TodoFilter:"completed"===app.TodoFilter},toggleCompleted:function(){this.model.toggle()},edit:function(){this.$el.addClass("editing"),this.$input.focus()},close:function(){var e=this.$input.val(),t=e.trim();this.$el.hasClass("editing")&&(t?(this.model.save({title:t}),e!==t&&this.model.trigger("change")):this.clear(),this.$el.removeClass("editing"))},updateOnEnter:function(e){e.which===ENTER_KEY&&this.close()},revertOnEscape:function(e){e.which===ESC_KEY&&(this.$el.removeClass("editing"),this.$input.val(this.model.get("title")))},clear:function(){this.model.destroy()}})}(jQuery);
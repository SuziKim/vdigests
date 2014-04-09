
/*global define */
define(["backbone", "underscore", "jquery", "editing-interface/collections/section-collection", "editing-interface/models/section-model"], function (Backbone, _, $, SectionCollection, SectionModel) {

  return Backbone.Model.extend({
    defaults: function () {
      return {
        sections: new SectionCollection(),
        startWord: null,
        title: ""
      };
    },

    switchStartWord: function (oldWord, newWord) {
      var thisModel = this;
      thisModel.set("startWord", newWord);
      thisModel.listenToOnce(newWord, "change:switchStartWord", thisModel.switchStartWord);
    },

    initialize: function () {
      var thisModel = this,
          startWord = thisModel.get("startWord");
      // FIXME HACK to keep track of videos
      thisModel.set("vct", window.vct++);
      thisModel.switchStartWordListeners(null, startWord);

      // chapters should always have at least one section
      if (thisModel.get("sections").length === 0) {
        startWord.set("startSection", true, {silent: true});
        thisModel.get("sections").add(new SectionModel({startWord: startWord}));
      }
    },

    switchStartWordListeners: function (oldWord, newWord) {
      var thisModel = this;
      thisModel.listenToOnce(newWord, "change:switchStartWord", thisModel.switchStartWord);
      thisModel.listenTo(newWord, "startVideo", function (stTime) {
        thisModel.trigger("startVideo", stTime);
      });
      if (oldWord) {
        thisModel.stopListening(oldWord);
      }
    }
  });
});

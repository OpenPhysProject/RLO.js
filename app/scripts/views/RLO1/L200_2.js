OER.Views = OER.Views || {};
OER.Views.RLO1 = OER.Views.RLO1 || {};

(function () {
    'use strict';

    OER.Views.RLO1.L200_2 = Backbone.View.extend({

        template: JST['app/scripts/templates/RLO1/L200_2.ejs'],


        events: {},

        initialize: function () {
            //this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function () {
            this.setElement(this.template());
        }

    });

})();
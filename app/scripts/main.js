(function (scope) {
    "use strict";
    
    var Application = function () {
        this.init();
    };
    var p = Application.prototype;
    
    p.Models = {};
    p.Collections = {};
    p.Views = {};
    p.Routers = {};
    
    p.homeView = null;
    p.outroTile = null;
    p.RLOBaseView = null;
    p.loader = null;
    p.logo = null;
    
    p.RLOs = null;
    
    p.init = function () {
        this.loader = new scope.Loader();
        this.homeView = $(".rlo-list");
        this.outroTile = $(".outro-tile", this.homeView);
        this.logo = $(".logo");
        
        this.setTileMinHeight();
                
        this.loadData();
        this.createTileView();
        
        this.RLOBaseView = new OER.Views.RLOBaseView(this.RLOs.at(0));
        $(".rlo-view-container").append(this.RLOBaseView.el);
        
        // todo start preloading assets with PreloadJS
        this.setUpRouter();
        this.logo.click("click", this.handleLogoClick);
        this.loader.hide();
    };
    
    p.setTileMinHeight = function ($el) {
        var introTile =   $(".intro-tile", this.homeView);
        var h = $(".rlo-tile-content-container-intro", introTile).height() + this.logo.outerHeight() + this.logo.position().top;
        introTile.css("min-height", h);
        
        h = $(".rlo-tile-content-container", this.outroTile).height();
        this.outroTile.css("min-height", h);
    };
      
    p.loadData = function () {
       this.RLOs = new scope.Collections.RLOCollection();
       var m = new scope.Models.RLOModel(OER.data.RLO1, {parse: true, viewPath: "RLO1"});
       this.RLOs.add(m);
       m  =  new scope.Models.RLOModel(OER.data.RLO2, {parse: true, viewPath: "RLO2"});
       this.RLOs.add(m);
    };
    
    p.setUpRouter = function () {
        scope.router = new scope.AppRouter();

        // Listen for specific changes
        scope.router.on("route:default", this.showHomeView, this);
        scope.router.on("route:rlo", this.showRLOView, this);

        this.parseFirstRoute();
        Backbone.history.start({ pushState: true });
        //Backbone.history.start({pushState:!!window.history});
    };
    
    /**
     * Check the first route for hashbangs.
     * @method parseFirstRoute
     */
    p.parseFirstRoute = function () {
        var route = window.location.hash;
        if (/^#!\//.test(route)) {
            route = route.substr(3); // strip hashbang
            // rewrite the hash, since it is what Backbone reads when start is called.
            if (!!window.history) {
                    window.history.replaceState({}, '', route);
            } else {
                    window.location.replace(route);
            }
        }
    };

    
    p.createTileView = function() {
        var v;
        for (var i = 0, l = this.RLOs.length; i < l; i++ ) {
            v = new scope.Views.RLOTileView({model:this.RLOs.at(i)});
            this.outroTile.before(v.el);
        }
    };
    
    p.showHomeView = function() {
        this.RLOBaseView.hide();
        this.homeView.removeClass("out");
        this.homeView.addClass("in");
        this.logo.removeClass("mini");
        window.scrollTo(0,1);   // OJR hides chrome on mobile browser
    };
    
    p.showRLOView = function(rloRoute, contentRoute) {
        var m = this.RLOs.findWhere({route: rloRoute});
        if(!m) {
            scope.router.go("");
            return;
        }
        
        this.homeView.removeClass("in");
        this.homeView.addClass("out");
        
        this.RLOBaseView.updateModel(m);
        
        // determine if we have already visited this learning object.  If so, return to same place
        var lcc = m.get("lastCurrentCollection");
        if(!contentRoute && lcc) {
            contentRoute = lcc.lastCurrent.get("route");
        }
        
        if(contentRoute) {
            scope.router.noEventReplaceHistoryGo(rloRoute+"/"+contentRoute);
            this.RLOBaseView.updateSubViews(contentRoute);
            this.RLOBaseView.show();
        } else {
            this.RLOBaseView.showIntro();
        }
        
        this.logo.addClass("mini");
    };
    
    p.handleLogoClick = function (){
      scope.router.go();  
    };
    
    scope.Application = Application;

})(window.OER = window.OER || {});

$(document).ready(function () {
    'use strict';
    
    $(function() {FastClick.attach(document.body);});

    MathJax.Hub.Config({
        config: ["MMLorHTML.js"],
        jax: ["input/TeX","input/MathML","output/HTML-CSS","output/NativeMML"],
        extensions: ["tex2jax.js","mml2jax.js","MathMenu.js","MathZoom.js"],
        TeX: {
          extensions: ["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js"]
        }
    });

    var app = new OER.Application();
});
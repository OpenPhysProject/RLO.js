/* OER is our project namespace, used to avoid collisions with other project and browser supported code
 * OER.Views is the scope we use for views to keep things organized
 * OER.Views.Sandbox is the scope for views for this content
 * the || {} is creating an empty object for this if it does not exist already
 */
OER.Views = OER.Views || {};    
OER.Views.ElectronicStructureOfTheAtom = OER.Views.ElectronicStructureOfTheAtom || {};

(function () {
    'use strict';
    
    var p = {};     // prototype for this class
    var s = {};     // static for this class
    
    p.template= JST['app/content/lesson1/templates/Row3_Col3.ejs'];     // template used to create html for this view
    p.events = {};  // events, used by backbone to set up event handlers on html elements

    p.button = null;        // html button element    
    p.stage = null;         // easeljs stage
    p.width = null;         // stage width
    p.height = null;        // stage height
    p.electrons = null;     // array of easeljs shapes
    p.nucleus = null;       // easeljs shape
     
    p.tickerBind = null;    // reference to bound function, binding lets us call back in this scope
    p.buttonBind = null;    // reference to bound function
    
    /**
     * backbone initialize function
     * called on creation by OER.LessonBaseView.updateContent
     * @param {Backbone.Model} model A NavCardModel with related data 
     */
    p.initialize = function (model) {
        if (model) { this.model = model; }
        //this.listenTo(this.model, 'change', this.render);
        this.render();
    };

    /**
     * backbone render function, which builds html from template
     * called by initialize
     */
    p.render = function () {
        if(this.model) {
            this.setElement(this.template(this.model.toJSON()));    // create the html for this view
        } else {
            this.setElement(this.template());
        }
        
        // setup reference to button and click listener
        this.button = $(".lesson-content-button", this.$el)[0];    // $ is jquery, this.$el is this views html as a jquery object
        this.buttonBind = this.handleButton.bind(this);     // create reference to bound function, binding makes a function be called in this scope
        this.button.addEventListener("click", this.buttonBind); //

        // setup createjs stage and touch support
        var c = $(".lesson-content-canvas-sandbox", this.$el)[0];
        this.stage = new createjs.Stage(c);
        if (createjs.Touch.isSupported()) {createjs.Touch.enable(this.stage);}
        this.width = c.width;
        this.height = c.height;
        
       // draw Static circle (nucleus)
        this.nucleus = new createjs.Shape();
        this.nucleus.graphics.beginFill("Red").drawCircle(0, 0, 16);
        this.nucleus.x =  this.electronProps.originX; // x position
        this.nucleus.y =  this.electronProps.originY;
        this.stage.addChild(this.nucleus);  // add this shape to the stage
        
        // draw circle (electron)
        this.electrons = [];    // create empty array
        this.handleButton();

        // set up createjs ticker to update stage
        createjs.Ticker.timingMode = createjs.Ticker.RAF;   // sets ticks to happen on browser request animation frame
        this.tickerBind = this.tick.bind(this);
        createjs.Ticker.addEventListener("tick", this.tickerBind);
    };
    
    /**
     * createjs tick event, that is run multiple frames per second
     * called by createjs tick event
     * @param {type} event
     */
    p.tick = function(event) {
        // update the stage
        this.stage.update(event);   // redraw shapes on the stage
    };

    /*
     * clean up stage events and call super remove
     * called by OER.lessonBaseView
     * @param {type} options
     */
    p.remove = function(options) {
        this.button.removeEventListener("click");
        if (createjs.Touch.isSupported()) {createjs.Touch.disable(this.stage);}
        createjs.Ticker.removeEventListener("tick", this.tickerBind);

        Backbone.View.prototype.remove.call(this, options);
    };
    
    /**
     * click listener for button
     */
    p.handleButton = function() {
        var e = this.drawElectron();
        this.stage.addChild(e); // add electron to stage
        this.electrons.push(e); // add electron to array
    };

// ELECTRON CODE *********************************************************************************
    // Math for orbiting 
    p.electronProps = {
        angle:    0.0,   angleDelta: 6,         // initial angle, with randomization
        angleInc: 0.04,  angleIncDelta: 0.02,
        originX: 200,    originY: 100,
        radius:  160,    dr:       40,   // starting Orbital Radius and random element
    };
    
    // draw electron and add it to stage
    p.drawElectron = function() {
        // Actual Orbital radius
        var radius = Math.round(this.electronProps.radius + Math.random()*this.electronProps.dr);
        
        var electron = new createjs.Shape();
        electron.graphics.beginFill("Blue").drawCircle(0, 0, 8); // electron radius
        electron.x =  this.electronProps.originX;           // initial x position
        electron.y =  this.electronProps.originY + radius;
        electron.on("tick",this.electronTick);  // add tick listener to electron, which is called by createjs tick event
        
        // Define parameters to be used for each tick
        var v = electron.tickProps = {};
        v.originX     = this.electronProps.originX;
        v.originY     = this.electronProps.originY;
        v.angle       = Math.random()*this.electronProps.angleDelta + this.electronProps.angle;
        v.angleInc   = Math.random()*this.electronProps.angleIncDelta + this.electronProps.angleInc;
        v.radius      = radius;
        return electron;
    };
   
   // ============== EVOLUTION ================ //
    p.electronTick = function () {
        // Electron spirals in to nucleus
        if (this.tickProps.radius > 6) { 
            this.tickProps.radius = this.tickProps.radius-1; // radius decreases
            this.tickProps.angleInc *= 1.005;                // make the angle change faster
        }
        else{
            
        }
        ;
        var angle= this.tickProps.angle;
        this.x = this.tickProps.originX + this.tickProps.radius*Math.sin(angle);  // speed
        this.y = this.tickProps.originY + this.tickProps.radius*Math.cos(angle);
        this.tickProps.angle += this.tickProps.angleInc;
    };

    // add the above code as a backbone view class in our namespace
    OER.Views.ElectronicStructureOfTheAtom.SolarSystem = Backbone.View.extend(p, s);    

})();
spec(function(){
    // Specify your query objects here.
    var queries = {      
        submitBtn: {id: "submit"},
    };

    // Specify variables used by various steps here.
    var SPAN_TEXT = "my span";

    // Define your steps here. Use 'ios', 'android' and  'wp8' fields to specify OS specific actions
    // and 'default' fileds to specify common action.
    var stepRepository = {
        "launch application": {
            'ios': [
                ios.launch('yourApplicationUrl://')
            ],
            'android': [
                android.launch('you.application.identifier')
            ],
            'wp8': [
                wp8.launch('yourApplicationUrl'),
            ]
        },

        "click submit button": {
            'default': [
                web.click(queries.submitBtn)
            ]
        }
    };

    // Describe your suite here. 
    // Note that the steps are defined using a step definitions
    // object instead of being defined inline.
    describe("My Suite", function(){

        test("Launch, Verify, Click", function(){
            step("launch application");
            step("click submit button");
        });
    }, stepRepository);
});

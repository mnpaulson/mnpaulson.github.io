//////////////////////////////////
// Buttons                      //
//////////////////////////////////


//Copies the most recent turn and puts it below
function addTurn() {
    $(".turn").last().clone().insertAfter($(".turn").last());
    $(".turn-num-name").last().text("Turn " + $(".turn-num-name").length);
    turns = $('.turn').length;
    $(".turn").last().removeClass("turn-" + (turns - 1));
    $(".turn").last().addClass("turn-" + turns);
    $(".turn-" + turns).data("turn", turns);

    var turnString = getTurnObject(turns - 1);
    setTurnValues(turnString, turns);
}

//Delete the most recent turn
function delTurn() {
    if ($(".turn").length > 1) $(".turn").last().remove();
}

//Toggles display of ability/item options
function abilityOptions(btn) {
    var action = btn.find('input').val();

    if (action === "ability" || action === "item") {
        if (btn.parents('.unit-action').find('.ability-options').hasClass('hidden')) {
            btn.parents('.unit-action').find('.ability-options').toggleClass('hidden');
        }
    } else {
        if (!btn.parents('.unit-action').find('.ability-options').hasClass('hidden')) {
            btn.parents('.unit-action').find('.ability-options').toggleClass('hidden');
        }
    }
}

//toggles display of the main turn options
function toggleOptions(btn) {
    btn.parents(".card").children('.card-block').children(".turn-options").toggleClass("hidden");
}

//Toggle display of turns timing menu
function toggleAdvanced(btn) {
    btn.parents(".turn-options").children(".advanced-options").toggleClass("hidden");
}

//Toggle display of the turns data menu
function toggleData(btn) {
    btn.parents(".turn-options").children(".data-options").toggleClass("hidden");
}


//Toggles display of the dualcast ability selects
function toggleDualCast(btn) {
    btn.button('toggle');
    btn.siblings('select').prop('disabled', function (i, v) {
        return !v;
    });
}

//Moves the clicked unit order up by one.
function unitOrderUp(btn) {
    var form = btn.parents(".delay-unit-form");
    form.prev().insertAfter(form);
}

//Moves the clicked unit order down by one.
function unitOrderDown(btn) {
    var form = btn.parents(".delay-unit-form");
    form.next().insertBefore(form);
}

//Calls the main macro building function and outputs the result to the output box
function generate() {
    var macro = buildMacro();
    $("#output").val("");
    $("#output").val(macro);
    $('.total-time').text(timeToString(time));
}

function generateNox() {
    macro = convertToNox();
    $("#output").val("");
    $("#output").val(macro);
    $('.total-time').text(timeToString(time));
}

//Toggles display of the manual companion select delay entry
function toggleManualComp() {
    if ($('.manual-box').is(':checked') && $(".manual-time-form").hasClass("hidden")) {
        $(".manual-time-form").toggleClass("hidden");
    }
    if ($('.manual-box').is(':checked') === false && $(".manual-time-form").hasClass("hidden") === false) {
        $(".manual-time-form").toggleClass("hidden");
    }
}

//Copies contents of the output box to clipboard
function copy() {
    $("#output").select();
    document.execCommand('copy');
}

//Copies the contents of the turn export box to clipboard
function copyTurn(btn) {
    btn.parents(".data-options").find(".import-export").select();
    document.execCommand('copy');
}

function copyMacroData() {
    $(".macro-import-export").select();
    document.execCommand('copy');
}

//////////////////////////////////
// String Generators            //
//////////////////////////////////

//Global Variables, don't hate
var time = 0;
var vinput = "--VINPUT--MULTI:1:";
var clickWait = 10000;
var endClick = "--VINPUT--MULTI:1:1:0:1578\r\n";
var mouse = "--VINPUT--MOUSE:392:1276\r\n";
var unitLoc = ['--VINPUT--MULTI:1:0:860:535\r\n',
    '--VINPUT--MULTI:1:0:860:100\r\n',
    '--VINPUT--MULTI:1:0:980:535\r\n',
    '--VINPUT--MULTI:1:0:980:100\r\n',
    '--VINPUT--MULTI:1:0:1100:535\r\n',
    '--VINPUT--MULTI:1:0:1100:100\r\n'
];
var autoLoc = "0:1230:630\r\n";
var repeatLoc = "0:1230:450\r\n";
var backLoc = "0:241:633\r\n"
var closeNoNrgLoc = "0:790:350\r\n";
var closeDailyLoc = "0:790:535\r\n";

//Delay Global variables
var startWait; //wait after selecting mission before next button
var companionScrollWait; //Wait before scrolling companion screen
var companionClickWait; //Wait before clicking companion
var departWait; //wait before clicking depart
var beginWait; //wait before begining first turn after depart
var finalTurnWait; //Additional wait time afer last turn
var abilityWait = 500000; //Wait between setting unit abilities
var rewards = false; //Include or exclude additional results screen


var unitColLoc = ["535", "100", "535", "100", "535", "100"];
var unitRowLoc = ["860", "860", "980", "980", "1100", "1100"];

//Calls main macro building functions, returns complete macro
function buildMacro() {
    var macro = "";
    var start = false;
    var end = false;
    time = 100000;

     if ($(".include-start-box").is(':checked')) {
        start = true;
     }
     if ($(".include-end-box").is(':checked')) {
        end = true;
     }

    setWaitValues();

    if (start) {
        macro += getMissionString();
        macro += getStartNextString();
        macro += getCompanionString();
        macro += getDepartString();
    }

    macro += getTurnsString();

    if (end) {
        macro += getEndSkipString();
        macro += getDailyQuestString();
        macro += getEndWaitString();
    }

    return macro;
}

//Builds and returns string for selecting mission
function getMissionString() {
    var macro = "";
    var mission;

    mission = parseInt($("#mission-num").val());

    switch (mission) {
        case 1:
            macro += time + vinput + "0:452:660\r\n";
            break;
        case 2:
            macro += time + vinput + "0:634:660\r\n";
            break;
        case 3:
            macro += time + vinput + "0:828:660\r\n";
            break;
        case 4:
            macro += time + vinput + "0:1020:660\r\n";
            break;
        case 5:
            macro += time + vinput + "0:1205:660\r\n";
            break;
        case 6:
            macro += scroll('down');
            macro += scroll('down');
            addTime(1000000);
            macro += time + vinput + "0:1205:660\r\n";
            break;
    }

    macro += getTime() + endClick;

    return macro;
}

//Builds and returns string to click the next button after mission select
function getStartNextString() {
    var macro = "";

    addTime(startWait);

    macro += getTime() + vinput + "0:1123:360\r\n";
    macro += getTime() + endClick;
    macro += getTime() + mouse;

    return macro;
}

//Builds and returns the string for companion select based on options
function getCompanionString() {
    var macro = "";
    var customDelay;

    addTime(companionScrollWait);

    if (!$('.manual-box').is(":checked")) {

        //Select 3rd Companion Option
        if ($("input[name='companion']:checked").val() == "true") {
            addTime(companionClickWait);
            macro += getTime() + vinput + "0:445:660\r\n";
        }

        //Click and drag scroll bar to bottom
        if ($("input[name='companion']:checked").val() == "false") {
            macro += getTime() + vinput + "0:458:10\r\n";
            var y = 459;
            while (y < 1220) {
                y++;
                macro += (time += 1000) + vinput + "2:" + y + ":10\r\n";
            }
            macro += getTime() + endClick;
            addTime(companionClickWait);
            macro += getTime() + vinput + "0:1201:364\r\n";
        }

        macro += getTime() + endClick;

    } else {
        customDelay = parseInt($(".manual-time-value").val()) * 1000000;
        addTime(customDelay);
    }

    return macro;
}

//builds and returns string to click depart button
function getDepartString() {
    var macro = "";

    addTime(departWait);
    macro += getTime() + vinput + "0:1127:435\r\n";
    macro += getTime() + endClick;
    macro += getTime() + mouse;
    addTime(beginWait);

    return macro;
}


//Build and return main turn macro string
function getTurnsString() {
    var macro = "";
    var turns;
    var unit;
    var action;
    var ability;
    var target;
    var dc;
    var ab1;
    var ab2;
    var delays = [];
    var order = [];
    var skip = [false, false, false, false, false];
    var adv;
    var delayForm;
    var repeat;
    var auto;

    //Count how many turns
    turns = $('.turn').length;

    //For Each turn get each action
    for (var i = 0; i < turns; i++) {
        repeat = $(".turn-" + (i + 1)).find("input[name='repeat']:checked").val();
        auto = $(".turn-" + (i + 1)).find("input[name='auto']:checked").val();
        skip = [false, false, false, false, false];

        //For each unit
        for (var j = 1; j < 7; j++) {

            unit = j;
            action = $(".turn-" + (i + 1)).find("input[name='unit-" + j + "-action']:checked").val();
            ability = $(".turn-" + (i + 1)).find('.unit-' + j + '-action').find('.ability-select').val();
            target = $(".turn-" + (i + 1)).find('.unit-' + j + '-action').find('.target-select').val();
            if ($(".turn-" + (i + 1)).find('.unit-' + j + '-action').find("input[name='dualcast']:checked").val() === "true") {
                dc = true;
            } else {
                dc = false;
            }
            ab1 = $(".turn-" + (i + 1)).find('.unit-' + j + '-action').find('.dc1-ability-select').val();
            ab2 = $(".turn-" + (i + 1)).find('.unit-' + j + '-action').find('.dc2-ability-select').val();
            macro += getActionString(unit, action, ability, target, dc, ab1, ab2);
            addTime(abilityWait);
            if (action === "none") {
                skip[j] = true;
            } else {
                skip[j] = false;
            }
        }

        //Activate Units in order
        order = [];
        delays = [];
        adv = $(".turn-" + (i + 1)).find(".advanced-options");
        delayForm = adv.find(".delay-unit-form");
        delayForm.each(function (index) {
            order.push(parseInt($(this).data("unit")));
            delays.push(parseInt($(this).find(".delay-value").val()) * 1000);
        });

        //Build activate string
        for (var y = 0; y < 6; y++) {
            if (skip[order[y]]) continue;
            macro += "" + (time += delays[y]) + unitLoc[order[y] - 1];
            macro += (time += 1) + endClick;
        }

        //Activate repeat/auto if enabled
        if (repeat === "repeat") {
            macro += getTime() + vinput + repeatLoc;
            macro += getTime() + endClick;
        }
        if (auto === "auto") {
            macro += getTime() + vinput + autoLoc;
            macro += getTime() + endClick;
            macro += getTime() + vinput + autoLoc;
            macro += getTime() + endClick;
        }

        //Wait before executing next turn

        addTime(parseInt($(".turn-" + (i + 1)).find(".advanced-options").find(".turn-delay").val()) * 1000000);
        //Check if final turn and add finalTurnWait
        if (i === (turns - 1)) {
            addTime(finalTurnWait);
        }
    }

    return macro;
}

//builds and returns string to progress though mission complete screens
function getEndSkipString() {
    var macro = "";

    //Corner clicks to skip
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;

    //Wait 1 second
    addTime(1000000);

    //Next Click
    macro += getTime() + vinput + "0:1120:350\r\n";
    macro += getTime() + endClick;
    macro += getTime() + mouse;

    //wait 3 seconds
    addTime(3000000);

    //More Skips
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;

    //wait 3 seconds
    addTime(3000000);

    if ($(".rewards-skip-box").is(':checked')) {
        macro += getTime() + vinput + "0:1275:718\r\n";
        macro += getTime() + endClick;
        macro += getTime() + vinput + "0:1275:718\r\n";
        macro += getTime() + endClick;
        macro += getTime() + vinput + "0:1275:718\r\n";
        macro += getTime() + endClick;

        //wait 3 seconds
        addTime(3000000);

        //Next Click
        macro += getTime() + vinput + "0:1120:350\r\n";
        macro += getTime() + endClick;
        macro += getTime() + mouse;

        //wait 3 seconds
        addTime(3000000);
    }

    //More Skips
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;

    //wait 2 seconds
    addTime(3000000);

    //Next Click
    macro += getTime() + vinput + "0:1120:350\r\n";
    macro += getTime() + endClick;
    macro += getTime() + mouse;

    return macro;
}

//Builds and returns string to close daily quest dialog
function getDailyQuestString() {
    var macro = "";
    macro += getTime() + mouse;

//Step  | Action            |                          Resulting State
//   -  |   -               | Daily No NRG  | No Daily No NRG   | Daily w\NRG       | No Daily w\NRG
//   1  | Close Dialy       | Mission Select| No NRG Window     | Mission Select    | Mission Rewards
//   2  | Mission Select    | No NRG Window | No NRG Window     | Mission Rewards   | Missionn Rewards
//   3  | Back + Close NRG  | Mission Select| Mission Select    | Mission Select    | Mission Select  

    if ($(".daily-dialog-box").is(':checked')) {

        //Wait 3 seconds for load
        addTime(3000000);

        //Close Daily (Step 1)
        macro += getTime() + vinput + closeDailyLoc;
        macro += getTime() + endClick;

        //Mission Select (Step 2)
        //Use current Mission to make sure it exists (helps with Raids where position will be off)
        addTime(5000000);
        macro += getMissionString();

        //Click back and then immediatly Close No NRG window (Step 3)
        macro += getTime() + mouse;
        addTime(1000000);
        macro += getTime() + vinput + backLoc;
        macro += getTime() + endClick;
        addTime(100000);
        macro += getTime() + vinput + closeNoNrgLoc;
        macro += getTime() + endClick;
        macro += getTime() + mouse;

    }

    return macro;
}

//Increments and returns the current time
function getTime() {
    return time += clickWait;
}

//Adds a specified amount of time to the global variable
function addTime(amount) {
    time += amount;
}

//Builds the string for specific actions (ability usage, defed, items)
function getActionString(unit, action, ability, target, dc, ab1, ab2) {
    var macro = "";
    var pos = [1, 2, 3, 4, 5, 6];
    ability = parseInt(ability);
    target = parseInt(target);
    ab1 = parseInt(ab1);
    ab2 = parseInt(ab2);
    var j;

    switch (action) {
        case "attack":
            //No String needed
            break;
        case "defend":
            //Press unit
            macro += getTime() + unitLoc[unit - 1];
            //Scroll down 100 px
            for (var i = 0; i < 100; i++) {
                macro += (time += 5000) + vinput + "2:" + (parseInt(unitRowLoc[unit - 1]) + i) + ":" + unitColLoc[unit - 1] + "\r\n";
            }
            //Release
            macro += getTime() + endClick;
            break;
        case "ability":

            //Press unit
            macro += getTime() + unitLoc[unit - 1];
            //scroll right
            for (var i = 0; i < 100; i++) {
                macro += (time += 5000) + vinput + "2:" + unitRowLoc[unit - 1] + ":" + (parseInt(unitColLoc[unit - 1]) - i) + "\r\n";
            }
            macro += getTime() + endClick;

            //Scroll to ability Position
            addTime(500000);
            //Find and click on ability
            while (true) {
                if (pos.indexOf(ability) === -1) {
                    if (ability > pos[5]) {
                        macro += scroll("down");
                        for (j = 0; j < 6; j++) {
                            pos[j] += 2;
                        }
                    } else if (ability > post[0]) {
                        macro += scroll("up");
                        for (j = 0; j < 6; j++) {
                            pos[j] -= 2;
                        }
                    }
                } else {
                    //Click ability
                    macro += getTime() + unitLoc[pos.indexOf(ability)];
                    macro += getTime() + endClick;
                    addTime(500000);
                    break;
                }

            }

            //Find and click other abilities if dualcast
            if (dc) {
                var test = 0;
                // First Ability
                while (true) {
                    if (pos.indexOf(ab1) === -1) {
                        if (ab1 > pos[5]) {
                            macro += scroll("down");
                            for (j = 0; j < 6; j++) {
                                pos[j] += 2;
                            }
                        } else if (ab1 < pos[0]) {
                            macro += scroll("up");
                            for (j = 0; j < 6; j++) {
                                pos[j] -= 2;
                            }
                        }
                    } else {
                        //Click ability
                        macro += getTime() + unitLoc[pos.indexOf(ab1)];
                        macro += getTime() + endClick;
                        addTime(500000);
                        break;
                    }
                }

                //Second Ability
                while (true) {
                    if (pos.indexOf(ab2) === -1) {
                        if (ab2 > pos[5]) {
                            macro += scroll("down");
                            for (j = 0; j < 6; j++) {
                                pos[j] += 2;
                            }
                        } else if (ab2 < pos[0]) {
                            macro += scroll("up");
                            for (j = 0; j < 6; j++) {
                                pos[j] -= 2;
                            }
                        }
                    } else {
                        //Click ability
                        macro += getTime() + unitLoc[pos.indexOf(ab2)];
                        macro += getTime() + endClick;
                        addTime(500000);
                        break;
                    }
                }
            }

            //Click target if set
            if (target !== 0) {
                macro += getTime() + unitLoc[target - 1];
                macro += getTime() + endClick;
                addTime(500000);
            }

            break;
        case 'item':

            //Press unit
            macro += getTime() + unitLoc[unit - 1];
            //scroll left
            for (var i = 0; i < 100; i++) {
                macro += (time += 5000) + vinput + "2:" + unitRowLoc[unit - 1] + ":" + (parseInt(unitColLoc[unit - 1]) + i) + "\r\n";
            }
            macro += getTime() + endClick;

            //Scroll to item Position
            addTime(500000);
            //Find and click on item
            while (true) {
                if (pos.indexOf(ability) === -1) {
                    if (ability > pos[5]) {
                        macro += scroll("down");
                        for (j = 0; j < 6; j++) {
                            pos[j] += 2;
                        }
                    } else if (ability > post[0]) {
                        macro += scroll("up");
                        for (j = 0; j < 6; j++) {
                            pos[j] -= 2;
                        }
                    }
                } else {
                    //Click item
                    macro += getTime() + unitLoc[pos.indexOf(ability)];
                    macro += getTime() + endClick;
                    addTime(500000);
                    break;
                }

            }

            //Click target if set
            if (target !== 0) {
                macro += getTime() + unitLoc[target - 1];
                macro += getTime() + endClick;
                addTime(500000);
            }

            break;
    }

    return macro;
}

//Scrolls ability/item window in the supplied direction by 1 complete row
function scroll(dir) {
    var macro = "";
    var i;
    if (dir == "down") {
        macro += getTime() + vinput + "0:1090:365\r\n";
        for (i = 0; i < 120; i++) {
            macro += (time += 1000) + vinput + "2:" + (1089 - i) + ":365\r\n";
        }
        macro += getTime() + endClick;
    } else if (dir == "up") {
        macro += getTime() + vinput + "0:969:365\r\n";
        for (i = 0; i < 120; i++) {
            macro += (time += 1000) + vinput + "2:" + (969 + i) + ":365\r\n";
        }
        macro += getTime() + endClick;
    }
    return macro;
}

//generate and returns string to add wait time at end of macro
function getEndWaitString() {
    var delay = parseInt($(".end-wait-input").val());
    var macro = "";

    delay = delay * 1000000;

    addTime(delay);

    macro += getTime() + mouse;

    return macro;
}

//Generates and json string with all turn information
function getTurnObject(turn) {
    var unit;
    var action;
    var ability;
    var target;
    var dc;
    var ab1;
    var ab2;
    var delays = [];
    var order = [];
    var adv;
    var delayForm;
    var repeat;
    var auto;
    var turnDelay;
    var actions = [
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""]
    ];

    var turnObj = {
        unit1: {
            action: "",
            ability: "",
            target: "",
            dc: "",
            ab1: "",
            ab2: ""
        },
        unit2: {
            action: "",
            ability: "",
            target: "",
            dc: "",
            ab1: "",
            ab2: ""
        },
        unit3: {
            action: "",
            ability: "",
            target: "",
            dc: "",
            ab1: "",
            ab2: ""
        },
        unit4: {
            action: "",
            ability: "",
            target: "",
            dc: "",
            ab1: "",
            ab2: ""
        },
        unit5: {
            action: "",
            ability: "",
            target: "",
            dc: "",
            ab1: "",
            ab2: ""
        },
        unit6: {
            action: "",
            ability: "",
            target: "",
            dc: "",
            ab1: "",
            ab2: ""
        },
        delays: [],
        order: [],
        turnDelay: 0,
        repeat: false,
        auto: false
    };


    repeat = $(".turn-" + (turn)).find("input[name='repeat']:checked").val();
    auto = $(".turn-" + (turn)).find("input[name='auto']:checked").val();

    for (var j = 1; j < 7; j++) {

        unit = j;
        action = $(".turn-" + (turn)).find("input[name='unit-" + j + "-action']:checked").val();
        ability = $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.ability-select').val();
        target = $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.target-select').val();
        if ($(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']:checked").val() === "true") {
            dc = true;
        } else {
            dc = false;
        }
        ab1 = $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc1-ability-select').val();
        ab2 = $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc2-ability-select').val();

        actions[(j - 1)][0] = action;
        actions[(j - 1)][1] = ability;
        actions[(j - 1)][2] = target;
        actions[(j - 1)][3] = dc;
        actions[(j - 1)][4] = ab1;
        actions[(j - 1)][5] = ab2;

    }

    adv = $(".turn-" + (turn)).find(".advanced-options");
    delayForm = adv.find(".delay-unit-form");
    delayForm.each(function (index) {
        order.push(parseInt($(this).data("unit")));
        delays.push(parseInt($(this).find(".delay-value").val()) * 1000);
    });

    turnDelay = parseInt($(".turn-" + (turn)).find(".advanced-options").find(".turn-delay").val()) * 1000000;

    turnObj.unit1.action = actions[0][0];
    turnObj.unit1.ability = actions[0][1];
    turnObj.unit1.target = actions[0][2];
    turnObj.unit1.dc = actions[0][3];
    turnObj.unit1.ab1 = actions[0][4];
    turnObj.unit1.ab2 = actions[0][5];
    turnObj.unit2.action = actions[1][0];
    turnObj.unit2.ability = actions[1][1];
    turnObj.unit2.target = actions[1][2];
    turnObj.unit2.dc = actions[1][3];
    turnObj.unit2.ab1 = actions[1][4];
    turnObj.unit2.ab2 = actions[1][5];
    turnObj.unit3.action = actions[2][0];
    turnObj.unit3.ability = actions[2][1];
    turnObj.unit3.target = actions[2][2];
    turnObj.unit3.dc = actions[2][3];
    turnObj.unit3.ab1 = actions[2][4];
    turnObj.unit3.ab2 = actions[2][5];
    turnObj.unit4.action = actions[3][0];
    turnObj.unit4.ability = actions[3][1];
    turnObj.unit4.target = actions[3][2];
    turnObj.unit4.dc = actions[3][3];
    turnObj.unit4.ab1 = actions[3][4];
    turnObj.unit4.ab2 = actions[3][5];
    turnObj.unit5.action = actions[4][0];
    turnObj.unit5.ability = actions[4][1];
    turnObj.unit5.target = actions[4][2];
    turnObj.unit5.dc = actions[4][3];
    turnObj.unit5.ab1 = actions[4][4];
    turnObj.unit5.ab2 = actions[4][5];
    turnObj.unit6.action = actions[5][0];
    turnObj.unit6.ability = actions[5][1];
    turnObj.unit6.target = actions[5][2];
    turnObj.unit6.dc = actions[5][3];
    turnObj.unit6.ab1 = actions[5][4];
    turnObj.unit6.ab2 = actions[5][5];

    turnObj.delays = delays;
    turnObj.order = order;
    turnObj.turnDelay = turnDelay;
    turnObj.repeat = repeat;
    turnObj.auto = auto;

    var turnString = JSON.stringify(turnObj);

    return turnString;
}

//Sets turns options based on supplied json string
function setTurnValues(json, turn) {

    var turnObj = JSON.parse(json);
    var counter = 0;
    var unit;

    for (var i = 0; i < 6; i++) {
        //Select the right unit
        switch (i) {
            case 0:
                unit = turnObj.unit1;
                break;
            case 0:
                unit = turnObj.unit2;
                break;
            case 0:
                unit = turnObj.unit3;
                break;
            case 0:
                unit = turnObj.unit4;
                break;
            case 0:
                unit = turnObj.unit5;
                break;
            case 0:
                unit = turnObj.unit6;
                break;
        }

        $(".turn-" + (turn)).find(".unit-" + (i + 1)).find("input[value='" + unit.action + "']").click();
        $(".turn-" + (turn)).find('.unit-' + (i + 1) + '-action').find('.ability-select').val(unit.ability);
        $(".turn-" + (turn)).find('.unit-' + (i + 1) + '-action').find('.target-select').val(unit.target);
        if (unit.dc === true) {
            $(".turn-" + (turn)).find('.unit-' + (i + 1) + '-action').find("input[name='dualcast']").prop('checked', true);
            $(".turn-" + (turn)).find('.unit-' + (i + 1) + '-action').find("input[name='dualcast']").click();
        } else {
            $(".turn-" + (turn)).find('.unit-' + (i + 1) + '-action').find("input[name='dualcast']").prop('checked', false);
        }
        $(".turn-" + (turn)).find('.unit-' + (i + 1) + '-action').find('.dc1-ability-select').val(unit.ab1);
        $(".turn-" + (turn)).find('.unit-' + (i + 1) + '-action').find('.dc2-ability-select').val(unit.ab2);

    }

    adv = $(".turn-" + (turn)).find(".advanced-options");
    delayForm = adv.find(".delay-unit-form");

    //Remove all forms
    adv.empty();

    //Add forms back in order
    for (var i = 0; i < 6; i++) {
        adv.append(delayForm[turnObj.order[i] - 1]);
    }
    
    //Get with new order
    adv = $(".turn-" + (turn)).find(".advanced-options");
    delayForm = adv.find(".delay-unit-form");

    delayForm.each(function (index) {
        $(this).find(".delay-value").val(turnObj.delays[counter] / 1000);
        counter++;
    });

    $(".turn-" + (turn)).find(".advanced-options").find(".turn-delay").val(turnObj.turnDelay / 1000000);
    if(turnObj.repeat === "repeat") $(".turn-" + (turn)).find("input[value='repeat']").prop('checked', true);
    if(turnObj.auto === "auto") $(".turn-" + (turn)).find("input[value='auto']").prop('checked', true);

}

//generate and outputs json string for turn
function exportTurn(btn) {
    var turnString;
    var turn = btn.parents(".turn").data("turn");

    turnString = getTurnObject(turn);

    btn.parents(".data-options").find(".import-export").val(turnString);
}

//Sets turn options based upon import json string
function importTurn(btn) {
    var turnString;
    var turn = btn.parents(".turn").data("turn");

    turnString = btn.parents(".data-options").find(".import-export").val();

    setTurnValues(turnString, turn);
}

//Import turns from bottom box
//Will improve to add other options eventually
function importMacro() {
    var data = $('.macro-import-export').val();
    var turns;

    data = data.split('#');
    turns = data.length - 1;

    while($('.turn').length < turns - 1) {
        addTurn();
    }

    for (var i = 0; i < turns - 1; i++) {
        setTurnValues(data[i], i + 1);
    }

    importOptionValues(data[turns - 1]);

}

//Generates string containing all turn data
function exportMacro() {
    var macroDataString;
    var turnString = "";
    var turns = $('.turn').length;

    for (var i = 0; i < turns; i++) {
        turnString += getTurnObject(i+1);
        turnString += "#";
    }

    macroDataString = turnString;
    macroDataString += getOptionsObj();
    macroDataString += "#";


    $('.macro-import-export').val("");
    $('.macro-import-export').val(macroDataString);

}

//Gets all macro options as object
function getOptionsObj() {
    var optionObj = {
        mission: 0,
        companion: 0,
        companionManualDelay: 0,
        dailyDialog: false,
        rewardsSkip: false,
        startWait: 0,
        companionScrollWait: 0,
        companionClickWait: 0,
        departWait: 0,
        beginWait: 0,
        finalTurnWait: 0,
        endWait: 0,
        includeStart: true,
        includeEnd: true
    };

    optionObj.mission = $("#mission-num").val();
    optionObj.companion = $("input[name='companion']:checked").val();
    optionObj.companionManualDelay = $('#manual-time-form').val();
    if ($(".daily-dialog-box").is(':checked')) {
        optionObj.dailyDialog = true;
    } else {
        optionObj.dailyDialog = false;
    }
    optionObj.startWait = $('.start-wait-input').val();
    optionObj.companionScrollWait = $('.companion-scroll-wait-input').val();
    optionObj.companionClickWait = $('.companion-click-wait-input').val();
    optionObj.departWait = $('.depart-wait-input').val();
    optionObj.beginWait = $('.begin-wait-input').val();
    optionObj.finalTurnWait = $('.final-turn-wait-input').val();
    optionObj.endWait = $('.end-wait-input').val();
    if ($(".include-start-box").is(':checked')) {
        optionObj.includeStart = true;
    } else {
        optionObj.includeStart = false;
    }
    if ($(".include-end-box").is(':checked')) {
        optionObj.includeEnd = true;
    } else {
        optionObj.includeEnd = false;
    }
    if ($(".rewards-skip-box").is(':checked')) {
        optionObj.rewardsSkip = true;
    } else {
        optionObj.rewardsSkip = false;
    }

    return JSON.stringify(optionObj);
}

//Sets the global wait variables before macro generation
function setWaitValues() {
    startWait = parseInt($('.start-wait-input').val()) * 1000000;
    companionScrollWait = parseInt($('.companion-scroll-wait-input').val()) * 1000000;
    companionClickWait = parseInt($('.companion-click-wait-input').val()) * 1000000;
    departWait = parseInt($('.depart-wait-input').val()) * 1000000;
    beginWait = parseInt($('.begin-wait-input').val()) * 1000000;
    finalTurnWait = parseInt($('.final-turn-wait-input').val()) * 1000000;
}

//Sets the input fields with values from object
function importOptionValues(json) {

    var obj = JSON.parse(json);

    $("#mission-num").val(obj.mission);
    $("input[value='" + obj.companion + "']").click();
    toggleManualComp();
    $('#manual-time-form').val(obj.companionManualDelay);
    if (obj.dailyDialog && !$(".daily-dialog-box").is(':checked')) $(".daily-dialog-box").click();
    if (!obj.dailyDialog && $(".daily-dialog-box").is(':checked')) $(".daily-dialog-box").click();
    $('.start-wait-input').val(parseInt(obj.startWait));
    $('.companion-scroll-wait-input').val(parseInt(obj.companionScrollWait));
    $('.companion-click-wait-input').val(parseInt(obj.companionClickWait));
    $('.depart-wait-input').val(parseInt(obj.departWait));
    $('.begin-wait-input').val(parseInt(obj.beginWait));
    $('.final-turn-wait-input').val(parseInt(obj.finalTurnWait));
    $('.end-wait-input').val(parseInt(obj.endWait));
    if (obj.includeStart && !$(".include-start-box").is(':checked')) $(".include-start-box").click();
    if (!obj.includeStart && $(".include-start-box").is(':checked')) $(".include-start-box").click();
    if (obj.includeEnd && !$(".include-end-box").is(':checked')) $(".include-end-box").click();
    if (!obj.includeEnd && $(".include-end-box").is(':checked')) $(".include-end-box").click();
    if (obj.rewardsSkip && !$(".rewards-skip-box").is(':checked')) $(".rewards-skip-box").click();
    if (!obj.rewardsSkip && $(".rewards-skip-box").is(':checked')) $(".rewards-skip-box").click();
}

//Creates unit frames 2-6
function addUnitHtml() {
    var unit = $('.unit-container').clone();
    var clean;

    unit.find('.unit-1').removeClass('unit-1');
    unit.find('.unit-1-action').removeClass('unit-1-action');
    clean = unit.clone();

    for (var i = 2; i < 7; i++) {
        unit.find('.unit-div').addClass('unit-' + i);
        unit.find('.unit-title').text('Unit ' + i);
        unit.find('.unit-action').addClass('unit-' + i + '-action');
        unit.find("input[name='unit-1-action']").attr('name', 'unit-' + i + '-action');

       unit.appendTo('.unit-row');
       unit = clean.clone();
    }

    
}

function timeToString(t) {
    var s;
    var m;
    var h;
    var timeString;
    //Down to seconds, 2 decimals
    t = t / 1000000;
    s = t.toFixed(2);

    m = s/60;
    h = m/60;

    s = s % 60;
    m = m % 60;

    s =  Math.round(s * 100) / 100;
    m = Math.floor(m);
    h = Math.floor(h);

    timeString = "H:" + h + " M:" + m + " S:" + s;


    return timeString;
}

function convertToNox() {
  	// basic pattern
    var pattern = /(\d+)--VINPUT--MULTI:1:(\d):(-?\d+):(-?\d+)/g;
    // get the memu version
    var str = buildMacro();
    // remove the last two digits of timing first
    str = str.replace((/.{3}--VINPUT--/g), "--VINPUT--");
    // replace the multi-inputs
    var n = str.replace(pattern, "\$2|\$4|\$3|0|0|0|\$1|720|1280");  
    // replace the mouse clicks (needs two)
    var pattern2 = /(\d+)--VINPUT--MOUSE:(-?\d+):(-?\d+)/g;    
    var n2 = n.replace(pattern2, "0|0|0|0|0|0|$1|720|1280" + "\r\n" + "1|0|0|0|0|0|$1|720|1280");
    // var n2 = n.replace(pattern2, "");
    // flip x and y, reverse x
    var a = n2.split('\r\n');
    var start;
    var split;
    var t1, t2;
    for (var i = 0; i < a.length - 1; i++) {
        split = a[i].split('|');
        t1 = split[1];
        t2 = split[2];
        t2 = parseInt(t2);
        t1 = Math.abs(t1 - 720);
        split[2] = t2;
        split[1] = t1;
        split = split.join('|');
        a[i] = split;
    }
    a = a.join('\r\n');
    // write the output
    return a;
}
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

//toggles display of the main turn options
function toggleOptions(btn) {
    btn.parents(".card-block").children(".turn-options").toggleClass("hidden");
}

//Toggle display of turns timing menu
function toggleAdvanced(btn) {
    btn.parents(".turn-options").children(".advanced-options").toggleClass("hidden");
}

//Toggle display of the turns data menu
function toggleData(btn) {
    btn.parents(".turn-options").children(".data-options").toggleClass("hidden");
}

// function repeatToggle(btn) {
//     if (btn.is(':checked')) {
//         btn.parents('.right-align').children(".toggle-turn-options-btn").toggleClass("disabled");
//         if (!btn.parents(".card-block").children(".turn-options").hasClass('hidden')) {
//             btn.parents(".card-block").children(".turn-options").toggleClass("hidden");
//         }
//     } else {
//         btn.parents('.right-align').children(".toggle-turn-options-btn").toggleClass("disabled");
//         if (btn.parents(".card-block").children(".turn-options").hasClass('hidden')) {
//             btn.parents(".card-block").children(".turn-options").toggleClass("hidden");
//         }
//     }
//
// }

//Toggles display of the dualcast ability selects
function toggleDualCast(btn) {
    if (btn.is(':checked')) {
        if (btn.parents(".unit-action").children(".dualcast-select").hasClass('hidden')) {
            btn.parents(".unit-action").children(".dualcast-select").toggleClass("hidden");
        }
    } else {
        if (!btn.parents(".unit-action").children(".dualcast-select").hasClass('hidden')) {
            btn.parents(".unit-action").children(".dualcast-select").toggleClass("hidden");
        }
    }
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
    '--VINPUT--MULTI:1:0:860:30\r\n',
    '--VINPUT--MULTI:1:0:980:535\r\n',
    '--VINPUT--MULTI:1:0:980:30\r\n',
    '--VINPUT--MULTI:1:0:1100:535\r\n',
    '--VINPUT--MULTI:1:0:1100:30\r\n'
];

//Delay Global variables
// var startWait = 2000000; //wait after selecting mission before next button
// var companionScrollWait = 2000000; //Wait before scrolling companion screen
// var companionClickWait = 2000000; //Wait before clicking companion
// var departWait = 2000000;//wait before clicking depart
// var beginWait = 10000000;//wait before begining first turn after depart
// var finalTurnWait = 10000000;//Additional wait time afer last turn
var startWait; //wait after selecting mission before next button
var companionScrollWait; //Wait before scrolling companion screen
var companionClickWait; //Wait before clicking companion
var departWait;//wait before clicking depart
var beginWait;//wait before begining first turn after depart
var finalTurnWait;//Additional wait time afer last turn


var unitColLoc = ["535", "30", "535", "30", "535", "30"];
var unitRowLoc = ["860", "860", "980", "980", "1100", "1100"];

//Calls main macro building functions, returns complete macro
function buildMacro() {
    var macro = "";
    time = 100000;

    setWaitValues();

    macro += getMissionString();
    macro += getStartNextString();
    macro += getCompanionString();
    macro += getDepartString();
    macro += getTurnsString();
    macro += getEndSkipString();
    macro += getDailyQuestString();
    macro += getEndWaitString();

    return macro;
}

//Builds and returns string for selecting mission
function getMissionString() {
    var macro = "";
    var mission;

    mission = parseInt($("#mission-num").val());


    macro += time + vinput;

    switch (mission) {
        case 1:
            macro += "0:452:660\r\n";
            break;
        case 2:
            macro += "0:634:660\r\n";
            break;
        case 3:
            macro += "0:828:660\r\n";
            break;
        case 4:
            macro += "0:1020:660\r\n";
            break;
        case 5:
            macro += "0:1205:660\r\n";
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
            macro += getTime() + vinput + "0:828:660\r\n";
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
    var adv;
    var delayForm;
    var repeat;

    //Count how many turns
    turns = $('.turn').length;

    //For Each turn get each action
    for (var i = 0; i < turns; i++) {
        // repeat = $(".turn-" + (i + 1)).find("input[name='repeat']:checked").val();

        //For each unit
        for (var j = 1; j < 7; j++) {

            // if (repeat === "repeat") {
            //     macro += getTime() + vinput + "0:1230:450\r\n";
            //     macro += getTime() + endClick;
            //     break;
            // }

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
        }

        //Activate Units in order
        adv = $(".turn-" + (i + 1)).find(".advanced-options");
        delayForm = adv.find(".delay-unit-form");
        delayForm.each(function (index) {
            order.push(parseInt($(this).data("unit")));
            delays.push(parseInt($(this).find(".delay-value").val()) * 1000);
        });

        //Build activate string
        for (var y = 0; y < 6; y++) {
            // if (repeat === "repeat") break;
            macro += "" + (time += delays[y]) + unitLoc[order[y] - 1];
            macro += (time += 1) + endClick;
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

    //Next Click
    macro += getTime() + vinput + "0:1120:350\r\n";
    macro += getTime() + endClick;
    macro += getTime() + mouse;

    //wait 2 seconds
    addTime(2000000);

    //More Skips
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;

    //wait 2 seconds
    addTime(2000000);

    //More Skips
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;
    macro += getTime() + vinput + "0:1275:718\r\n";
    macro += getTime() + endClick;

    //wait 2 seconds
    addTime(2000000);

    //Next Click
    macro += getTime() + vinput + "0:1120:350\r\n";
    macro += getTime() + endClick;
    macro += getTime() + mouse;

    return macro;
}

//Builds and returns string to close daily quest dialog
function getDailyQuestString() {
    var macro = "";

    if ($(".daily-dialg-box").is(':checked')) {
        macro += getTime() + vinput + "0:791:534\r\n";
        macro += getTime() + endClick;
        macro += getTime() + vinput + "0:748:518\r\n";
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
    };


    repeat = $(".turn-" + (turn)).find("input[name='repeat']:checked").val();

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

    var turnString = JSON.stringify(turnObj);

    return turnString;
}

//Sets turns options based on supplied json string
function setTurnValues(json, turn) {

    var turnObj = JSON.parse(json);
    var counter = 0;

    repeat = $(".turn-" + (turnObj.turn)).find("input[value='repeat']:checked").val();

    var j = 1;

    // $(".turn-1").find("input[value='attack']").prop('checked', true);

    $(".turn-" + (turn)).find(".unit-1").find("input[value='" + turnObj.unit1.action + "']").prop('checked', true);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.ability-select').val(turnObj.unit1.ability);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.target-select').val(turnObj.unit1.target);
    if (turnObj.unit1.dc === true) {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', true);
    } else {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', false);
    }
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc1-ability-select').val(turnObj.unit1.ab1);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc2-ability-select').val(turnObj.unit1.ab2);

    j++;

    $(".turn-" + (turn)).find(".unit-2").find("input[value='" + turnObj.unit2.action + "']").prop('checked', true);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.ability-select').val(turnObj.unit2.ability);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.target-select').val(turnObj.unit2.target);
    if (turnObj.unit2.dc === true) {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', true);
    } else {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', false);
    }
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc1-ability-select').val(turnObj.unit2.ab1);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc2-ability-select').val(turnObj.unit2.ab2);

    j++;

    $(".turn-" + (turn)).find(".unit-3").find("input[value='" + turnObj.unit3.action + "']").prop('checked', true);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.ability-select').val(turnObj.unit3.ability);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.target-select').val(turnObj.unit3.target);
    if (turnObj.unit3.dc === true) {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', true);
    } else {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', false);
    }
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc1-ability-select').val(turnObj.unit3.ab1);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc2-ability-select').val(turnObj.unit3.ab2);

    j++;

    $(".turn-" + (turn)).find(".unit-4").find("input[value='" + turnObj.unit4.action + "']").prop('checked', true);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.ability-select').val(turnObj.unit4.ability);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.target-select').val(turnObj.unit4.target);
    if (turnObj.unit4.dc === true) {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', true);
    } else {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', false);
    }
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc1-ability-select').val(turnObj.unit4.ab1);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc2-ability-select').val(turnObj.unit4.ab2);

    j++;

    $(".turn-" + (turn)).find(".unit-5").find("input[value='" + turnObj.unit5.action + "']").prop('checked', true);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.ability-select').val(turnObj.unit5.ability);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.target-select').val(turnObj.unit5.target);
    if (turnObj.unit5.dc === true) {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', true);
    } else {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', false);
    }
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc1-ability-select').val(turnObj.unit5.ab1);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc2-ability-select').val(turnObj.unit5.ab2);

    j++;

    $(".turn-" + (turn)).find(".unit-6").find("input[value='" + turnObj.unit6.action + "']").prop('checked', true);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.ability-select').val(turnObj.unit6.ability);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.target-select').val(turnObj.unit6.target);
    if (turnObj.unit6.dc === true) {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', true);
    } else {
        $(".turn-" + (turn)).find('.unit-' + j + '-action').find("input[name='dualcast']").prop('checked', false);
    }
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc1-ability-select').val(turnObj.unit6.ab1);
    $(".turn-" + (turn)).find('.unit-' + j + '-action').find('.dc2-ability-select').val(turnObj.unit6.ab2);

    adv = $(".turn-" + (turn)).find(".advanced-options");
    delayForm = adv.find(".delay-unit-form");
    delayForm.each(function (index) {
        $(this).data("unit", turnObj.order[counter]);
        $(this).find(".delay-value").val(turnObj.delays[counter] / 1000);
        counter++;
    });

    $(".turn-" + (turn)).find(".advanced-options").find(".turn-delay").val(turnObj.turnDelay / 1000000);

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

//Sets the global wait variables before macro generation
function setWaitValues() {
  startWait = parseInt($('.start-wait-input').val()) * 1000000;
  companionScrollWait = parseInt($('.companion-scroll-wait-input').val()) * 1000000;
  companionClickWait = parseInt($('.companion-click-wait-input').val()) * 1000000;
  departWait = parseInt($('.depart-wait-input').val()) * 1000000;
  beginWait = parseInt($('.begin-wait-input').val()) * 1000000;
  finalTurnWait = parseInt($('.final-turn-wait-input').val()) * 1000000;
}

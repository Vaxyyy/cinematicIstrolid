/*
 * build 0.6.7
 * 
 * CinematicIstrolid
 * by Vaxyyy
 * 
 * ---------------------------------------------
 *
 * press 't' to turn CinematicIstrolid on and off.
 * 
 * ---------------------------------------------
 * 
 * ci.time
 *    number: default time in milliseconds.
 * 
 * ci.enabled
 *    true/false: code on or off.
 * 
 * ci.playerName
 *    name: default name.
 * 
 * ci.mode
 *    0: follows all ci.playerName units
 *    1: follows 1 units at a time.
 *    2: follows all units.
 * 
 * ci.resetTimer
 *    number: new time in milliseconds.
 * 
 * ci.newPlayerName
 *    name: new player name to follow.
 */
var ci = ci || {
    time: 3000, // 3sec
    enabled: false,
    playerName: commander.name.toLowerCase(),
    intv: null,
    mode: 2,
    window_body_orig: window.body,
    battlemode_onkeydown_orig: battleMode.onkeydown,

    newPlayerName: function (newName) {
        let ref = newName.toLowerCase();
        ci.playerName = ref;
        ci.resetTimer(ci.time)
        return ci.playerName;
    },
    resetTimer: function (newTime) {
        ci.time = newTime
        clearInterval(ci.intv);
        return ci.intv = setInterval(() => {
            if (ci.enabled) {
                battleMode.centerOnUnit = true;
                let owner = commander.number,
                    unitList = []
                    commander.selection = [];
                for (var p of intp.players) if (p.name.toLowerCase() === ci.playerName) owner = p.number;
                for (let i in intp.things) {
                    unit = intp.things[i];
                    if (unit.name === 'Unit' && !(unit.side === 'neutral' || unit.side === 'enemy')) {
                        if (ci.mode === 0) {
                            if (unit.owner === owner) {
                                commander.selection.push(unit);
                            }
                        } else if (ci.mode === 1) {
                            unitList.push(unit);
                        } else if (ci.mode === 2) {
                            console.log(unit);
                            commander.selection.push(unit);
                        }
                    }
                }
                if (ci.mode === 1) commander.selection.push(unitList[Math.floor(Math.random() * unitList.length)]);
                battleMode.zoom = 1.8;
            } else {
                battleMode.centerOnUnit = false;
                commander.selection = [];
                clearInterval(ci.intv);
            }
        }, ci.time);
    },
    drawBox: function () {
        if (ci.enabled && ui.mode === 'battle') {

            eval(onecup['import']());

            css('.center', function () {
                display('block');
                margin_left('auto');
                margin_right('auto');
                //width('50%');
            });
            css('.ci-mainBox', function () {
                background_color('rgba(0,0,0,.2)');
                border_radius('0px 0px 5px 5px');
                text_align('center');
                margin_right('auto');
                margin_left('auto');
                display('block');
                color('white')
                padding(4);
                width(164);
                height(64);
            });
            div('.ci-mainBox', () => {
                text('Cinematic Istrolid');
                img({
                    src: 'https://mk0localeyesvidpssgk.kinstacdn.com/wp-content/uploads/2019/05/camera.png',
                    width: 32,
                    height: 32,
                    class: 'center'
                });
            });
        }
    },
};

window.body = function () {
    let ret = ci.window_body_orig.call(this);
    ci.drawBox();
    return ret;
};
battleMode.onkeydown = e => {
    if (e.key === 't') {
        ci.enabled = !ci.enabled;
        ci.resetTimer(ci.time)
        ui.show = !ui.show;
        onecup.refresh();
    } else {
        return ci.battlemode_onkeydown_orig.call(this, e);
    }
};

var ci = ci || {
    time: 3000, // 3sec
    enabled: false,
    changing: false,
    playerName: commander,
    intv: null,
    mode: 2,

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
                commander.selection = [];
                let owner = commander.number,
                    unitList = [];
                for (var p of intp.players)
                    if (p.name.toLowerCase() === ci.playerName) owner = p.number;
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
        eval(onecup['import']());

        css('.center', function () {
            display('block');
            margin_left('auto');
            margin_right('auto');
        });
        css('.ci-mainBox', function () {
            background_color('rgba(0,0,0,.4)');
            border_radius('0px 0px 12px 12px');
            text_align('center');
            margin_right('auto');
            margin_left('auto');
            color('white')
            padding(4);
            width(164);
            height(64);
            top(0);
        });
        css('.ci-settingButton', function () {
            position('absolute')
            background_color('rgba(0,0,0,.4)');
            border_radius('0px 0px 0px 12px');
            text_align('center');
            color('white');
            font_size(12);
            height(64);
            width(64);
            right(0);
            top(0);
        });

        div('.ci-mainBox', () => {
            text('Cinematic Istrolid');
            img({
                src: 'img/ui/rank/rank13.png',
                width: 32,
                height: 32,
                class: 'center'
            });
        });

        div('.ci-settingButton', () => {
            img({
                src: 'img/ui/settings.png',
                width: 44,
                height: 44,
                class: 'center'
            });
            text('Settings');
            onclick(e => {
                ci.changing = !ci.changing;
            });
        });

        if (ci.changing) {
            ci.drawSettingsBox();
        }
    },
    drawSettingsBox: function () {
        eval(onecup['import']());

        css('.ci-settingBox', function () {
            position('absolute')
            background_color('rgba(0,0,0,.4)');
            border_radius('12px 0px 0px 12px');
            text_align('center');
            color('white');
            font_size(14);
            height(512);
            width(256);
            right(0);
            top(128);
        });

        div('.ci-settingBox', () => {
            text('test');
        });
    },
};
let window_body_orig = window.body;
let window_onkeydown_orig = window.onkeydown;

window.body = function () {
    let ret = window_body_orig.call(this);
    if (ci.enabled && ui.mode === 'battle') {
        ci.drawBox();
    }
    return ret;
};
window.DEFAULT_SETTINGS.Cinematic = {keys:[{ which: 84 }, null ]}
window.onkeydown = e => {
    let ret = window_onkeydown_orig.call(this, e);
    if (e.target.type === "text" || e.target.type === "password" || e.target.nodeName === "TEXTAREA") {
        return;
    }
    if (settings.key(e, "Cinematic") && ui.mode === 'battle') {
        ci.enabled = !ci.enabled;
        ci.resetTimer(ci.time)
        ui.show = !ui.show;
        onecup.refresh();
    }
    return ret;
};

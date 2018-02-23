function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}


function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



$('#rgb').on('change', function(){
    var val = $(this).val();
    if (val[0] !== "#" ) {
        val = "#" + val;
    }
    if (val.length == 4 || val.length == 7) {
        startParse(val);
    }
});
$('#s_ratio').on('change', function() {
    var val = Number($(this).val());
    if (isNaN(val)) return;
    s_ratio = val;
    changeRatio();
});
$('#v_ratio').on('change', function() {
    var val = Number($(this).val());
    if (isNaN(val)) return;
    v_ratio = val;
    changeRatio();
});

function changeRatio() {
    $('#color2 span').text('s*' + s_ratio + ' b*' + v_ratio)
    reserseParse()
}

$('#h, #s, #v').on('mousemove', function() {
    $(this).parent().next().text($(this).val() * 100)
    reserseParse();
})

function startParse(hex) {
    $("#color").css({
        'background-color': hex
    })
    var rgb = hexToRgb(hex);
    var hsv = RGBtoHSV(rgb.r, rgb.g, rgb.b);
    $("#h").val(hsv.h.toFixed(2)).parent().next().text(hsv.h.toFixed(2) * 100)
    $("#s").val(hsv.s.toFixed(2)).parent().next().text(hsv.s.toFixed(2) * 100)
    $("#v").val(hsv.v.toFixed(2)).parent().next().text(hsv.v.toFixed(2) * 100)

    contraster(hsv);
    save();
}

var s_ratio = 1.1;
var v_ratio = 0.8;

function contraster(hsv) {
    contrasterSingle(hsv.h, hsv.s + 0.05, hsv.v - 0.1, "#color1");
    console.log(s_ratio);
    contrasterSingle(hsv.h, hsv.s * s_ratio > 1 ? 1 : hsv.s * s_ratio, hsv.v * v_ratio > 1 ? 1 : hsv.v * v_ratio , "#color2");
}
function contrasterSingle(h, s, v, selector) {
    var rgb = HSVtoRGB(h,s,v);
    var rgbText = 'RGB('+rgb.r+","+ rgb.g +","+rgb.b+")";
    $(selector).css({
        'background-color': rgbText
    })
}

function reserseParse() {
    var h = parseFloat($("#h").val());
    var s = parseFloat($("#s").val());
    var v = parseFloat($("#v").val());
    var rgb = HSVtoRGB(h,s,v);
    var rgbText = 'RGB('+rgb.r+","+ rgb.g +","+rgb.b+")";
    $("#color").css({
        'background-color': rgbText
    })
    $('#rgb').val(rgbToHex(rgb.r, rgb.g, rgb.b));
    contraster({
        h: h,
        s: s,
        v: v
    });
}

function save() {
    var rects = $('.rects').clone();
    rects.removeClass('rects')
        .find('.rect')
        .removeClass('rect')
        .addClass('matrix')
        .removeAttr('id')
        .css({
            width: 150,
            height: 50
        });
    rects.find('span').css({
        bottom:-20,
        top: 'auto',
        right: 'auto',
        left: 50
    })
    $('#list').append(rects);
}

$('button').click(function() {
    save();
})
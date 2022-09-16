// HEX color 
const colorRegExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
// RGB color 
const colorRegRGB = /[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}/g;
// RGBA color
const colorRegRGBA = /^[rR][gG][Bb][Aa][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*[\)]{1}$/;
// hsl color
const colorRegHSL = /^[hH][Ss][Ll][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[\)]$/;
// HSLA color
const colorRegHSLA = /^[hH][Ss][Ll][Aa][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*)[\)]$/;
/**
 * hex to rgba
 * @param {*} hex 
 * @param {*} alpha 
 */
function colorHexToRgba(hex, alpha) {
    let a = alpha || 1, hColor = hex.toLowerCase(), hLen = hex.length, rgbaColor = [];
    if (hex && colorRegExp.test(hColor)) {
        //the hex length may be 4 or 7,contained the symbol of #
        if (hLen === 4) {
            let hSixColor = '#';
            for (let i = 1; i < hLen; i++) {
                let sColor = hColor.slice(i, i + 1);
                hSixColor += sColor.concat(sColor);
            }
            hColor = hSixColor;
        }
        for (let j = 1, len = hColor.length; j < len; j += 2) {
            rgbaColor.push(parseInt('0X' + hColor.slice(j, j + 2), 16));
        }
        return removeAllSpace(("rgba(" + rgbaColor.join(",") + ',' + a + ")"));
    } else {
        return removeAllSpace(hColor);
    }
}
/**
 * rgba to hex
 * @param {*} rgba 
 */
function colorRgbaToHex(rgba) {
    const hexObject = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' },
        hexColor = function (value) {
            value = Math.min(Math.round(value), 255);
            const high = Math.floor(value / 16), low = value % 16;
            return '' + (hexObject[high] || high) + (hexObject[low] || low);
        }
    const value = '#';
    if (/rgba?/.test(rgba)) {
        let values = rgba.replace(/rgba?\(/, '').replace(/\)/, '').replace(/[\s+]/g, '').split(','), color = '';
        values.map((value, index) => {
            if (index <= 2) {
                color += hexColor(value);
            }
        })
        return removeAllSpace(value + color);
    }
}
/**
 * hsva to rgba
 * @param {*} hsva 
 * @param {*} alpha 
 */
function colorHsvaToRgba(hsva, alpha) {
    let r, g, b, a = hsva.a;//rgba(r,g,b,a)
    let h = hsva.h, s = hsva.s * 255 / 100, v = hsva.v * 255 / 100;//hsv(h,s,v)
    if (s === 0) {
        r = g = b = v;
    } else {
        let t = v, p = (255 - s) * v / 255, q = (t - p) * (h % 60) / 60;
        if (h === 360) {
            r = t; g = b = 0;
        } else if (h < 60) {
            r = t; g = p + q; b = p;
        } else if (h < 120) {
            r = t - q; g = t; b = p;
        } else if (h < 180) {
            r = p; g = t; b = p + q;
        } else if (h < 240) {
            r = p; g = t - q; b = t;
        } else if (h < 300) {
            r = p + q; g = p; b = t;
        } else if (h < 360) {
            r = t; g = p; b = t - q;
        } else {
            r = g = b = 0;
        }
    }
    if (alpha >= 0 || alpha <= 1) a = alpha;
    return removeAllSpace(('rgba(' + Math.ceil(r) + ',' + Math.ceil(g) + ',' + Math.ceil(b) + ',' + a + ')'));
}

/**
 * rgba to hsva
 * @param {*} rgba 
 */
function colorRgbaToHsva(rgba) {
    const rgbaArr = rgba.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
    let a = rgbaArr.length < 4 ? 1 : Number(rgbaArr[3]);
    let r = parseInt(rgbaArr[0]) / 255,
        g = parseInt(rgbaArr[1]) / 255,
        b = parseInt(rgbaArr[2]) / 255;
    let h, s, v;
    let min = Math.min(r, g, b);
    let max = v = Math.max(r, g, b);
    let diff = max - min;
    if (max === 0) {
        s = 0;
    } else {
        s = 1 - min / max;
    }
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / diff + (g < b ? 6 : 0);
                break;
            case g:
                h = 2.0 + (b - r) / diff;
                break;
            case b:
                h = 4.0 + (r - g) / diff;
                break;
        }
        h = h * 60;
    }


    s = s * 100;
    v = v * 100;
    return {
        h,
        s,
        v,
        a
    }
}
/* 
* 任意色值（甚至是CSS颜色关键字）转换为RGBA颜色的方法
* 此方法IE9+浏览器支持，基于DOM特性实现 
* @param {*} color 
*/
function colorToRgba(color) {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    document.body.appendChild(div);
    const c = div.style.backgroundColor;
    document.body.removeChild(div);
    let isAlpha = c.match(/,/g) && c.match(/,/g).length > 2;
    let result = isAlpha ? c : c.slice(0, 2) + 'ba' + c.slice(3, c.length - 1) + ', 1)';
    return removeAllSpace(result);
};
/**
 * 判断是否是合格的颜色值
 * @param {*} color 
 */
function isValidColor(color) {
    // https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value#%E8%89%B2%E5%BD%A9%E5%85%B3%E9%94%AE%E5%AD%97
    let isTransparent = color === 'transparent';
    return colorRegExp.test(color) || colorRegRGB.test(color) || colorRegRGBA.test(color) || colorRegHSL.test(color) || colorRegHSLA.test(color) || (colorToRgba(color) !== 'rgba(0,0,0,0)' && !isTransparent) || isTransparent;
}
/**
 * 
 * @param {*} color 
 * @returns 
 */
function isAlphaColor(color){
    return colorRegRGB.test(color) || colorRegRGBA.test(color) || colorRegHSL.test(color) || colorRegHSLA.test(color);
}

function removeAllSpace(value) {
    return value.replace(/\s+/g, "");;
}